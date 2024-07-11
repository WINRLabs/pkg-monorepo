import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { RouletteGameResult } from "../types";

interface RouletteGameState {
  lastBets: RouletteGameResult[];
  rouletteGameResults: RouletteGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
}

interface RouletteGameStateActions {
  addLastBet: (item: RouletteGameResult) => void;
  updateLastBets: (item: RouletteGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateRouletteGameResults: (item: RouletteGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
}

export type RouletteGameStore = RouletteGameState & RouletteGameStateActions;

export const rouletteResultStore = create<RouletteGameStore>()((set) => ({
  lastBets: [],
  rouletteGameResults: [],
  addLastBet: (item) =>
    set((state) => ({ lastBets: [...state.lastBets, item] })),
  updateLastBets: (item) => set(() => ({ lastBets: item })),
  removeLastBet: (index) =>
    set((state) => {
      const lastBets = [...state.lastBets];

      lastBets.splice(index, 1);

      return { lastBets };
    }),
  updateRouletteGameResults: (item) =>
    set(() => ({ rouletteGameResults: item })),
  clearStore: () =>
    set({
      lastBets: [],
      rouletteGameResults: [],
      gameStatus: "IDLE",
    }),
  gameStatus: "IDLE",
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
}));

export const useRouletteGameStore = <T extends keyof RouletteGameStore>(
  keys: T[]
) =>
  rouletteResultStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as RouletteGameStore);

    return x as Pick<RouletteGameStore, T>;
  }, shallow);

export default useRouletteGameStore;
