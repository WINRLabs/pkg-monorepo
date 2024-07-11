import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { VideoPokerResult } from "../constants";

export enum VideoPokerStatus {
  None,
  Start,
  Dealt,
  Finalizing,
  Final,
}

export type VideoPokerGameState = {
  status: VideoPokerStatus;
  gameResult: VideoPokerResult;
};

export type VideoPokerGameActions = {
  updateState: (state: Partial<VideoPokerGameState>) => void;
  resetState: () => void;
};

export type VideoPokerGameStore = VideoPokerGameState & VideoPokerGameActions;

export const videoPokerGameStore = create<VideoPokerGameStore>((set) => ({
  status: VideoPokerStatus.None,
  gameResult: VideoPokerResult.LOST,
  updateState: (state) => set((s) => ({ ...s, ...state })),
  resetState: () =>
    set({
      status: VideoPokerStatus.None,
    }),
}));

export const useVideoPokerGameStore = <T extends keyof VideoPokerGameStore>(
  keys: T[]
) =>
  videoPokerGameStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as VideoPokerGameStore);

    return x as Pick<VideoPokerGameStore, T>;
  }, shallow);

export default useVideoPokerGameStore;
