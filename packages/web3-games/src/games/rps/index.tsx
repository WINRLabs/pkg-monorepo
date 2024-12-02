'use client';

import {
  BetHistoryTemplate,
  GameType,
  RockPaperScissors,
  RpsFormFields,
  RPSGameResult,
  RpsTemplate,
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

const log = debug('worker:RpsWeb3');

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
  onAnimationCompleted?: (result: RPSGameResult[]) => void;
  onAnimationSkipped?: (result: RPSGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function RpsGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.rps,
      gameType: GameType.RPS,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = useState<RpsFormFields>({
    betCount: 0,
    rpsChoice: RockPaperScissors.ROCK,
    stopGain: 0,
    stopLoss: 0,
    increaseOnLoss: 0,
    increaseOnWin: 0,
    wager: props?.minWager || 1,
  });

  const {
    addResult,
    updateGame,
    skipAll,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame', 'skipAll']);

  const gameEvent = useListenGameEvent(gameAddresses.rps);

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

  const [rpsResult, setRpsResult] = useState<DecodedEvent<any, SingleStepSettledEvent>>();
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

  const rpsSteps = useMemo(() => {
    if (!rpsResult) return [];

    return rpsResult?.program?.[0]?.data.converted.steps.map((s) => ({
      rps: s.outcome as unknown as RockPaperScissors,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [rpsResult]);

  const getEncodedTxData = (v: RpsFormFields) => {
    const { wagerInWei, stopGainInWei, stopLossInWei } = prepareGameTransaction({
      wager: v.wager,
      selectedCurrency: selectedToken,
      lastPrice: getTokenPrice(selectedToken.priceKey),
    });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: 'data',
          type: 'uint8',
        },
      ],
      [Number(v.rpsChoice)]
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
        gameAddresses.rps as Address,
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

  const onGameSubmit = async (v: RpsFormFields, errCount = 0) => {
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

  const { handleErrorLogic, clearIterationIntervals } = useRetryLogic<RpsFormFields>({
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
      setRpsResult(finalResult);
      clearIterationIntervals();
      updateGame({
        wager: formValues.wager || 0,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.RPS,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onGameCompleted = (result: RPSGameResult[]) => {
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

      const currentStepResult = rpsResult?.program?.[0]?.data.converted.steps[step - 1];

      if (!currentStepResult) return;

      addResult({
        won: currentStepResult.win,
        payout: currentStepResult.payout,
      });
    },
    [rpsResult]
  );

  const onAnimationSkipped = React.useCallback(
    (result: RPSGameResult[]) => {
      onGameCompleted(result);
      skipAll(
        result.map((value) => ({
          won: value.payout > 0,
          payout: value.payoutInUsd,
        }))
      );
    },
    [rpsResult]
  );

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
      <RpsTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={rpsSteps || []}
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
