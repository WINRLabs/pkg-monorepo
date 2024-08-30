import { useEffect } from 'react';
import { create } from 'zustand';

import { createSelectors } from '../../utils/store';
import { toDecimals } from '../../utils/web3';
import { GameType } from '../../constants';

export interface Result {
  won: boolean;
  payout: number;
  gameType?: GameType;
}

export interface LiveResultState {
  wager: number;
  totalWager: number;
  betCount: number;
  results: Result[];
  currentProfit: number;
  wonCount: number;
  lossCount: number;
  isMultiplayer?: boolean;
}

export interface LiveResultActions {
  addResult: (item: Result) => void;
  updateGame: ({ wager, betCount }: { wager: number; betCount?: number }) => void;
  skipAll: (allResults: Result[]) => void;
  clear: () => void;
  setIsMultiplayer: (isMultiplayer: boolean) => void;
}

export type LiveResultStore = LiveResultState & LiveResultActions;

export const liveResultStore = create<LiveResultStore>()((set, get) => ({
  wager: 0,
  totalWager: 0,
  betCount: 0,
  currentProfit: 0,
  wonCount: 0,
  lossCount: 0,
  results: [],
  isMultiplayer: false,
  updateGame: ({ wager, betCount }) => {
    set((state) => ({
      ...state,
      wager,
      totalWager: toDecimals(state.totalWager + wager, 2),
      betCount,
    }));
  },
  addResult: (item) => {
    set((state) => {
      const currentProfit = get()?.currentProfit;

      let newProfit = item.won
        ? currentProfit + item.payout - get()?.wager
        : currentProfit - get()?.wager;

      if (item?.gameType == GameType.PLINKO)
        newProfit = item.won
          ? currentProfit + item.payout
          : currentProfit + item.payout - get()?.wager;

      return {
        ...state,
        currentProfit: toDecimals(newProfit, 2),
        wonCount: item.won ? get()?.wonCount + 1 : get()?.wonCount,
        lossCount: !item.won ? get()?.lossCount + 1 : get()?.lossCount,
        results: [...state.results, item],
      };
    });
  },
  skipAll: (allResults) => {
    set((state) => {
      const newProfit = allResults.reduce((acc, cur) => {
        return acc + cur.payout;
      }, 0);

      const wonCount = allResults.reduce((acc, cur) => {
        return acc + (cur.won ? 1 : 0);
      }, 0);

      const lossCount = allResults.reduce((acc, cur) => {
        return acc + (!cur.won ? 1 : 0);
      }, 0);

      return {
        ...state,
        currentProfit: toDecimals(newProfit, 2),
        results: allResults,
        lossCount,
        wonCount,
      };
    });
  },
  clear: () => {
    set({
      wager: 0,
      totalWager: 0,
      betCount: 0,
      results: [],
      currentProfit: 0,
      wonCount: 0,
      lossCount: 0,
    });
  },
  setIsMultiplayer: (isMultiplayer) => {
    set((state) => ({
      ...state,
      isMultiplayer,
    }));
  },
}));

export const useLiveResultStore = createSelectors(liveResultStore);

/**
 * This hook is used to configure the store for multiplayer games.
 */
export const useConfigureMultiplayerLiveResultStore = () => {
  const { setIsMultiplayer } = useLiveResultStore(['setIsMultiplayer']);
  useEffect(() => {
    setIsMultiplayer(true);
    return () => setIsMultiplayer(false);
  }, []);
};
