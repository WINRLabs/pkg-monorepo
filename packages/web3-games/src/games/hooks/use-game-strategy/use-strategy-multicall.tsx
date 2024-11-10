'use client';

import { strategyStoreAbi } from '@winrlabs/web3';
import React from 'react';
import { useReadContracts } from 'wagmi';

import { useContractConfigContext } from '../use-contract-config';
import { StrategyStruct } from './types';

export const useStrategyMulticall = (strategyList?: StrategyStruct[]) => {
  const { strategyStoreAddress, wagmiConfig } = useContractConfigContext();
  const strategyIds = React.useMemo(() => {
    if (!strategyList?.length) return [];

    return strategyList.map((strategy) => strategy.strategyId);
  }, [strategyList]);

  return useReadContracts({
    config: wagmiConfig,
    contracts: strategyIds.map((id) => ({
      abi: strategyStoreAbi,
      address: strategyStoreAddress,
      functionName: 'getItems',
      args: [id!],
    })),
    batchSize: 0,
    multicallAddress: '0xca11bde05977b3631167028862be2a173976ca11',
    allowFailure: false,
    query: {
      enabled: !!strategyList?.length && !!strategyStoreAddress,
    },
  });
};
