import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { LimboGameResult } from "../types";

interface LimboState {
  lastBets: LimboGameResult[];
  limboGameResults: LimboGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface LimboActions {
  addLastBet: (item: LimboGameResult) => void;
  updateLastBets: (item: LimboGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateLimboGameResults: (item: LimboGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type LimboStore = LimboState & LimboActions;

export const limboStore = create<LimboStore>()((set) => ({
  lastBets: [],
  limboGameResults: [],
  currentAnimationCount: 0,
  gameStatus: "IDLE",
  addLastBet: (item) =>
    set((state) => ({ lastBets: [...state.lastBets, item] })),
  updateLastBets: (item) => set(() => ({ lastBets: item })),
  removeLastBet: (index) =>
    set((state) => {
      const lastBets = [...state.lastBets];

      lastBets.splice(index, 1);

      return { lastBets };
    }),
  updateLimboGameResults: (item) => set(() => ({ limboGameResults: item })),
  clearStore: () =>
    set({
      lastBets: [],
      limboGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
    }),
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const useLimboGameStore = <T extends keyof LimboStore>(keys: T[]) =>
  limboStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as LimboStore);

    return x as Pick<LimboStore, T>;
  }, shallow);

export default useLimboGameStore;
