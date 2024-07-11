import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { DiceGameResult } from "../types";

interface DiceGameState {
  lastBets: DiceGameResult[];
  diceGameResults: DiceGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
  rollValue: number;
}

interface DiceGameStateActions {
  addLastBet: (item: DiceGameResult) => void;
  updateLastBets: (item: DiceGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateDiceGameResults: (item: DiceGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
  updateRollValue: (value: number) => void;
}

export type DiceGameStore = DiceGameState & DiceGameStateActions;

export const diceResultsStore = create<DiceGameStore>()((set) => ({
  lastBets: [],
  diceGameResults: [],
  currentAnimationCount: 0,
  rollValue: 0,
  updateRollValue: (value) => set(() => ({ rollValue: value })),
  addLastBet: (item) =>
    set((state) => ({ lastBets: [...state.lastBets, item] })),
  updateLastBets: (item) => set(() => ({ lastBets: item })),
  removeLastBet: (index) =>
    set((state) => {
      const lastBets = [...state.lastBets];

      lastBets.splice(index, 1);

      return { lastBets };
    }),
  updateDiceGameResults: (item) => set(() => ({ diceGameResults: item })),
  clearStore: () =>
    set({
      lastBets: [],
      diceGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
      rollValue: 50,
    }),
  gameStatus: "IDLE",
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const useDiceGameStore = <T extends keyof DiceGameStore>(keys: T[]) =>
  diceResultsStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as DiceGameStore);

    return x as Pick<DiceGameStore, T>;
  }, shallow);

export default useDiceGameStore;
