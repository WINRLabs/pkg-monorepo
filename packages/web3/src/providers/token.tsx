"use client";

import { createContext, useContext, useRef } from "react";
import { Address } from "viem";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";

import { PriceFeedVariable } from "../hooks/use-price-feed";

export interface Token {
  address: Address;
  bankrollIndex: Address;
  symbol: string;
  icon: string;
  decimals: number;
  displayDecimals: number;
  playable: boolean;
  priceKey: PriceFeedVariable;
}

interface TokenProps {
  tokens: Token[];
  selectedToken: Token;
}

interface TokenState extends TokenProps {
  updateState: (state: Partial<TokenProps>) => void;
  setSelectedToken: (token: Token) => void;
}

type TokenStore = StoreApi<TokenState>;

export const createTokenStore = (initProps?: Partial<TokenProps>) => {
  const DEFAULT_PROPS: TokenProps = {
    tokens: [],
    selectedToken: {
      address: "0x",
      bankrollIndex: "0x",
      symbol: "",
      icon: "",
      decimals: 0,
      displayDecimals: 0,
      playable: false,
      priceKey: "weth",
    },
  };
  return createStore(
    persist<TokenState>(
      (set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setSelectedToken: (token) => {
          set((prevState) => ({ ...prevState, selectedToken: token }));
        },
        updateState: (state: Partial<TokenProps>) => {
          return set((prevState) => ({ ...prevState, ...state }));
        },
      }),
      {
        name: "token-store-v2",
      }
    )
  );
};

export const TokenContext = createContext<TokenStore | null>(null);

type TokenProviderProps = React.PropsWithChildren<TokenProps>;

export function TokenProvider({ children, ...props }: TokenProviderProps) {
  const storeRef = useRef<TokenStore>();

  if (!storeRef.current) {
    storeRef.current = createTokenStore(props);
  }

  return (
    <TokenContext.Provider value={storeRef.current}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenStore<T>(selector: (state: TokenState) => T): T {
  const store = useContext(TokenContext);
  if (!store) throw new Error("Missing TokenContext.Provider in the tree");
  return useStore(store, selector);
}
