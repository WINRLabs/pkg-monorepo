'use client';

import { useCurrencyControllerGetLastPriceFeed } from '@winrlabs/api';
import React from 'react';

import { useApiOptions } from '../../providers/api';
import {
  defaultPriceFeedValues,
  PriceFeedVariable,
  TPriceFeed,
  usePriceFeedStore,
} from './price-feed.store';

export const usePriceFeed = () => {
  const { priceFeed, updatePriceFeed } = usePriceFeedStore();
  const { disablePriceFeed } = useApiOptions();

  const { data, dataUpdatedAt } = useCurrencyControllerGetLastPriceFeed(
    {},
    {
      refetchInterval: 10_000,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !disablePriceFeed,
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
