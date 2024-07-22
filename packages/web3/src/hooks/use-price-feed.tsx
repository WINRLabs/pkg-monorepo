"use client";

import React from "react";
import { Address } from "viem";

import { useTokenStore } from "../providers/token";

interface PriceFeed {
  [address: Address]: number;
}

export const usePriceFeed = () => {
  const [priceFeed, setPriceFeed] = React.useState<PriceFeed>({});

  const tokens = useTokenStore((s) => s.tokens);

  React.useEffect(() => {
    // FIXME: mock response
    const payload: Record<Address, number> = {};

    tokens.forEach((t) => {
      if (t.symbol == "USDC") payload[t.address] = 1;
      if (t.symbol == "USDT") payload[t.address] = 1;
      if (t.symbol == "wBTC") payload[t.address] = 65000;
      if (t.symbol == "wETH") payload[t.address] = 3500;
    });

    setPriceFeed(payload);
  }, []);

  const getPrice = (address: Address): number => {
    return priceFeed[address] || 1;
  };

  return {
    priceFeed,
    getPrice,
  };
};
