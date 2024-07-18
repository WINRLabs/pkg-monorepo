import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { MultiplayerGameStatus } from "../../core/type";
import { Participant } from "../types";

export type CrashGameState = {
  status: MultiplayerGameStatus;
  finishTime: number;
  startTime: number;
  lastBets: string[];
  participants: Participant[];
};

export type CrashGameActions = {
  updateState: (state: Partial<CrashGameState>) => void;
  resetState: () => void;
  addParticipant: (data: Participant) => void;
  resetParticipants: () => void;
};

export type CrashGameStore = CrashGameState & CrashGameActions;

export const horseRaceGameStore = create<CrashGameStore>()((set) => ({
  status: MultiplayerGameStatus.None,
  finishTime: 0,
  startTime: 0,
  lastBets: [],
  participants: [],
  updateState: (state) => set((s) => ({ ...s, ...state })),
  resetState: () =>
    set({
      finishTime: 0,
      startTime: 0,
    }),
  addParticipant: (participant: Participant) =>
    set((state) => ({
      ...state,
      participants: [...state.participants, participant],
    })),
  resetParticipants: () => set({ participants: [] }),
}));

export const useCrashGameStore = <T extends keyof CrashGameStore>(keys: T[]) =>
  horseRaceGameStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as CrashGameStore);

    return x as Pick<CrashGameStore, T>;
  }, shallow);

export default useCrashGameStore;
