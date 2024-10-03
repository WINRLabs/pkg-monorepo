'use client';

import { TransactionResponse, useRankControllerTakeLevelupSnapshot } from '@winrlabs/api';
import { GameType, useGameOptions, useWeb3GamesModalsStore } from '@winrlabs/games';
import {
  controllerAbi,
  rankMiddlewareAbi,
  useApiOptions,
  useBundlerClient,
  useCurrentAccount,
} from '@winrlabs/web3';
import dayjs from 'dayjs';
import debug from 'debug';
import React from 'react';
import { Address } from 'viem';
import { Config, useReadContracts } from 'wagmi';

import { GameTypesEnvironmentStore } from '../../../type';
import { useContractConfigContext } from '../use-contract-config';
import { Badge } from '../use-get-badges';

const log = debug('UsePlayerGameStatus');

const gameTypeEnvironmentStoreMap: Record<GameType, GameTypesEnvironmentStore> = {
  [GameType.BACCARAT]: GameTypesEnvironmentStore.baccarat,
  [GameType.BLACKJACK]: GameTypesEnvironmentStore.blackjackrouter,
  [GameType.COINFLIP]: GameTypesEnvironmentStore.coinflip,
  [GameType.DICE]: GameTypesEnvironmentStore.dice,
  [GameType.HOLDEM_POKER]: GameTypesEnvironmentStore.winrpoker,
  [GameType.HORSE_RACE]: GameTypesEnvironmentStore.horserace,
  [GameType.KENO]: GameTypesEnvironmentStore.keno,
  [GameType.LIMBO]: GameTypesEnvironmentStore.limbo,
  [GameType.LOTTERY]: GameTypesEnvironmentStore.lottery,
  [GameType.MINES]: GameTypesEnvironmentStore.mines,
  [GameType.MOON]: GameTypesEnvironmentStore.moon,
  [GameType.ONE_HAND_BLACKJACK]: GameTypesEnvironmentStore.singleblackjackrouter,
  [GameType.PLINKO]: GameTypesEnvironmentStore.plinko,
  [GameType.RANGE]: GameTypesEnvironmentStore.range,
  [GameType.ROULETTE]: GameTypesEnvironmentStore.roulette,
  [GameType.RPS]: GameTypesEnvironmentStore.rockpaperscissor,
  [GameType.SLOT]: GameTypesEnvironmentStore.winrbonanza,
  [GameType.VIDEO_POKER]: GameTypesEnvironmentStore.videopoker,
  [GameType.WHEEL]: GameTypesEnvironmentStore.wheel,
  [GameType.WINR_BONANZA]: GameTypesEnvironmentStore.winrbonanza,
  [GameType.WINR_OLYMPUS]: GameTypesEnvironmentStore.gateofolympos,
  [GameType.WINR_PRINCESS]: GameTypesEnvironmentStore.princesswinr,
  [GameType.SINGLE_WHEEL]: GameTypesEnvironmentStore.singlewheel,
};

