import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { CoinFlip3dGameResult } from "../types";

interface CoinFlip3dGameState {
  lastBets: CoinFlip3dGameResult[];
  coinFlipGameResults: CoinFlip3dGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface CoinFlip3dGameStateActions {
  addLastBet: (item: CoinFlip3dGameResult) => void;
  updateLastBets: (item: CoinFlip3dGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateCoinFlip3dGameResults: (item: CoinFlip3dGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type CoinFlip3dGameStore = CoinFlip3dGameState &
  CoinFlip3dGameStateActions;

export const coinFlip3dResultStore = create<CoinFlip3dGameStore>()((set) => ({
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
  updateCoinFlip3dGameResults: (item) =>
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

export const useCoinFlip3dGameStore = <T extends keyof CoinFlip3dGameStore>(
  keys: T[]
) =>
  coinFlip3dResultStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as CoinFlip3dGameStore);

    return x as Pick<CoinFlip3dGameStore, T>;
  }, shallow);

export default useCoinFlip3dGameStore;
