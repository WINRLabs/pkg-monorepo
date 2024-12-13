'use client';

import {
  BaccaratFormFields,
  BaccaratGameResult,
  BaccaratGameSettledResult,
  BaccaratTemplate,
  BaccaratTheme,
  BetHistoryTemplate,
  GameType,
  useGame,
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
import React, { useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData } from 'viem';

import { BaseGameProps } from '../../type';
import {
  Badge,
  RETRY_ATTEMPTS,
  useBetHistory,
  useGameStrategy,
  usePlayerGameStatus,
  useRetryLogic,
} from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import { BaccaratSettledEvent, GAME_HUB_EVENT_TYPES, prepareGameTransaction } from '../utils';

const log = debug('worker:BaccaratWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  onAnimationCompleted?: (result: BaccaratGameSettledResult) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
  theme?: Partial<BaccaratTheme>;
}

export default function BaccaratGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerReIterate, refetchPlayerGameStatus } = usePlayerGameStatus({
    gameAddress: gameAddresses.baccarat,
    gameType: GameType.BACCARAT,
    wagmiConfig,
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const [formValues, setFormValues] = useState<BaccaratFormFields>({
    wager: props?.minWager || 1,
    playerWager: 0,
    bankerWager: 0,
    tieWager: 0,
    betCount: 0,
    increaseOnWin: 0,
    increaseOnLoss: 0,
    stopGain: 0,
    stopLoss: 0,
  });

  const gameEvent = useListenGameEvent(gameAddresses.baccarat);

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

  const [baccaratResults, setBaccaratResults] = useState<BaccaratGameResult | null>(null);
  const [baccaratSettledResult, setBaccaratSettledResult] =
    React.useState<BaccaratGameSettledResult | null>(null);

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

  const getEncodedTxData = (v: BaccaratFormFields) => {
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
          name: 'tieWins',
          type: 'uint16',
        },
        {
          name: 'bankWins',
          type: 'uint16',
        },
        {
          name: 'playerWins',
          type: 'uint16',
        },
      ],
      [v.tieWager, v.bankerWager, v.playerWager]
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
        gameAddresses.baccarat as Address,
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

  const { onLevelUp, handleGetBadges } = useGame();

  const onGameSubmit = async (v: BaccaratFormFields, errCount = 0) => {
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
      if (isPlayerHaltedRef.current && onLevelUp) await onLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedTxData(v),
        method: 'sendGameOperation',
        target: controllerAddress,
      });

      handleErrorLogic(v, RETRY_ATTEMPTS - 2 + errCount, null, 2000);
    } catch (e: any) {
      handleErrorLogic(v, errCount, e);
    }
  };

  const { handleErrorLogic, clearIterationIntervals } = useRetryLogic<BaccaratFormFields>({
    onSubmit: onGameSubmit,
    playerReIterate,
    cb: () => refetchPlayerGameStatus(),
  });

  React.useEffect(() => {
    if (
      gameEvent?.logic == eventLogic &&
      gameEvent?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled
    ) {
      const { hands, win, converted } = gameEvent.program[0].data as BaccaratSettledEvent;

      setBaccaratResults({
        playerHand: hands.player,
        bankerHand: hands.banker,
      });

      // clearIterationTimeout
      clearIterationIntervals();

      const { wager, tieWager, playerWager, bankerWager } = formValues;
      const totalWager = wager * (tieWager + playerWager + bankerWager);

      setBaccaratSettledResult({
        won: win,
        payout: win ? converted.payout : 0,
        wager: totalWager,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.BACCARAT,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const onGameCompleted = (result: BaccaratGameSettledResult) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();
    if (handleGetBadges) {
      handleGetBadges({
        totalWager: result.wager,
        totalPayout: result.payout,
        onPlayerStatusUpdate: props.onPlayerStatusUpdate,
      });
    }
  };

  const onAutoBetModeChange = () => clearIterationIntervals();

  const sessionStore = useSessionStore();
  const isPinNotFound =
    (!sessionStore.pin || !localStorage['session-store']) && !currentAccount.isSocialLogin;

  return (
    <>
      <BaccaratTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        baccaratResults={baccaratResults}
        baccaratSettledResults={baccaratSettledResult}
        onAnimationCompleted={onGameCompleted}
        onFormChange={setFormValues}
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
