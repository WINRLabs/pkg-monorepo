'use client';

import {
  ANGLE_SCALE,
  BetHistoryTemplate,
  CoinFlipGameResult,
  GameType,
  MultiplayerGameStatus,
  useConfigureMultiplayerLiveResultStore,
  useLiveResultStore,
  useWheelGameStore,
  WheelColor,
  WheelFormFields,
  WheelTemplate,
  WheelTheme,
} from '@winrlabs/games';
import {
  controllerAbi,
  useCurrentAccount,
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
import { Badge, useBetHistory, useListenGameEvent, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { GAME_HUB_EVENT_TYPES, prepareGameTransaction } from '../utils';

const log = debug('worker:SingleWheelWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  theme?: WheelTheme;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;

  onAnimationCompleted?: (result: CoinFlipGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
  onTransactionStatusUpdate?: (type: 'awaiting' | 'received') => void;
}

// const selectionMultipliers = {
//   [WheelColor.IDLE]: 1,
//   [WheelColor.GREY]: 2,
//   [WheelColor.BLUE]: 3,
//   [WheelColor.GREEN]: 6,
//   [WheelColor.RED]: 48,
// };

export default function WheelGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.singleWheel,
      gameType: GameType.SINGLE_WHEEL,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const selectedToken = useTokenStore((s) => s.selectedToken);

  const selectedTokenAddress = selectedToken.address;
  // const { baseUrl } = useApiOptions();
  // const { data: betHistory, refetch: refetchBetHistory } =
  //   useGameControllerGetMultiplayerGameHistory({
  //     queryParams: {
  //       // @t
  //       game: GameType.SINGLE_WHEEL,
  //       // TODO: swagger does not include the pagination params. ask be to fix it.
  //       // @ts-ignore
  //       limit: 8,
  //     },

  //     baseUrl,
  //   });
  const { updateState, showResult, setSubmitDisabled } = useWheelGameStore([
    'updateState',
    'setIsGamblerParticipant',
    'showResult',
    'setSubmitDisabled',
  ]);

  const [formValues, setFormValues] = useState<WheelFormFields>({
    color: WheelColor.IDLE,
    wager: props?.minWager || 1,
  });

  // const maxWagerBySelection = toDecimals(
  //   (props.maxWager || 100) / selectionMultipliers[formValues.color],
  //   2
  // );

  useConfigureMultiplayerLiveResultStore();
  const { addResult, clear: clearLiveResults } = useLiveResultStore([
    'addResult',
    'clear',
    'updateGame',
    'skipAll',
  ]);

  const gameEvent = useListenGameEvent();

  const currentAccount = useCurrentAccount();
  const { priceFeed } = usePriceFeed();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedToken.address],
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress,
    showDefaultToasts: false,
  });

  const getEncodedBetTxData = () => {
    const { wagerInWei, stopGainInWei, stopLossInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: 0,
      stopLoss: 0,
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
      [Number(formValues.color)]
    );

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'stopGain', type: 'uint128' },
        { name: 'stopLoss', type: 'uint128' },
        { name: 'count', type: 'uint8' },
        { name: 'data', type: 'bytes' },
      ],
      [wagerInWei, 0n, 0n, 1, encodedChoice]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleWheel as Address,
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

  const onGameSubmit = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    clearLiveResults();
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      setSubmitDisabled(true);
      props.onTransactionStatusUpdate && props.onTransactionStatusUpdate('awaiting');

      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedBetTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
      setSubmitDisabled(false);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }

    log('BET TX COMPLETED');
  };

  const showResultDisablerTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!gameEvent) return;

    const event = gameEvent.program.pop();

    if (event?.type == GAME_HUB_EVENT_TYPES.Settled) {
      if (showResultDisablerTimeout.current) clearTimeout(showResultDisablerTimeout.current);
      const { angle, outcome } = event.data.steps[0];
      log('Winner color', outcome);
      props.onTransactionStatusUpdate && props.onTransactionStatusUpdate('received');

      updateState({
        status: MultiplayerGameStatus.Finish,
        winnerColor: outcome as unknown as WheelColor,
        winnerAngle: Number(angle) / 100000 / ANGLE_SCALE,
      });
    }
    // const status = MultiplayerGameStatus.Finish;
  }, [gameEvent]);

  React.useEffect(() => {
    if (showResult) {
      showResultDisablerTimeout.current = setTimeout(() => {
        updateState({
          showResult: false,
          status: MultiplayerGameStatus.None,
          winnerColor: WheelColor.IDLE,
          submitDisabled: false,
        });
      }, 5000);
    }
  }, [showResult]);

  const {
    betHistory: allBetHistory,
    isHistoryLoading,
    mapHistoryTokens,
    setHistoryFilter,
    refetchHistory,
  } = useBetHistory({
    gameType: GameType.WHEEL,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  const onWheelCompleted = () => {
    // refetchBetHistory();
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    // const { result } = gameEvent;
    // const isWon = result === Number(formValues.color);
    // const payout = isWon ? formValues.wager * colorMultipliers[String(result) as WheelColor] : 0;

    // addResult({
    //   won: isWon,
    //   payout,
    // });
  };

  return (
    <>
      <WheelTemplate
        {...props}
        theme={props.theme}
        minWager={props.minWager}
        maxWager={props.maxWager}
        onSubmitGameForm={onGameSubmit}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        onComplete={onWheelCompleted}
      />
      {!props.hideBetHistory && (
        <BetHistoryTemplate
          betHistory={allBetHistory || []}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
}
