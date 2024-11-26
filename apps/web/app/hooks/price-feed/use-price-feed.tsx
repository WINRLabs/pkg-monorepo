'use client';

import React from 'react';

import {
  defaultPriceFeedValues,
  PriceFeedVariable,
  TPriceFeed,
  usePriceFeedStore,
} from './price-feed.store';
import { useCurrencyControllerGetLastPriceFeed } from '@winrlabs/api';

export const usePriceFeed = () => {
  const { priceFeed, updatePriceFeed } = usePriceFeedStore();

  const { data, dataUpdatedAt } = useCurrencyControllerGetLastPriceFeed(
    {},
    {
      refetchInterval: 10_000,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  React.useEffect(() => {
    if (!data) return;
    const payload: TPriceFeed = defaultPriceFeedValues;

    data.forEach((t) => {
      payload[t.token as PriceFeedVariable] = t.price;
    });

    updatePriceFeed({ ...payload });
  }, [dataUpdatedAt]);

  return {
    priceFeed,
  };
};
