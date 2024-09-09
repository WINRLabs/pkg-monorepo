'use client';

import React from 'react';
import { UUID } from 'node:crypto';
import {
  Account,
  Address,
  createPublicClient,
  createWalletClient,
  http,
  SignableMessage,
  Transport,
} from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';

import * as Strategy from '../game-strategy';
import { getWalletClient } from '@wagmi/core';

interface UseGameStrategy {
  strategyManager?: any;
  currentStrategyCount: number;
  currentStrategyId: UUID | number;

  createStrategy: () => void;
}

const GameStrategyContext = React.createContext<UseGameStrategy>({
  strategyManager: undefined,
  currentStrategyCount: 0,
  currentStrategyId: 0,

  createStrategy: () => null,
});

export const useGameStrategy = () => {
  const gameStrategy = React.useContext(GameStrategyContext);

  return gameStrategy;
};

export const GameStrategyProvider: React.FC<{
  children: React.ReactNode;
  strategyStoreAddress: Address;
}> = ({ children, strategyStoreAddress }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();

  const [strategyManager, setStrategyManager] = React.useState<any>();
  const [currentStrategyCount, setCurrentStrategyCount] = React.useState<number>(0);
  const [currentStrategyId, setCurrentStrategyId] = React.useState<UUID | number>(0);

  React.useEffect(() => {
    if (!address || !walletClient || !publicClient) return;
  }, [address, walletClient, publicClient]);

  const createStrategy = async () => {
    if (!walletClient.data || !publicClient) return;

    // create clients as typeof viem
    const _walletClient = createWalletClient({
      chain: walletClient.data.chain,
      account: walletClient.data.account,
      transport: http(walletClient.data.transport.url),
    });

    const _publicClient = createPublicClient({
      chain: publicClient.chain,
      transport: http(publicClient.transport.url),
    });

    let currentStrategyCount = 0;
    let currentStrategyId = 0;
    const signer = getViemAcc();

    const manager: Strategy.Manager = Strategy.create({
      contract: {
        store: strategyStoreAddress,
        walletClient: _walletClient,
        publicClient: _publicClient,
        signer,
      },
    });

    const list = await manager.getList();
    currentStrategyCount = list.length;
    currentStrategyId = currentStrategyCount;
  };

  const getViemAcc = (): Account => {
    if (!walletClient.data) return {} as Account;

    const signer = walletClient.data;

    return {
      address: signer.account.address as `0x${string}`,
      signMessage: signer.signMessage as any,
      signTransaction: signer.signTransaction as any,
      signTypedData: signer.signTypedData as any,
      publicKey: signer.account.address as `0x${string}`,
      type: 'local',
      source: 'wagmi',
    };
  };

  return (
    <GameStrategyContext.Provider
      value={{ strategyManager, currentStrategyCount, currentStrategyId, createStrategy }}
    >
      {children}
    </GameStrategyContext.Provider>
  );
};
