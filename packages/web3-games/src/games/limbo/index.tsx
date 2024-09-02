'use client';

import {
  BetHistoryTemplate,
  GameType,
  LimboFormField,
  LimboGameResult,
  LimboTemplate,
  toDecimals,
  useLimboGameStore,
  useLiveResultStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  delay,
  useCurrentAccount,
  useFastOrVerified,
  useHandleTx,
  useNativeTokenBalance,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  WRAPPED_WINR_BANKROLL,
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
  onAnimationCompleted?: (result: LimboGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function LimboGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.limbo,
      gameType: GameType.LIMBO,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = useState<LimboFormField>({
    betCount: 0,
    limboMultiplier: 1.1,
    stopGain: 0,
    stopLoss: 0,
    increaseOnLoss: 0,
    increaseOnWin: 0,
    wager: props?.minWager || 1,
  });

  const maxWagerBySelection = toDecimals((props.maxWager || 100) / formValues.limboMultiplier, 2);

  const {
    addResult,
    updateGame,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame']);

  const { updateGameStatus } = useLimboGameStore(['updateGameStatus']);

  const gameEvent = useListenGameEvent();

  const { eventLogic } = useFastOrVerified();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [limboResult, setLimboResult] = useState<DecodedEvent<any, SingleStepSettledEvent>>();
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

  const limboSteps = useMemo(() => {
    if (!limboResult) return [];

    return limboResult?.program?.[0]?.data.converted.steps.map((s) => ({
      number: toDecimals(s.outcome / 100, 2),
      payout: s.payout,
      payoutInUsd: s.payout,
    })) as LimboGameResult[];
  }, [limboResult]);

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
          name: 'data',
          type: 'uint8',
        },
      ],
      [Number(toDecimals(formValues.limboMultiplier * 100, 0))]
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
        gameAddresses.limbo as Address,
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
  }, [
    formValues.limboMultiplier,
    formValues.stopGain,
    formValues.stopLoss,
    formValues.wager,
    selectedToken.address,
    priceFeed[selectedToken.priceKey],
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.limbo as Address,
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

  const isPlayerHaltedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  const nativeWinr = useNativeTokenBalance({ account: currentAccount.address || '0x' });
  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
    amount: nativeWinr.balance,
    spender: cashierAddress,
  });

  const onGameSubmit = async (f: LimboFormField, errorCount = 0) => {
    if (nativeWinr.balance > 0.1 && selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL)
      await wrapWinrTx();

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
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);

      if (errorCount < 3) {
        await delay(150);
        onGameSubmit(f, errorCount + 1);
      }
    }
  };

  React.useEffect(() => {
    const finalResult = gameEvent;
    if (
      finalResult?.logic == eventLogic &&
      finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled
    ) {
      setLimboResult(finalResult);
      updateGame({
        wager: formValues.wager || 0,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.LIMBO,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onGameCompleted = (result: LimboGameResult[]) => {
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

      const currentStepResult = limboResult?.program?.[0]?.data.converted.steps[step];

      if (!currentStepResult) return;

      addResult({
        won: currentStepResult.payout > 0,
        payout: currentStepResult.payout,
      });
    },
    [limboResult]
  );

  React.useEffect(() => {
    return () => {
      clearLiveResults();
    };
  }, []);

  return (
    <>
      <LimboTemplate
        {...props}
        maxWager={maxWagerBySelection}
        onSubmitGameForm={onGameSubmit}
        gameResults={limboSteps}
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
