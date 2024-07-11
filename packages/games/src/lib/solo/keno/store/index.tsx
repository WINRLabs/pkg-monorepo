import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { KenoGameResult } from "../types";

interface KenoGameState {
  kenoGameResults: KenoGameResult[];
  gameStatus: "IDLE" | "PLAYING" | "ENDED";
  currentAnimationCount: number;
}

interface KenoGameStateActions {
  clearStore: () => void;
  updateKenoGameResults: (item: KenoGameResult[]) => void;
  updateGameStatus: (status: "IDLE" | "PLAYING" | "ENDED") => void;
  updateCurrentAnimationCount: (count: number) => void;
}

export type KenoGameStore = KenoGameState & KenoGameStateActions;

export const KenoResultsStore = create<KenoGameStore>()((set) => ({
  kenoGameResults: [],
  currentAnimationCount: 0,
  updateKenoGameResults: (item) => set(() => ({ kenoGameResults: item })),
  clearStore: () =>
    set({
      kenoGameResults: [],
      gameStatus: "IDLE",
      currentAnimationCount: 0,
    }),
  gameStatus: "IDLE",
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) =>
    set(() => ({ currentAnimationCount: count })),
}));

export const useKenoGameStore = <T extends keyof KenoGameStore>(keys: T[]) =>
  KenoResultsStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as KenoGameStore);

    return x as Pick<KenoGameStore, T>;
  }, shallow);

export default useKenoGameStore;
