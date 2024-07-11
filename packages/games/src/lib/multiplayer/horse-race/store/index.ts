import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { HorseRaceMultiplier, HorseRaceStatus } from "../constants";

type BetData = {
  name: string;
  bet: number;
};

type BetArray = BetData[];

export type HorseRaceMultiplierArray = {
  [key in HorseRaceMultiplier]: BetArray;
};

const defaultSelectedHorse: HorseRaceMultiplierArray = {
  "2x": [],
  "3x": [],
  "8x": [],
  "15x": [],
  "60x": [],
};

export type HorseRaceGameState = {
  status: HorseRaceStatus;
  finishTime: number;
  startTime: number;
  winnerHorse: number;
  selectedHorse: HorseRaceMultiplierArray;
  isParticipantsOpen: boolean;
  lastBets: HorseRaceMultiplier[];
};

export type HorseRaceGameActions = {
  updateState: (state: Partial<HorseRaceGameState>) => void;
  resetState: () => void;
  setSelectedHorse: (multiplier: HorseRaceMultiplier, data: BetData) => void;
  resetSelectedHorse: () => void;
  setIsParticipantsOpen: (isOpen: boolean) => void;
  addLastBet: (multiplier: HorseRaceMultiplier) => void;
};

export type HorseRaceGameStore = HorseRaceGameState & HorseRaceGameActions;

export const horseRaceGameStore = create<HorseRaceGameStore>()((set) => ({
  selectedHorse: defaultSelectedHorse,
  status: HorseRaceStatus.Idle,
  finishTime: 0,
  startTime: 0,
  winnerHorse: 0,
  lastBets: [],
  addLastBet: (item) =>
    set((state) => ({ ...state, lastBets: [...state.lastBets, item] })),
  updateState: (state) => set((s) => ({ ...s, ...state })),
  resetState: () =>
    set({
      status: HorseRaceStatus.Idle,
      finishTime: 0,
      startTime: 0,
      winnerHorse: 0,
    }),
  setSelectedHorse: (multiplier: HorseRaceMultiplier, data: BetData) =>
    set((state) => ({
      ...state,
      selectedHorse: {
        ...state.selectedHorse,
        [multiplier]: [...state.selectedHorse[multiplier], data],
      },
    })),
  resetSelectedHorse: () =>
    set((state) => ({ ...state, selectedHorse: defaultSelectedHorse })),
  isParticipantsOpen: false,
  setIsParticipantsOpen: (isOpen) => set({ isParticipantsOpen: isOpen }),
}));

export const useHorseRaceGameStore = <T extends keyof HorseRaceGameStore>(
  keys: T[]
) =>
  horseRaceGameStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as HorseRaceGameStore);

    return x as Pick<HorseRaceGameStore, T>;
  }, shallow);

export default useHorseRaceGameStore;
