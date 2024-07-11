import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { CoinFlipGameResult } from "../types";

interface CoinFlipGameState {
  lastBets: CoinFlipGameResult[];
  coinFlipGameResults: CoinFlipGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface CoinFlipGameStateActions {
  addLastBet: (item: CoinFlipGameResult) => void;
  updateLastBets: (item: CoinFlipGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateCoinFlipGameResults: (item: CoinFlipGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type CoinFlipGameStore = CoinFlipGameState & CoinFlipGameStateActions;

export const coinFlipResultStore = create<CoinFlipGameStore>()((set) => ({
  lastBets: [],
  coinFlipGameResults: [],
  currentAnimationCount: 0,
  addLastBet: (item) =>
    set((state) => ({ lastBets: [...state.lastBets, item] })),
  updateLastBets: (item) => set(() => ({ lastBets: item })),
  removeLastBet: (index) =>
    set((state) => {
      const lastBets = [...state.lastBets];

      lastBets.splice(index, 1);

      return { lastBets };
    }),
  updateCoinFlipGameResults: (item) =>
    set(() => ({ coinFlipGameResults: item })),
  clearStore: () =>
    set({
      lastBets: [],
      coinFlipGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
    }),
  gameStatus: "IDLE",
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const useCoinFlipGameStore = <T extends keyof CoinFlipGameStore>(
  keys: T[]
) =>
  coinFlipResultStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as CoinFlipGameStore);

    return x as Pick<CoinFlipGameStore, T>;
  }, shallow);

export default useCoinFlipGameStore;
