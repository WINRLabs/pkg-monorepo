'use client';

import {
  BetConditionFormValues,
  CreatedStrategy,
  NORMALIZED_PRECISION,
  parseToBigInt,
  ProfitConditionFormValues,
  StrategyItem,
  StrategyStruct,
} from '@winrlabs/games';
import { strategyStoreAbi, useCurrentAccount, useSendTx } from '@winrlabs/web3';
import React from 'react';
import { encodeFunctionData } from 'viem';
import { useReadContract } from 'wagmi';

import { useContractConfigContext } from '../use-contract-config';
import { useStrategyMulticall } from './use-strategy-multicall';

interface UseGameStrategy {
  createdStrategies: CreatedStrategy[];
  handleCreateStrategy: (strategyName: string) => Promise<void>;
  handleAddDefaultBetCondition: (strategyId: number) => Promise<void>;
  handleRemoveCondition: (strategyId: number, index: number) => Promise<void>;
  handleUpdateBetCondition: (
    strategyId: number,
    itemId: number,
    newValues: BetConditionFormValues
  ) => Promise<void>;
  handleUpdateProfitCondition: (
    strategyId: number,
    itemId: number,
    newValues: ProfitConditionFormValues
  ) => Promise<void>;
}

const GameStrategyContext = React.createContext<UseGameStrategy>({
  createdStrategies: [],
  handleCreateStrategy: async () => {},
  handleAddDefaultBetCondition: async () => {},
  handleRemoveCondition: async () => {},
  handleUpdateBetCondition: async () => {},
  handleUpdateProfitCondition: async () => {},
});

export const useGameStrategy = () => {
  const gameStrategy = React.useContext(GameStrategyContext);

  return gameStrategy;
};

export const GameStrategyProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { strategyStoreAddress, wagmiConfig } = useContractConfigContext();
  const { address } = useCurrentAccount();

  const { data: strategyList, refetch: refetchList } = useReadContract({
    config: wagmiConfig,
    abi: strategyStoreAbi,
    address: strategyStoreAddress,
    functionName: 'list',
    args: [address!],
    query: {
      enabled: !!address,
      retry: false,
    },
  });

  const { data: strategyItems, refetch: refetchItems } = useStrategyMulticall(
    strategyList as StrategyStruct[]
  );

  const create = useSendTx();
  const addBetCondition = useSendTx();
  const removeCondition = useSendTx();
  const updateBetCondition = useSendTx();
  const updateProfitCondition = useSendTx();

  const handleCreateStrategy = async (strategyName: string) => {
    await create.mutateAsync({
      target: strategyStoreAddress,
      encodedTxData: encodeFunctionData({
        abi: strategyStoreAbi,
        functionName: 'create',
        args: [strategyName],
      }),
    });

    refetchList();
  };

  const handleAddDefaultBetCondition = async (strategyId: number) => {
    await addBetCondition.mutateAsync({
      target: strategyStoreAddress,
      encodedTxData: encodeFunctionData({
        abi: strategyStoreAbi,
        functionName: 'addBetCondition',
        args: [
          BigInt(strategyId),

          {
            type_: 0,
            term: 0,
            amount: 1,
          },
          {
            amount: parseToBigInt(0, NORMALIZED_PRECISION),
            option: 0,
          },
        ],
      }),
    });

    refetchList();
    refetchItems();
  };

  const handleRemoveCondition = async (strategyId: number, itemId: number) => {
    await removeCondition.mutateAsync({
      target: strategyStoreAddress,
      encodedTxData: encodeFunctionData({
        abi: strategyStoreAbi,
        functionName: 'remove',
        args: [BigInt(strategyId), BigInt(itemId)],
      }),
    });

    refetchList();
    refetchItems();
  };

  const handleUpdateBetCondition = async (
    strategyId: number,
    itemId: number,
    newValues: BetConditionFormValues
  ) => {
    await updateBetCondition.mutateAsync({
      target: strategyStoreAddress,
      encodedTxData: encodeFunctionData({
        abi: strategyStoreAbi,
        functionName: 'updateBetCondition',
        args: [
          BigInt(strategyId),
          BigInt(itemId),
          {
            term: newValues.onTerm,
            type_: newValues.onType,
            amount: newValues.onAmount,
          },
          {
            amount: newValues.actionAmount,
            option: newValues.actionOption,
          },
        ],
      }),
    });

    refetchList();
    refetchItems();
  };

  const handleUpdateProfitCondition = async (
    strategyId: number,
    itemId: number,
    newValues: ProfitConditionFormValues
  ) => {
    await updateProfitCondition.mutateAsync({
      target: strategyStoreAddress,
      encodedTxData: encodeFunctionData({
        abi: strategyStoreAbi,
        functionName: 'updateProfitCondition',
        args: [
          BigInt(strategyId),
          BigInt(itemId),
          {
            term: newValues.onTerm,
            type_: newValues.onType,
            amount: newValues.onAmount,
          },
          {
            amount: newValues.actionAmount,
            option: newValues.actionOption,
          },
        ],
      }),
    });

    refetchList();
    refetchItems();
  };

  const parsedStrategyList = React.useMemo(() => {
    if (!strategyList?.length || !strategyItems?.length) return [];

    return strategyList.map((item, idx) => {
      const itemsData = strategyItems[idx] || ([] as StrategyItem[]);

      return {
        strategyId: item.strategyId,
        name: item.name,
        items: itemsData.map((i, idx) => ({
          ...i,
          itemId: item.itemIds[idx] as number,
        })),
      };
    });
  }, [strategyList, strategyItems]);

  return (
    <GameStrategyContext.Provider
      value={{
        createdStrategies: parsedStrategyList,
        handleCreateStrategy,
        handleAddDefaultBetCondition,
        handleRemoveCondition,
        handleUpdateBetCondition,
        handleUpdateProfitCondition,
      }}
    >
      {children}
    </GameStrategyContext.Provider>
  );
};
