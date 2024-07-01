import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { RPSGameResult } from "../types";

interface RPSLastBetsState {
  lastBets: RPSGameResult[];
  rpsGameResults: RPSGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface RPSLastBetsActions {
  addLastBet: (item: RPSGameResult) => void;
  updateLastBets: (item: RPSGameResult[]) => void;
  removeLastBet: (index: number) => void;
  clearStore: () => void;
  updateRpsGameResults: (item: RPSGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type RPSLastBetsStore = RPSLastBetsState & RPSLastBetsActions;

export const rpsLastBetsStore = create<RPSLastBetsStore>()((set) => ({
  lastBets: [],
  rpsGameResults: [],
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
  updateRpsGameResults: (item) => set(() => ({ rpsGameResults: item })),
  clearStore: () =>
    set({
      lastBets: [],
      rpsGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
    }),
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const useRpsGameStore = <T extends keyof RPSLastBetsStore>(keys: T[]) =>
  rpsLastBetsStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as RPSLastBetsStore);

    return x as Pick<RPSLastBetsStore, T>;
  }, shallow);

export default useRpsGameStore;
