'use client';

import { strategyStoreAbi, useSendTx } from '@winrlabs/web3';
import React from 'react';
import { encodeFunctionData } from 'viem';

import { useContractConfigContext } from '../use-contract-config';
import { useReadContract } from 'wagmi';

interface UseGameStrategy {
  handleCreateStrategy: (strategyName: string) => Promise<void>;
  isCreatingStrategy: boolean;
}

const GameStrategyContext = React.createContext<UseGameStrategy>({
  handleCreateStrategy: async () => {},
  isCreatingStrategy: false,
});

export const useGameStrategy = () => {
  const gameStrategy = React.useContext(GameStrategyContext);

  return gameStrategy;
};

export const GameStrategyProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { strategyStoreAddress } = useContractConfigContext();

  const create = useSendTx({
    onSuccess: (d) => {
      console.log(d, 'd');
    },
    onError: (e) => {
      console.log(e, 'e');
    },
  });

  const handleCreateStrategy = async (strategyName: string) => {
    await create.mutateAsync({
      target: strategyStoreAddress,
      encodedTxData: encodeFunctionData({
        abi: strategyStoreAbi,
        functionName: 'create',
        args: [strategyName],
      }),
    });
  };

  return (
    <GameStrategyContext.Provider
      value={{
        handleCreateStrategy,
        isCreatingStrategy: create.isPending,
      }}
    >
      {children}
    </GameStrategyContext.Provider>
  );
};
