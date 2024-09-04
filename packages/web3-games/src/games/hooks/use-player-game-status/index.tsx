'use client';

import {
  TransactionResponse,
  useRankControllerTakeLevelupSnapshot,
  useRefundControllerRefundGame,
  useRefundControllerReIterate,
} from '@winrlabs/api';
import { GameType, useWeb3GamesModalsStore } from '@winrlabs/games';
import { controllerAbi, rankMiddlewareAbi, useCurrentAccount } from '@winrlabs/web3';
import dayjs from 'dayjs';
import React from 'react';
import { Address } from 'viem';
import { Config, useReadContract } from 'wagmi';

import { useContractConfigContext } from '../use-contract-config';
import { Badge } from '../use-get-badges';

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
  const [sessionStatus, setSessionStatus] = React.useState<SessionStatus>(SessionStatus.Idle);
  const [lastSeen, setLastSeen] = React.useState<number>(0);
  const [refundCooldown, setRefundCooldown] = React.useState<number>(0);
  const [reIterateCooldown, setReIterateCooldown] = React.useState<number>(0);

  const { rankMiddlewareAddress, controllerAddress } = useContractConfigContext();
  const currentAccount = useCurrentAccount();
  const { openModal, closeModal } = useWeb3GamesModalsStore();

  // Reads
  const playerLevelStatusRead = useReadContract({
    config: wagmiConfig,
    abi: rankMiddlewareAbi,
    address: rankMiddlewareAddress,
    account: currentAccount.address,
    functionName: 'getPlayerStatus',
    args: [currentAccount.address || '0x'],
    query: {
      enabled: !!currentAccount.address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  const sessionRead = useReadContract({
    config: wagmiConfig,
    abi: controllerAbi,
    address: controllerAddress,
    functionName: 'getSessionByClient',
    args: [gameAddress, currentAccount.address || '0x'],
    query: {
      enabled: !!currentAccount.address && !!gameAddress,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  const refundCooldownRead = useReadContract({
    config: wagmiConfig,
    abi: controllerAbi,
    address: controllerAddress,
    functionName: 'refundCooldown',
    args: [],
    query: {
      enabled: !!currentAccount.address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  const reIterationCooldownRead = useReadContract({
    config: wagmiConfig,
    abi: controllerAbi,
    address: controllerAddress,
    functionName: 'reIterationCooldown',
    args: [],
    query: {
      enabled: !!currentAccount.address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  React.useEffect(() => {
    if (!sessionRead.data || !refundCooldownRead.data || !reIterationCooldownRead.data) return;

    setSessionStatus(Number(sessionRead.data?.[1].status));
    setLastSeen(Number(sessionRead.data?.[1].detail?.lastSeen || 0));
    setRefundCooldown(Number(refundCooldownRead.data));
    setReIterateCooldown(Number(reIterationCooldownRead.data));
  }, [
    sessionRead.dataUpdatedAt,
    refundCooldownRead.dataUpdatedAt,
    reIterationCooldownRead.dataUpdatedAt,
  ]);

  // Handlers
  const getPassedTime = (lastSeen: EpochTimeStamp) => dayjs(new Date()).unix() - lastSeen;

  // Checks
  const isHalted = React.useMemo(
    () => (playerLevelStatusRead.data && playerLevelStatusRead.data.halted) ?? false,
    [playerLevelStatusRead.dataUpdatedAt]
  );

  const isRefundable = React.useMemo(() => {
    if (!lastSeen || !refundCooldown) return false;

    const passedTime = getPassedTime(lastSeen);
    console.log(sessionStatus, 'session status');
    return passedTime > refundCooldown && sessionStatus === SessionStatus.Wait;
  }, [lastSeen, refundCooldown, sessionStatus, sessionRead.dataUpdatedAt]);

  const isReIterable = React.useMemo(() => {
    if (!lastSeen) return false;

    const passedTime = getPassedTime(lastSeen);
    return !isRefundable && passedTime > reIterateCooldown && sessionStatus === SessionStatus.Wait;
  }, [sessionRead.dataUpdatedAt, lastSeen, sessionStatus, isRefundable]);

  // Mutations
  const playerLevelUp = useRankControllerTakeLevelupSnapshot({});
  const playerRefund = useRefundControllerRefundGame({});
  const playerReIterate = useRefundControllerReIterate({});

  const handlePlayerLevelUp = async () => {
    const mutation = (await playerLevelUp.mutateAsync({
      body: {
        player: currentAccount.address || '0x',
      },
    })) as unknown as TransactionResponse;

    if (mutation?.success && onPlayerStatusUpdate)
      onPlayerStatusUpdate({
        type: 'levelUp',
        level: (playerLevelStatusRead.data?.level || 0) + 1,
        awardBadges: undefined,
      });
  };

  const handlePlayerRefund = async () => {
    const refund = await playerRefund.mutateAsync({
      body: {
        game: gameType,
        player: currentAccount.address || '0x',
      },
    });

    sessionRead.refetch();

    if (refund.success) closeModal();
  };

  const handlePlayerReIterate = async () =>
    await playerReIterate.mutateAsync({
      body: {
        game: gameType,
        player: currentAccount.address || '0x',
      },
    });

  React.useEffect(() => {
    if (isRefundable)
      openModal('refund', {
        refund: {
          isRefunding: playerRefund.isPending,
          isRefundable: isRefundable,
          playerRefund: handlePlayerRefund,
        },
      });
  }, [isRefundable]);

  const handleRefetchPlayerGameStatus = () => {
    playerLevelStatusRead.refetch();
    sessionRead.refetch();
  };

  React.useEffect(() => {
    console.log(playerLevelStatusRead.data, 'data');
  }, [playerLevelStatusRead.dataUpdatedAt]);

  React.useEffect(() => {
    console.log('isReIterable', isReIterable, 'isRefundable', isRefundable);
  }, [isReIterable, isRefundable]);

  return {
    isPlayerHalted: isHalted,
    isReIterable,

    playerLevelUp: handlePlayerLevelUp,
    playerReIterate: handlePlayerReIterate,

    refetchPlayerGameStatus: handleRefetchPlayerGameStatus,
  };
};
