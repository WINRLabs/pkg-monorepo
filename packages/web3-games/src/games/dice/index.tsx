'use client';

import {
  BetHistoryTemplate,
  DiceFormFields,
  DiceGameResult,
  DiceTemplate,
  DiceTemplateOptions,
  GameType,
  toDecimals,
  useDiceGameStore,
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
import { Badge, useBetHistory, useGameStrategy, useGetBadges, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
  SingleStepSettledEvent,
} from '../utils';

const log = debug('worker:DiceWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  options: DiceTemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: DiceGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function DiceGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.dice,
      gameType: GameType.RANGE,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const {
    addResult,
    updateGame,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame']);
  const { updateGameStatus } = useDiceGameStore(['updateGameStatus']);

  const [formValues, setFormValues] = useState<DiceFormFields>({
    betCount: 0,
    stopGain: 0,
    stopLoss: 0,
    wager: props?.minWager || 1,
    rollValue: 50,
    rollType: 'UNDER',
    winChance: 50,
    increaseOnLoss: 0,
    increaseOnWin: 0,
  });

  const gameEvent = useListenGameEvent(gameAddresses.dice);

  const {
    createdStrategies,
    handleCreateStrategy,
    handleRemoveStrategy,
    handleAddDefaultBetCondition,
    handleRemoveCondition,
    handleUpdateBetCondition,
    handleUpdateProfitCondition,
  } = useGameStrategy();

  const { eventLogic } = useFastOrVerified();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [diceResult, setDiceResult] = useState<DecodedEvent<any, SingleStepSettledEvent>>();
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

  const diceSteps = useMemo(() => {
    if (!diceResult) return [];

    return diceResult?.program?.[0]?.data.converted.steps.map((s) => ({
      resultNumber: s.outcome / 100,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [diceResult]);

  const getEncodedTxData = (v: DiceFormFields) => {
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
          name: 'choice',
          type: 'uint16',
        },
        {
          name: 'over',
          type: 'bool',
        },
      ],
      [toDecimals(Number(v.rollValue * 100), 0), v.rollType == 'UNDER' ? true : false]
    );

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'stopGain', type: 'uint128' },
        { name: 'stopLoss', type: 'uint128' },
        { name: 'count', type: 'uint8' },
        { name: 'data', type: 'bytes' },
      ],
      [wagerInWei, stopGainInWei as bigint, stopLossInWei as bigint, 1, encodedChoice]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.dice as Address,
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

  const onGameSubmit = async (v: DiceFormFields, errCount = 0) => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    updateGameStatus('PLAYING');
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
        method: 'sendGameOperation',
        target: controllerAddress,
      });
    } catch (e: any) {
      if (isMountedRef.current) {
        const t = setTimeout(() => handleFail(v, errCount + 1, e), 750);
        iterationTimeoutRef.current.push(t);
      }
    }
  };

  const retryGame = async (v: DiceFormFields, errCount = 0) => onGameSubmit(v, errCount);

  const handleFail = async (v: DiceFormFields, errCount = 0, e?: any) => {
    log('error', e, e?.code);
    refetchPlayerGameStatus();
    updateGameStatus('ENDED');

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

    log(eventLogic, 'eventlog', finalResult?.logic);
    if (
      finalResult?.logic == eventLogic &&
      finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled
    ) {
      log('settled result');
      setDiceResult(finalResult);

      // clearIterationInterval
      iterationTimeoutRef.current.forEach((t) => clearTimeout(t));
      log('CLEAR TIMEOUT');

      updateGame({
        wager: formValues.wager || 0,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.RANGE,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const onGameCompleted = (result: DiceGameResult[]) => {
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

      const currentStepResult = diceResult?.program?.[0]?.data.converted.steps[step];

      if (!currentStepResult) return;

      addResult({
        won: currentStepResult.payout > 0,
        payout: currentStepResult.payout,
      });
    },
    [diceResult]
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
      <DiceTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={diceSteps}
        onAnimationCompleted={onGameCompleted}
        onAnimationStep={onAnimationStep}
        onFormChange={setFormValues}
        onAutoBetModeChange={onAutoBetModeChange}
        options={props.options}
        strategy={{
          createdStrategies,
          create: handleCreateStrategy,
          remove: handleRemoveStrategy,
          addDefaultCondition: handleAddDefaultBetCondition,
          removeCondition: handleRemoveCondition,
          updateBetCondition: handleUpdateBetCondition,
          updateProfitCondition: handleUpdateProfitCondition,
        }}
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
