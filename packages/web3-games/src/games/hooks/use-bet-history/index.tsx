'use client';

import { GameControllerBetHistoryResponse, useGameControllerBetHistory } from '@winrlabs/api';
import { GameType } from '@winrlabs/games';
import { BetHistoryCurrencyList, BetHistoryFilter } from '@winrlabs/games';
import { useCurrentAccount, useTokenStore } from '@winrlabs/web3';
import React from 'react';

interface IUseBetHistory {
  gameType: GameType;
  options?: {
    enabled?: boolean;
  };
}

export const useBetHistory = ({ gameType, options }: IUseBetHistory) => {
  const [filter, setFilter] = React.useState<BetHistoryFilter>({
    type: 'bets',
  });

  const { address } = useCurrentAccount();

  const defaultParams = {
    limit: 10,
    page: 1,
  };

  const { data, isLoading, refetch } = useGameControllerBetHistory(
    {
      queryParams:
        filter.type === 'player'
          ? {
              player: address,
              ...defaultParams,
            }
          : defaultParams,
    },
    {
      enabled: options?.enabled,
      refetchInterval: 7500,
    }
  );

  const {
    data: myBetsData,
    isLoading: myBetsIsLoading,
    refetch: refetchMyBets,
  } = useGameControllerBetHistory(
    {
      queryParams:
        filter.type === 'player'
          ? {
              player: address,
              ...defaultParams,
            }
          : defaultParams,
    },
    {
      enabled: options?.enabled,
      refetchInterval: 7500,
    }
  );

  const tokens = useTokenStore((s) => s.tokens);

  const mapTokens = React.useMemo(() => {
    return tokens.reduce((acc, token) => {
      acc[token.address] = {
        icon: token.icon,
        symbol: token.symbol,
      };
      return acc;
    }, {} as BetHistoryCurrencyList);
  }, [tokens]);

  return {
    betHistory: (filter.type == 'player'
      ? myBetsData?.data
      : data?.data) as GameControllerBetHistoryResponse['data'],
    isHistoryLoading: isLoading || myBetsIsLoading,
    mapHistoryTokens: mapTokens,
    historyFilter: filter,
    setHistoryFilter: setFilter,
    refetchHistory: () => {
      refetch();
      refetchMyBets();
    },
  };
};