interface IUsePlayerStatusParams {
  gameAddress: Address;
  gameType: GameType;
  wagmiConfig: Config;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

enum SessionStatus {
  Idle,
  Wait,
  OnGoing,
  Finalized,
}

export const usePlayerGameStatus = ({
  gameAddress,
  gameType,
  wagmiConfig,
  onPlayerStatusUpdate,
}: IUsePlayerStatusParams) => {
  const { forceRefund } = useGameOptions();
  const [sessionStatus, setSessionStatus] = React.useState<SessionStatus>(SessionStatus.Idle);
  const [lastSeen, setLastSeen] = React.useState<number>(0);
  const [refundCooldown, setRefundCooldown] = React.useState<number>(0);
  const [reIterateCooldown, setReIterateCooldown] = React.useState<number>(0);

  log('user session', sessionStatus);
  const { rankMiddlewareAddress, controllerAddress } = useContractConfigContext();
  const currentAccount = useCurrentAccount();
  const { openModal, closeModal } = useWeb3GamesModalsStore();

  const { baseUrl } = useApiOptions();

  const {
    data: gameStatus,
    dataUpdatedAt,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        abi: rankMiddlewareAbi,
        address: rankMiddlewareAddress,
        functionName: 'getPlayerStatus',
        args: [currentAccount.address || '0x'],
      },
      {
        abi: controllerAbi,
        address: controllerAddress,
        functionName: 'getSessionByClient',
        args: [gameAddress, currentAccount.address || '0x'],
      },
      {
        abi: controllerAbi,
        address: controllerAddress,
        functionName: 'refundCooldown',
        args: [],
      },
      {
        abi: controllerAbi,
        address: controllerAddress,
        functionName: 'reIterationCooldown',
        args: [],
      },
    ],
    config: wagmiConfig,
    multicallAddress: '0xca11bde05977b3631167028862be2a173976ca11',
    batchSize: 0,
    allowFailure: false,
    query: {
      enabled: !!currentAccount.address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      select: (data) => {
        return {
          playerLevelStatusRead: data[0],
          sessionRead: data[1],
          refundCooldownRead: data[2],
          reIterationCooldownRead: data[3],
        };
      },
    },
  });

  React.useEffect(() => {
    if (
      !gameStatus?.sessionRead ||
      !gameStatus.refundCooldownRead ||
      !gameStatus.reIterationCooldownRead
    )
      return;

    setSessionStatus(Number(gameStatus.sessionRead?.[1].status));
    setLastSeen(Number(gameStatus.sessionRead?.[1].detail?.lastSeen || 0));
    setRefundCooldown(Number(gameStatus.refundCooldownRead));
    setReIterateCooldown(Number(gameStatus.reIterationCooldownRead));
  }, [dataUpdatedAt]);

  // Handlers
  const getPassedTime = (lastSeen: EpochTimeStamp) => dayjs(new Date()).unix() - lastSeen;

  // Checks
  const isHalted = React.useMemo(
    () => (gameStatus?.playerLevelStatusRead && gameStatus.playerLevelStatusRead.halted) ?? false,
    [dataUpdatedAt]
  );

  const isRefundable = React.useMemo(() => {
    if (!lastSeen || !refundCooldown) return false;

    const passedTime = getPassedTime(lastSeen);
    log(sessionStatus, 'session status');
    return passedTime > refundCooldown && sessionStatus === SessionStatus.Wait;
  }, [lastSeen, refundCooldown, sessionStatus, dataUpdatedAt]);

  const isReIterable = React.useMemo(() => {
    if (!lastSeen) return false;

    const passedTime = getPassedTime(lastSeen);
    return !isRefundable && passedTime > reIterateCooldown && sessionStatus === SessionStatus.Wait;
  }, [dataUpdatedAt, lastSeen, sessionStatus, isRefundable]);

  // Mutations
  const { client } = useBundlerClient();
  const playerLevelUp = useRankControllerTakeLevelupSnapshot({});

  const handlePlayerLevelUp = async () => {
    const mutation = (await playerLevelUp.mutateAsync({
      body: {
        player: currentAccount.address || '0x',
      },
      baseUrl: baseUrl,
    })) as unknown as TransactionResponse;

    if (mutation?.success && onPlayerStatusUpdate)
      onPlayerStatusUpdate({
        type: 'levelUp',
        level: (gameStatus?.playerLevelStatusRead?.level || 0) + 1,
        awardBadges: undefined,
      });
  };

  const handlePlayerRefund = async () => {
    if (!client) return;

    const refund = await client.request('refund', {
      game: gameTypeEnvironmentStoreMap[gameType],
      player: currentAccount.address!,
    });

    refetch();

    if (refund.status == 'success') closeModal();
  };

  const handlePlayerReIterate = async () => {
    if (!client) return;

    await client.request('reIterate', {
      game: gameTypeEnvironmentStoreMap[gameType],
      player: currentAccount.address!,
    });
  };

  React.useEffect(() => {
    if (!client || !currentAccount.address) return;
    if (isRefundable)
      if (forceRefund) {
        handlePlayerRefund();
      } else {
        openModal('refund', {
          refund: {
            isRefunding: false,
            isRefundable,
            playerRefund: handlePlayerRefund,
          },
        });
      }
  }, [isRefundable, client, currentAccount.address]);

  const handleRefetchPlayerGameStatus = () => {
    refetch();
  };

  React.useEffect(() => {
    log(gameStatus?.playerLevelStatusRead, 'data');
  }, [dataUpdatedAt]);

  React.useEffect(() => {
    log('isReIterable', isReIterable, 'isRefundable', isRefundable);
  }, [isReIterable, isRefundable]);

  return {
    isPlayerHalted: isHalted,
    isReIterable,

    playerLevelUp: handlePlayerLevelUp,
    playerReIterate: handlePlayerReIterate,

    refetchPlayerGameStatus: handleRefetchPlayerGameStatus,
  };
};
