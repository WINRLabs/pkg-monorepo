'use client';

import { StrategyStruct } from '@winrlabs/games';
import { strategyStoreAbi, useSmartAccountApi } from '@winrlabs/web3';
import React from 'react';
import { useReadContracts } from 'wagmi';

import { useContractConfigContext } from '../use-contract-config';

export const useStrategyMulticall = (strategyList?: StrategyStruct[]) => {
  const { multicallAddress } = useSmartAccountApi();
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
    multicallAddress,
    allowFailure: false,
    query: {
      enabled: !!strategyList?.length && !!strategyStoreAddress,
    },
  });
};
