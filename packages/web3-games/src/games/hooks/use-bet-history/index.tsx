'use client';

import {
  baseUrl,
  GameControllerGlobalBetHistoryResponse,
  useGameControllerBetHistory,
  useGameControllerGetLastHighRollers,
  useGameControllerGetLastLuckyWins,
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

const sseUrl = {
  bets: 'sse-global-bet-history',
  high: 'sse-high-rollers',
  lucky: 'sse-lucky-wins',
};

export const useBetHistory = ({ options }: IUseBetHistory) => {
  const [filter, setFilter] = useState<BetHistoryFilter>({
    type: 'bets',
  });

  const { address } = useCurrentAccount();

  const defaultParams = {
    limit: 10,
    page: 1,
  };

  const [globalBets, setGlobalBets] = useState<GameControllerGlobalBetHistoryResponse>([]);

  const sseDataBuffer = useRef<GameControllerGlobalBetHistoryResponse>([]);

  const { data: initialDataGlobalBets, isLoading } = useGameControllerGlobalBetHistory(
    {
      queryParams: defaultParams,
    },
    {
      enabled: options?.enabled && filter.type == 'bets',
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: initialDataHighRollers, isLoading: isLoadingHighRollers } =
    useGameControllerGetLastHighRollers(
      {
        queryParams: defaultParams,
      },
      {
        enabled: options?.enabled && filter.type == 'high',
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { data: initialDataLuckyWins, isLoading: isLoadingLuckyWins } =
    useGameControllerGetLastLuckyWins(
      {
        queryParams: defaultParams,
      },
      {
        enabled: options?.enabled && filter.type == 'lucky',
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    if (filter.type == 'bets' && initialDataGlobalBets) setGlobalBets(initialDataGlobalBets);
    else if (filter.type == 'high' && initialDataHighRollers) setGlobalBets(initialDataHighRollers);
    else if (filter.type == 'lucky' && initialDataLuckyWins) setGlobalBets(initialDataLuckyWins);
  }, [filter.type, initialDataGlobalBets, initialDataHighRollers, initialDataLuckyWins]);

  useEffect(() => {
    if (filter.type == 'player') return;

    const es = new EventSource(baseUrl + `/game/${sseUrl[filter.type || 'bets']}`);

    es.onmessage = (event) => {
      if (!event.data) return;

      const newData = JSON.parse(String(event.data));

      sseDataBuffer.current = [newData.payload, ...sseDataBuffer.current].slice(0, 30);
    };

    return () => {
      es.close();
    };
  }, [filter.type]);

  useEffect(() => {
    if (filter.type == 'bets') {
      const intervalId = setInterval(() => {
        setGlobalBets((prev) => {
          const updatedBets = [...sseDataBuffer.current, ...prev].slice(0, 30);
          sseDataBuffer.current = [];

          return updatedBets;
        });
      }, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [filter.type]);

  useEffect(() => {
    if (filter.type !== 'bets') {
      setGlobalBets((prev) => [...prev, ...sseDataBuffer.current].slice(0, 30));
    }
  }, [sseDataBuffer.current, filter.type]);

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
    isHistoryLoading: isLoading || myBetsIsLoading || isLoadingHighRollers || isLoadingLuckyWins,
    mapHistoryTokens: mapTokens,
    historyFilter: filter,
    setHistoryFilter: setFilter,
    refetchHistory: () => {
      filter.type == 'player' && refetchMyBets();
    },
  };
};
