import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type PriceFeedVariable =
  | 'winr'
  | 'arb'
  | 'btc'
  | 'eth'
  | 'usdc'
  | 'weth'
  | 'sol'
  | 'usdt'
  | 'mck'
  | 'boop'
  | 'spx'
  | 'brett'
  | 'mog'
  | 'toshi';

export type TPriceFeed = Record<PriceFeedVariable, number>;

interface PriceFeedProviderProps {
  priceFeed: TPriceFeed;
}

interface PriceFeedProviderActions {
  updatePriceFeed: (priceFeed: TPriceFeed) => void;
}

export type PriceFeedProvider = PriceFeedProviderProps & PriceFeedProviderActions;

export const defaultPriceFeedValues = {
  winr: 1,
  arb: 1,
  btc: 1,
  eth: 1,
  usdc: 1,
  weth: 1,
  sol: 1,
  usdt: 1,
  mck: 1,
  boop: 1,
  spx: 1,
  brett: 1,
  mog: 1,
  toshi: 1,
};

export const usePriceFeedStore = create(
  persist<PriceFeedProvider>(
    (set) => ({
      priceFeed: defaultPriceFeedValues,
      updatePriceFeed: (priceFeed: TPriceFeed) => {
        set((prevState) => ({ ...prevState, priceFeed }));
      },
    }),
    {
      name: 'price-feed-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
