'use client';

import {
  baseUrl,
  GameControllerGlobalBetHistoryResponse,
  useGameControllerBetHistory,
  useGameControllerGlobalBetHistory,
} from '@winrlabs/api';
import { GameType } from '@winrlabs/games';
import { BetHistoryCurrencyList, BetHistoryFilter } from '@winrlabs/games';
import { useCurrentAccount, useTokenStore } from '@winrlabs/web3';
import React, { useEffect, useRef, useState } from 'react';

interface IUseBetHistory {
  gameType: GameType;
  options?: {
    enabled?: boolean;
  };
}

export const useBetHistory = ({ gameType, options }: IUseBetHistory) => {
  const [filter, setFilter] = useState<BetHistoryFilter>({
    type: 'bets',
  });

  const { address } = useCurrentAccount();

  const defaultParams = {
    limit: 10,
    page: 1,
  };

  const [globalBets, setGlobalBets] = useState<GameControllerGlobalBetHistoryResponse>([]);
  const sseBuffer = useRef<GameControllerGlobalBetHistoryResponse>([]);

  const { data: initialData, isLoading } = useGameControllerGlobalBetHistory(
    {
      queryParams: defaultParams,
    },
    {
      enabled: options?.enabled,
      retry: false,
    }
  );

  useEffect(() => {
    if (initialData) {
      setGlobalBets(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const es = new EventSource(baseUrl + '/game/sse-global-bet-history');

    es.onmessage = (event) => {
      if (!event.data) return;

      const newData = JSON.parse(String(event.data));

      sseBuffer.current = [newData.payload, ...sseBuffer.current].slice(0, 30);
    };

    return () => {
      es.close();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGlobalBets((prev) => {
        const updatedBets = [...sseBuffer.current, ...prev].slice(0, 30);
        sseBuffer.current = [];

        return updatedBets;
      });
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
      enabled: options?.enabled && filter.type == 'player' && !!address,
      retry: false,
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
      : globalBets) as GameControllerGlobalBetHistoryResponse,
    isHistoryLoading: isLoading || myBetsIsLoading,
    mapHistoryTokens: mapTokens,
    historyFilter: filter,
    setHistoryFilter: setFilter,
    refetchHistory: () => {
      filter.type == 'player' && refetchMyBets();
    },
  };
};
