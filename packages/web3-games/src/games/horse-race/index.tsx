import {
  BetHistoryTemplate,
  GameType,
  Horse,
  horseMultipliers,
  HorseRaceFormFields,
  horseRaceParticipantMapWithStore,
  HorseRaceStatus,
  HorseRaceTemplate,
  toDecimals,
  useConfigureMultiplayerLiveResultStore,
  useHorseRaceGameStore,
  useLiveResultStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useNativeTokenBalance,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import React, { useEffect, useMemo, useState } from 'react';
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

type TemplateOptions = {
  scene?: {
    loader?: string;
    logo?: string;
  };
};

interface TemplateWithWeb3Props extends BaseGameProps {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  buildedGameUrl: string;
  onAnimationCompleted?: (result: []) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

const selectionMultipliers = {
  [Horse.IDLE]: 1,
  [Horse.ONE]: 2,
  [Horse.TWO]: 3,
  [Horse.THREE]: 8,
  [Horse.FOUR]: 15,
  [Horse.FIVE]: 60,
};

const HorseRaceGame = (props: TemplateWithWeb3Props) => {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.horseRace,
      gameType: GameType.HORSE_RACE,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const selectedToken = useTokenStore((s) => s.selectedToken);
  const allTokens = useTokenStore((s) => s.tokens);
  const selectedTokenAddress = selectedToken.address;

  const [formValues, setFormValues] = useState<HorseRaceFormFields>({
    horse: Horse.IDLE,
    wager: props.minWager || 1,
  });

  const maxWagerBySelection = toDecimals(
    (props.maxWager || 100) / selectionMultipliers[formValues.horse],
    2
  );

  useConfigureMultiplayerLiveResultStore();
  const {
    addResult,
    updateGame,
    clear: clearLiveResults,
  } = useLiveResultStore(['addResult', 'clear', 'updateGame', 'skipAll']);

  const { updateState, setSelectedHorse, selectedHorse } = useHorseRaceGameStore([
    'updateState',
    'setSelectedHorse',
    'selectedHorse',
  ]);

  const gameEvent = useListenMultiplayerGameEvent(GAME_HUB_GAMES.horse_race);

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  console.log('gameEvent', gameEvent);

  const currentAccount = useCurrentAccount();
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

  const { priceFeed } = usePriceFeed();

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'horse', type: 'uint8' },
      ],
      [wagerInWei, formValues.horse as any]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.horseRace as Address,
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
    formValues?.horse,
    formValues?.wager,
    priceFeed[selectedToken.priceKey],
    selectedToken.address,
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.horseRace,
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

  const encodedClaimParams = useMemo(() => {
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

    const encodedClaimData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.horseRace as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'claim',
        encodedParams,
      ],
    });

    return {
      encodedClaimData,
      encodedClaimTxData: encodedClaimData,
      currentAccount,
    };
  }, [formValues.horse, formValues.wager, selectedToken.bankrollIndex]);

  const handleClaimTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.horseRace,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'claim',
        encodedClaimParams.encodedClaimData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedClaimParams.encodedClaimTxData,
  });

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
          console.log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    console.log('submit');
    try {
      await handleClaimTx.mutateAsync();
    } catch (error) {}

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
  };

  useEffect(() => {
    if (!gameEvent) return;

    console.log('gameEvent:', gameEvent);

    const currentTime = new Date().getTime() / 1000;

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
      session,
    } = gameEvent;

    const isGameFinished = currentTime >= joiningFinish && joiningFinish > 0 && randoms;
    const shouldWait = currentTime <= joiningFinish && currentTime >= joiningStart;

    if (shouldWait) {
      updateState({
        startTime: joiningFinish,
        finishTime: cooldownFinish,
        status: HorseRaceStatus.Started,
      });
    }
    if (isGameFinished) {
      updateState({
        status: HorseRaceStatus.Finished,
        winnerHorse: result,
      });
    }

    updateGame({
      wager: formValues.wager || 0,
    });

    if (bet && bet?.converted.wager && player) {
      const _participantHorse = horseRaceParticipantMapWithStore[bet?.choice as unknown as Horse];

      const names = selectedHorse[_participantHorse].map((item) => item.name);

      if (!names.includes(player)) {
        setSelectedHorse(_participantHorse, {
          bet: bet?.converted.wager,
          name: player,
        });
      }
    }

    if (participants?.length > 0 && isGameActive) {
      participants?.forEach((p) => {
        const _participantHorse =
          horseRaceParticipantMapWithStore[
            fromHex(p.choice, {
              to: 'number',
            }) as unknown as Horse
          ];

        const names = selectedHorse[_participantHorse].map((item) => item.name);

        const token = allTokens.find((t) => t.bankrollIndex === session.bankrollIndex);
        const tokenDecimal = token?.decimals || 0;

        if (!names.includes(p.player)) {
          setSelectedHorse(_participantHorse, {
            bet: Number(formatUnits(p.wager, tokenDecimal)) as number,
            name: p.player as string,
          });
        }
      });
    }
  }, [gameEvent, currentAccount.address]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.HORSE_RACE,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const onGameCompleted = () => {
    props.onAnimationCompleted && props.onAnimationCompleted([]);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const { result } = gameEvent;
    const isWon = result === Number(formValues.horse);
    const payout = isWon ? formValues.wager * horseMultipliers[result as unknown as Horse] : 0;

    addResult({
      won: isWon,
      payout,
    });

    handleGetBadges({ totalPayout: payout, totalWager: formValues.wager });
  };

  return (
    <>
      <HorseRaceTemplate
        {...props}
        maxWager={maxWagerBySelection}
        currentAccount={currentAccount.address as `0x${string}`}
        buildedGameUrl={props.buildedGameUrl}
        onSubmitGameForm={onGameSubmit}
        onComplete={onGameCompleted}
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
};

export default HorseRaceGame;
