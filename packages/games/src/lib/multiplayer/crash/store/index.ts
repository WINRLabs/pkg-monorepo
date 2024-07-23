import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { MultiplayerGameStatus } from "../../core/type";
import { Participant } from "../types";

export type CrashGameState = {
  status: MultiplayerGameStatus;
  joiningFinish: number;
  joiningStart: number;
  cooldownFinish: number;
  lastBets: number[];
  participants: Participant[];
  finalMultiplier: number;
  isGamblerParticipant?: boolean;
};

export type CrashGameActions = {
  updateState: (state: Partial<CrashGameState>) => void;
  resetState: () => void;
  addParticipant: (data: Participant) => void;
  resetParticipants: () => void;
  setIsGamblerParticipant: (isGamblerParticipant: boolean) => void;
};

export type CrashGameStore = CrashGameState & CrashGameActions;

export const crashGameStore = create<CrashGameStore>()((set) => ({
  isGamblerParticipant: false,
  status: MultiplayerGameStatus.None,
  joiningFinish: 0,
  joiningStart: 0,
  lastBets: [],
  cooldownFinish: 0,
  participants: [],
  finalMultiplier: 0,
  gamblerBet: null,
  setIsGamblerParticipant: (isGamblerParticipant: boolean) =>
    set((state) => ({ ...state, isGamblerParticipant })),
  updateState: (state) => set((s) => ({ ...s, ...state })),
  resetState: () =>
    set({
      joiningFinish: 0,
      joiningStart: 0,
      cooldownFinish: 0,
      status: MultiplayerGameStatus.None,
      isGamblerParticipant: false,
    }),
  addParticipant: (participant: Participant) =>
    set((state) => {
      const existingParticipant = state.participants.find(
        (p) => p.name === participant.name
      );

      if (existingParticipant) {
        return state;
      }

      return {
        ...state,
        participants: [...state.participants, participant],
      };
    }),
  resetParticipants: () => set({ participants: [] }),
}));

export const useCrashGameStore = <T extends keyof CrashGameStore>(keys: T[]) =>
  crashGameStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as CrashGameStore);

    return x as Pick<CrashGameStore, T>;
  }, shallow);

export default useCrashGameStore;
