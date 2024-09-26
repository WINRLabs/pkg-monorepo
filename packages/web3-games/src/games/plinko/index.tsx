'use client';

import {
  BetHistoryTemplate,
  GameType,
  PlinkoFormFields,
  PlinkoGameResult,
  PlinkoTemplate,
  PlinkoTemplateOptions,
  useLiveResultStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  ErrorCode,
  useCurrentAccount,
  useFastOrVerified,
  usePriceFeed,
  useSendTx,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import debug from 'debug';
import React, { useMemo, useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData } from 'viem';

import { BaseGameProps } from '../../type';
import { Badge, useBetHistory, useGetBadges, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
  SingleStepSettledEvent,
} from '../utils';

const log = debug('worker:PlinkoWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  options: PlinkoTemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  forceNoRetry?: boolean;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: PlinkoGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function PlinkoGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.plinko,
      gameType: GameType.PLINKO,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = useState<PlinkoFormFields>({
    betCount: 1,
    stopGain: 0,
    stopLoss: 0,
    increaseOnLoss: 0,
    increaseOnWin: 0,
    wager: props.minWager || 1,
    plinkoSize: 10,
  });

  const {
    addResult,
    updateGame,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame']);

  const gameEvent = useListenGameEvent();

  const { eventLogic } = useFastOrVerified();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [plinkoResult, setPlinkoResult] =
    useState<DecodedEvent<any, SingleStepSettledEvent<number[]>>>();
  const iterationTimeoutRef = React.useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = React.useRef<boolean>(true);
  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedToken.address],
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const plinkoSteps = useMemo(() => {
    if (!plinkoResult) return [];

    return plinkoResult?.program?.[0]?.data.converted.steps.map((s) => ({
      outcomes: s.outcome,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [plinkoResult]);

  const getEncodedTxData = (v: PlinkoFormFields) => {
    const { wagerInWei, stopGainInWei, stopLossInWei } = prepareGameTransaction({
      wager: v.wager,
      stopGain: v.stopGain,
      stopLoss: v.stopLoss,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: 'data',
          type: 'uint8',
        },
      ],
      [Number(v.plinkoSize)]
    );

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'stopGain', type: 'uint128' },
        { name: 'stopLoss', type: 'uint128' },
        { name: 'count', type: 'uint8' },
        { name: 'data', type: 'bytes' },
      ],
      [
        wagerInWei,
        stopGainInWei as bigint,
        stopLossInWei as bigint,
        formValues.betCount || 1,
        encodedChoice,
      ]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.plinko as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });
  };

  const sendTx = useSendTx();
  const isPlayerHaltedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });

  const onGameSubmit = async (v: PlinkoFormFields, errCount = 0) => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedTxData(v),
        target: controllerAddress,
        method: 'sendGameOperation',
      });

      if (isMountedRef.current && !props.forceNoRetry) {
        // TODO: wtf
        const t = setTimeout(() => handleFail(v), 2000);
        iterationTimeoutRef.current.push(t);
      }
    } catch (e: any) {
      if (isMountedRef.current) {
        const t = setTimeout(() => handleFail(v, errCount + 1, e), 750);
        iterationTimeoutRef.current.push(t);
      }
    }
  };

  const retryGame = async (v: PlinkoFormFields, errCount = 0) => onGameSubmit(v, errCount);

  const handleFail = async (v: PlinkoFormFields, errCount = 0, e?: any) => {
    log('error', e, e?.code);
    refetchPlayerGameStatus();

    if (e?.code == ErrorCode.DailyLimitExceeded && errCount == 0) {
      // TOOD: allowed errors????
      props.onError && props.onError(e);
      iterationTimeoutRef.current.forEach((t) => clearTimeout(t));
      return;
    }

    if (errCount > 3) {
      iterationTimeoutRef.current.forEach((t) => clearTimeout(t));
      return;
    }

    if (e?.code == ErrorCode.UserRejectedRequest) return;

    if (e?.code == ErrorCode.SessionWaitingIteration) {
      log('SESSION WAITING ITERATION');
      await playerReIterate();
      return;
    }

    log('RETRY GAME CALLED AFTER 750MS');
    retryGame(v, errCount);
  };

  React.useEffect(() => {
    const finalResult = gameEvent;

    if (
      finalResult?.logic == eventLogic &&
      finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled
    ) {
      setPlinkoResult(finalResult);

      // clearIterationTimeout
      iterationTimeoutRef.current.forEach((t) => clearTimeout(t));

      updateGame({
        wager: formValues.wager || 0,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.PLINKO,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onGameCompleted = (result: PlinkoGameResult[]) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const totalWager = formValues.wager;
    const totalPayout = result.reduce((acc, cur) => acc + cur.payoutInUsd, 0);
    handleGetBadges({ totalWager, totalPayout });
  };

  const onAnimationStep = React.useCallback(
    (step: number) => {
      props.onAnimationStep && props.onAnimationStep(step);

      const currentStepResult = plinkoResult?.program?.[0]?.data.converted.steps[step];

      if (!currentStepResult) return;

      const isWon = currentStepResult.payout > formValues.wager;
      addResult({
        won: isWon,
        payout: currentStepResult.payout,
        gameType: GameType.PLINKO,
      });
    },
    [plinkoResult]
  );

  const onAutoBetModeChange = () => iterationTimeoutRef.current.forEach((t) => clearTimeout(t));

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      iterationTimeoutRef.current.forEach((t) => clearTimeout(t));

      clearLiveResults();
    };
  }, []);

  return (
    <>
      <PlinkoTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={plinkoSteps || []}
        onAnimationCompleted={onGameCompleted}
        onFormChange={setFormValues}
        onAnimationStep={onAnimationStep}
        onAutoBetModeChange={onAutoBetModeChange}
      />
      {!props.hideBetHistory && (
        <BetHistoryTemplate
          betHistory={betHistory || []}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
}
