'use client';

import {
  BetHistoryTemplate,
  GameType,
  RouletteFormFields,
  RouletteGameResult,
  RouletteTemplate,
  useLiveResultStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  useCurrentAccount,
  useFastOrVerified,
  usePriceFeed,
  useSendTx,
  useSessionStore,
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
import {
  Badge,
  RETRY_ATTEMPTS,
  useBetHistory,
  useGameStrategy,
  useGetBadges,
  usePlayerGameStatus,
  useRetryLogic,
} from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
  SingleStepSettledEvent,
} from '../utils';

const log = debug('worker:RouletteWeb3');

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props extends BaseGameProps {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: RouletteGameResult[]) => void;
  onAnimationSkipped?: (result: RouletteGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function RouletteGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.roulette,
      gameType: GameType.ROULETTE,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = useState<RouletteFormFields>({
    wager: props.minWager || 1,
    totalWager: 0,
    betCount: 0,
    selectedNumbers: new Array(145).fill(0),
    increaseOnLoss: 0,
    increaseOnWin: 0,
    stopGain: 0,
    stopLoss: 0,
  });

  const {
    addResult,
    updateGame,
    skipAll,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame', 'skipAll']);

  const gameEvent = useListenGameEvent(gameAddresses.roulette);

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
  const { getTokenPrice } = usePriceFeed();

  const [rouletteResult, setRouletteResult] = useState<DecodedEvent<any, SingleStepSettledEvent>>();
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

  const rouletteSteps = useMemo(() => {
    if (!rouletteResult) return [];

    return rouletteResult?.program?.[0]?.data.converted.steps.map((s) => ({
      won: s.win,
      outcome: s.outcome,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [rouletteResult]);

  const getEncodedTxData = (v: RouletteFormFields) => {
    const { wagerInWei, stopGainInWei, stopLossInWei } = prepareGameTransaction({
      wager: v.wager,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken,
      lastPrice: getTokenPrice(selectedToken.priceKey),
    });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: 'data',
          type: 'uint8[145]',
        },
      ],
      [v.selectedNumbers]
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
        gameAddresses.roulette as Address,
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

  const onGameSubmit = async (v: RouletteFormFields, errCount = 0) => {
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

      handleErrorLogic(v, RETRY_ATTEMPTS - 2 + errCount, null, 2000);
    } catch (e: any) {
      handleErrorLogic(v, errCount, e);
    }
  };

  const { handleErrorLogic, clearIterationIntervals } = useRetryLogic<RouletteFormFields>({
    onSubmit: onGameSubmit,
    playerReIterate,
    cb: () => refetchPlayerGameStatus(),
  });

  React.useEffect(() => {
    const finalResult = gameEvent;

    if (
      finalResult?.logic == eventLogic &&
      finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled
    ) {
      setRouletteResult(finalResult);
      clearIterationIntervals();

      const wager = formValues.wager;
      const selectedNumbers = formValues.selectedNumbers;

      const totalWager = selectedNumbers.reduce((acc, cur) => acc + cur, 0) * wager;

      updateGame({
        wager: totalWager || 0,
      });
    }
  }, [gameEvent]);

  const onAnimationStep = React.useCallback(
    (step: number) => {
      props.onAnimationStep && props.onAnimationStep(step);

      const currentStepResult = rouletteResult?.program?.[0]?.data.converted.steps[step - 1];

      if (!currentStepResult) return;

      log('step', rouletteResult?.program?.[0]?.data);

      const isWon = currentStepResult.win;

      addResult({
        won: isWon,
        payout: currentStepResult.payout,
      });
    },
    [rouletteResult]
  );

  const onAnimationSkipped = React.useCallback(
    (result: RouletteGameResult[]) => {
      onGameCompleted(result);
      skipAll(
        result.map((value) => ({
          won: value.payout > 0,
          payout: value.payoutInUsd,
        }))
      );
    },
    [rouletteResult]
  );

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.ROULETTE,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onGameCompleted = (result: RouletteGameResult[]) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const totalWager = formValues.wager;
    const totalPayout = result.reduce((acc, cur) => acc + cur.payoutInUsd, 0);
    handleGetBadges({ totalWager, totalPayout });
  };

  const onAutoBetModeChange = () => clearIterationIntervals();

  const sessionStore = useSessionStore();
  const isPinNotFound =
    (!sessionStore.pin || !localStorage['session-store']) && !currentAccount.isSocialLogin;

  React.useEffect(() => {
    return () => {
      clearLiveResults();
    };
  }, []);

  return (
    <>
      <RouletteTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={rouletteSteps || []}
        onAnimationCompleted={onGameCompleted}
        onFormChange={setFormValues}
        onAnimationStep={onAnimationStep}
        onAnimationSkipped={onAnimationSkipped}
        onAutoBetModeChange={onAutoBetModeChange}
        strategy={{
          createdStrategies,
          create: handleCreateStrategy,
          remove: handleRemoveStrategy,
          addDefaultCondition: handleAddDefaultBetCondition,
          removeCondition: handleRemoveCondition,
          updateBetCondition: handleUpdateBetCondition,
          updateProfitCondition: handleUpdateProfitCondition,
        }}
        isPinNotFound={isPinNotFound}
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
