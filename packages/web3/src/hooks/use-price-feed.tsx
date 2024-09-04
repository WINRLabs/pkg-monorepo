'use client';

import { useCurrencyControllerGetLastPriceFeed } from '@winrlabs/api';
import React from 'react';

export type PriceFeedVariable =
  | 'winr'
  | 'arb'
  | 'btc'
  | 'eth'
  | 'usdc'
  | 'weth'
  | 'sol'
  | 'usdt'
  | 'mck';

type TPriceFeed = Record<PriceFeedVariable, number>;

const defaultValues: TPriceFeed = {
  winr: 1,
  arb: 1,
  btc: 1,
  eth: 1,
  usdc: 1,
  weth: 1,
  sol: 1,
  usdt: 1,
  mck: 1,
};

export const usePriceFeed = () => {
  const [priceFeed, setPriceFeed] = React.useState<TPriceFeed>(defaultValues);
  const { data, dataUpdatedAt } = useCurrencyControllerGetLastPriceFeed(
    {},
    {
      refetchInterval: 5000,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  React.useEffect(() => {
    if (!data) return;
    const payload: TPriceFeed = defaultValues;

    data.forEach((t) => {
      payload[t.token as PriceFeedVariable] = t.price;
    });

    setPriceFeed({ ...payload });
  }, [dataUpdatedAt]);

  return {
    priceFeed,
  };
};
