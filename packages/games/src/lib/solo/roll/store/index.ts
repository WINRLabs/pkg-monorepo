import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { RollGameResult } from "../types";

interface RollLastBetsState {
  lastBets: RollGameResult[];
  rollGameResults: RollGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface DiceLastBetsActions {
  addLastBet: (item: RollGameResult) => void;
  updateLastBets: (item: RollGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateRollGameResults: (item: RollGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type DiceLastBetsStore = RollLastBetsState & DiceLastBetsActions;

export const diceResultStore = create<DiceLastBetsStore>()((set) => ({
  lastBets: [],
  rollGameResults: [],
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
  updateRollGameResults: (item) => set(() => ({ rollGameResults: item })),
  clearStore: () =>
    set({
      lastBets: [],
      rollGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
    }),
  gameStatus: "IDLE",
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const useRollGameStore = <T extends keyof DiceLastBetsStore>(
  keys: T[]
) =>
  diceResultStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as DiceLastBetsStore);

    return x as Pick<DiceLastBetsStore, T>;
  }, shallow);

export default useRollGameStore;
