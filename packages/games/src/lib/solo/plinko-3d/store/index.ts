import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { PlinkoGameResult } from "../types";

interface PlinkoLastBets {
  multiplier: string;
  isWon: boolean;
}

interface PlinkoLastBetsState {
  lastBets: PlinkoLastBets[];
  plinkoGameResults: PlinkoGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface PlinkoLastBetsActions {
  addLastBet: (item: PlinkoLastBets) => void;
  updateLastBets: (item: PlinkoLastBets[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updatePlinkoGameResults: (item: PlinkoGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type PlinkoLastBetsStore = PlinkoLastBetsState & PlinkoLastBetsActions;

export const plinkoLastBetsStore = create<PlinkoLastBetsStore>()((set) => ({
  lastBets: [],
  plinkoGameResults: [],
  currentAnimationCount: 0,
  gameStatus: "IDLE",
  addLastBet: (item) =>
    set((state) => ({ lastBets: [...state.lastBets, item] })),
  updateLastBets: (item) => set(() => ({ lastBets: item })),
  updatePlinkoGameResults: (item) => set(() => ({ plinkoGameResults: item })),
  removeLastBet: (index) =>
    set((state) => {
      const lastBets = [...state.lastBets];

      lastBets.splice(index, 1);

      return { lastBets };
    }),
  clearStore: () =>
    set({
      lastBets: [],
      plinkoGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
    }),
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const usePlinkoLastBetsStore = <T extends keyof PlinkoLastBetsStore>(
  keys: T[]
) =>
  plinkoLastBetsStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as PlinkoLastBetsStore);

    return x as Pick<PlinkoLastBetsStore, T>;
  }, shallow);

export default usePlinkoLastBetsStore;
