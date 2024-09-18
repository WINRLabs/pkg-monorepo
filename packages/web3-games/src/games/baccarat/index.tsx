'use client';

import {
  BaccaratFormFields,
  BaccaratGameResult,
  BaccaratGameSettledResult,
  BaccaratTemplate,
  BetHistoryTemplate,
  GameType,
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
import React, { useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData } from 'viem';

import { BaseGameProps } from '../../type';
import { Badge, useBetHistory, useGetBadges, usePlayerGameStatus } from '../hooks';
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
}

export default function BaccaratGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
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

  const gameEvent = useListenGameEvent();

  const { eventLogic } = useFastOrVerified();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [baccaratResults, setBaccaratResults] = useState<BaccaratGameResult | null>(null);
  const [baccaratSettledResult, setBaccaratSettledResult] =
    React.useState<BaccaratGameSettledResult | null>(null);
  const iterationTimeoutRef = React.useRef<NodeJS.Timeout>();
  const isMountedRef = React.useRef<boolean>(true);

  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedToken.address],
  });
  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
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
      lastPrice: priceFeed[selectedToken.priceKey],
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

  const onGameSubmit = async (v: BaccaratFormFields, errorCount = 0) => {
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
        method: 'sendGameOperation',
        target: controllerAddress,
      });
      if (isMountedRef.current) iterationTimeoutRef.current = setTimeout(() => handleFail(v), 2000);
    } catch (e: any) {
      if (isMountedRef.current)
        iterationTimeoutRef.current = setTimeout(() => handleFail(v, e), 750);
    }
  };

  const retryGame = async (v: BaccaratFormFields) => onGameSubmit(v);

  const handleFail = async (v: BaccaratFormFields, e?: any) => {
    log('error', e, e?.code);
    refetchPlayerGameStatus();

    if (e?.code == ErrorCode.UserRejectedRequest) return;

    if (e?.code == ErrorCode.SessionWaitingIteration) {
      log('SESSION WAITING ITERATION');
      await playerReIterate();
      return;
    }

    log('RETRY GAME CALLED AFTER 500MS');
    retryGame(v);
  };

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
      clearTimeout(iterationTimeoutRef.current);
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
    handleGetBadges({
      totalWager: result.wager,
      totalPayout: result.payout,
    });
  };

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeout(iterationTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <BaccaratTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        baccaratResults={baccaratResults}
        baccaratSettledResults={baccaratSettledResult}
        onAnimationCompleted={onGameCompleted}
        onFormChange={setFormValues}
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
