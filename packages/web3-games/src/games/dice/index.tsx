'use client';

import {
  BetHistoryTemplate,
  DiceFormFields,
  DiceGameResult,
  DiceTemplate,
  GameType,
  toDecimals,
  useDiceGameStore,
  useLiveResultStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  useCurrentAccount,
  useFastOrVerified,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from '@winrlabs/web3';
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

type TemplateOptions = {};

interface TemplateWithWeb3Props extends BaseGameProps {
  options: TemplateOptions;
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

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
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

  const gameEvent = useListenGameEvent();

  const { eventLogic } = useFastOrVerified();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [diceResult, setDiceResult] = useState<DecodedEvent<any, SingleStepSettledEvent>>();
  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
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

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei, stopGainInWei, stopLossInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: formValues.stopGain,
      stopLoss: formValues.stopLoss,
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
      [
        toDecimals(Number(formValues.rollValue * 100), 0),
        formValues.rollType == 'UNDER' ? true : false,
      ]
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

    const encodedData: `0x${string}` = encodeFunctionData({
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

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues, selectedToken.address, priceFeed[selectedToken.priceKey]]);

  const handleTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.dice as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedParams.encodedTxData,
  });

  const onGameSubmit = async (f: DiceFormFields, errorCount = 0) => {
    clearLiveResults();
    updateGameStatus('PLAYING');
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
      updateGameStatus('ENDED');
      props.onError && props.onError(e);

      if (errorCount < 2) onGameSubmit(f, errorCount + 1);
    }
  };

  React.useEffect(() => {
    const finalResult = gameEvent;

    console.log(eventLogic, 'eventlog', finalResult?.logic);
    if (
      finalResult?.logic == eventLogic &&
      finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled
    ) {
      console.log('settled result');
      setDiceResult(finalResult);
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

  return (
    <>
      <DiceTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={diceSteps}
        onAnimationCompleted={onGameCompleted}
        onAnimationStep={onAnimationStep}
        onFormChange={(val) => {
          setFormValues(val);
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
