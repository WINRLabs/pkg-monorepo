'use client';

import { useGameControllerGetMultiplayerGameHistory } from '@winrlabs/api';
import {
  ANGLE_SCALE,
  BetHistoryTemplate,
  CoinFlipGameResult,
  colorMultipliers,
  GameType,
  MultiplayerGameStatus,
  Multiplier,
  participantMapWithStore,
  toDecimals,
  toFormatted,
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
  useApiOptions,
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
import React, { useEffect, useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits, fromHex } from 'viem';

import { BaseGameProps } from '../../type';
import {
  Badge,
  useBetHistory,
  useGetBadges,
  useListenMultiplayerGameEvent,
  usePlayerGameStatus,
} from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { GAME_HUB_GAMES, prepareGameTransaction } from '../utils';

const log = debug('worker:WheelWeb3');

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
}

const selectionMultipliers = {
  [WheelColor.IDLE]: 1,
  [WheelColor.GREY]: 2,
  [WheelColor.BLUE]: 3,
  [WheelColor.GREEN]: 6,
  [WheelColor.RED]: 48,
};

export default function WheelGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.wheel,
      gameType: GameType.WHEEL,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const selectedToken = useTokenStore((s) => s.selectedToken);
  const selectedTokenAddress = selectedToken.address;
  const { baseUrl } = useApiOptions();
  const { data: betHistory, refetch: refetchBetHistory } =
    useGameControllerGetMultiplayerGameHistory({
      queryParams: {
        game: GameType.WHEEL,
        // TODO: swagger does not include the pagination params. ask be to fix it.
        // @ts-ignore
        limit: 8,
      },

      baseUrl,
    });
  const { updateState, setWheelParticipant, setIsGamblerParticipant } = useWheelGameStore([
    'updateState',
    'setWheelParticipant',
    'setIsGamblerParticipant',
  ]);

  const [formValues, setFormValues] = useState<WheelFormFields>({
    color: WheelColor.IDLE,
    wager: props?.minWager || 1,
  });

  const maxWagerBySelection = toDecimals(
    (props.maxWager || 100) / selectionMultipliers[formValues.color],
    2
  );

  useConfigureMultiplayerLiveResultStore();
  const {
    addResult,
    updateGame,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame', 'skipAll']);

  const gameEvent = useListenMultiplayerGameEvent(GAME_HUB_GAMES.wheel);

  const currentAccount = useCurrentAccount();
  const allTokens = useTokenStore((s) => s.tokens);
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
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'color', type: 'uint8' },
      ],
      [wagerInWei, formValues.color as unknown as number]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.wheel as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });
  };

  const getEncodedClaimTxData = () => {
    const encodedChoice = encodeAbiParameters([], []);
    const encodedParams = encodeAbiParameters(
      [
        { name: 'address', type: 'address' },
        {
          name: 'data',
          type: 'address',
        },
        {
          name: 'bytes',
          type: 'bytes',
        },
      ],
      [
        currentAccount.address || '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        encodedChoice,
      ]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.wheel as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'claim',
        encodedParams,
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

    log('CLAIM TX!');
    try {
      await sendTx.mutateAsync({
        encodedTxData: getEncodedClaimTxData(),
        target: controllerAddress,
        method: 'sendUserOperation',
      });
    } catch (error) {}

    log('CLAIM TX SUCCESS, TRYING BET TX');

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      setIsGamblerParticipant(true);
      await sendTx.mutateAsync({
        encodedTxData: getEncodedBetTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      setIsGamblerParticipant(false);
      // props.onError && props.onError(e);
    }

    log('BET TX COMPLETED');
  };

  React.useEffect(() => {
    if (!gameEvent) return;

    const currentTime = new Date().getTime() / 1000;
    let status: MultiplayerGameStatus = MultiplayerGameStatus.None;

    const {
      cooldownFinish,
      joiningFinish,
      joiningStart,
      randoms,
      result,
      player,
      bet,
      participants,
      isGameActive,
      angle,
      session,
    } = gameEvent;

    const isGameFinished = currentTime >= joiningFinish && joiningFinish > 0 && randoms;
    const shouldWait = currentTime <= joiningFinish && currentTime >= joiningStart;

    if (shouldWait) {
      status = MultiplayerGameStatus.Wait;
    }

    if (isGameFinished) {
      status = MultiplayerGameStatus.Finish;
    }

    updateState({
      status,
      joiningFinish,
      joiningStart,
      cooldownFinish: cooldownFinish,
      winnerColor: result as unknown as WheelColor,
      winnerAngle: Number(angle) / 100000 / ANGLE_SCALE,
    });

    updateGame({
      wager: formValues.wager || 0,
    });

    if (participants?.length > 0 && isGameActive) {
      participants.forEach((p) => {
        if (p.player === currentAccount.address) {
          setIsGamblerParticipant(true);
        }

        const token = allTokens.find((t) => t.bankrollIndex === p.session.bankroll);
        const tokenDecimal = token?.decimals || 0;

        setWheelParticipant(
          participantMapWithStore[
            fromHex(p.choice, {
              to: 'number',
            }) as unknown as WheelColor
          ],
          {
            player: p.player,
            bet: Number(toFormatted(formatUnits(p.wager, tokenDecimal), 3)),
          }
        );
      });
    }

    if (bet && bet?.converted?.wager && player) {
      setWheelParticipant(participantMapWithStore[bet.choice] as Multiplier, {
        player: player,
        bet: Number(toFormatted(bet.converted.wager, 3)),
      });
    }
  }, [gameEvent, currentAccount.address]);

  useEffect(() => {
    if (betHistory && betHistory?.length > 0) {
      updateState({
        lastBets: betHistory.map(
          (data) => participantMapWithStore[data.result as unknown as WheelColor]
        ),
      });
    }
  }, [betHistory]);

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

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onWheelCompleted = () => {
    refetchBetHistory();
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const { result } = gameEvent;
    const isWon = result === Number(formValues.color);
    const payout = isWon ? formValues.wager * colorMultipliers[String(result) as WheelColor] : 0;

    addResult({
      won: isWon,
      payout,
    });
    handleGetBadges({ totalWager: formValues.wager, totalPayout: payout });
  };

  return (
    <>
      <WheelTemplate
        {...props}
        theme={props.theme}
        maxWager={maxWagerBySelection}
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
