import { create } from "zustand";

import { createSelectors } from "../../utils/store";
import { MultiplayerGameStatus } from "../core/type";
import { Multiplier, WheelColor } from "./constants";

type BetData = {
  bet: number;
  player: string;
};

type BetArray = Record<string, number>;

export type MultiplierArray = {
  [key in Multiplier]: BetArray;
};

interface WheelGameState {
  joiningStart: number;
  joiningFinish: number;
  cooldownFinish: number;
  status: MultiplayerGameStatus;
  lastBets: number[];
  isParticipantsOpen: boolean;
  wheelParticipants: MultiplierArray;
  winnerAngle: number;
  winnerColor: WheelColor;
  isGamblerParticipant: boolean;
  showResult: boolean;
  allParticipantCount: () => number;
}

interface WheelGameStateActions {
  setIsParticipantsOpen: (isParticipantsOpen: boolean) => void;
  setWheelParticipant: (multiplier: Multiplier, data: BetData) => void;
  resetWheelParticipant: () => void;
  updateTime: (joiningStart: number, joiningFinish: number) => void;
  updateState: (state: Partial<WheelGameState>) => void;
  setIsGamblerParticipant: (isGamblerParticipant: boolean) => void;
  setShowResult: (showResult: boolean) => void;
  resetState: () => void;
}

const defaultWheelParticipant: MultiplierArray = {
  "2x": {},
  "3x": {},
  "6x": {},
  "48x": {},
};

export type WheelGameStore = WheelGameState & WheelGameStateActions;

export const wheelGameStore = create<WheelGameStore>()((set, get) => ({
  lastBets: [],
  joiningStart: 0,
  joiningFinish: 0,
  cooldownFinish: 0,
  winnerColor: WheelColor.IDLE,
  winnerAngle: 0,
  status: MultiplayerGameStatus.None,
  isGamblerParticipant: false,
  showResult: false,
  setShowResult: (showResult: boolean) => set(() => ({ showResult })),
  setIsGamblerParticipant: (isGamblerParticipant: boolean) =>
    set(() => ({ isGamblerParticipant })),
  isParticipantsOpen: false,
  setIsParticipantsOpen: (isParticipantsOpen: boolean) =>
    set(() => ({ isParticipantsOpen })),
  wheelParticipants: defaultWheelParticipant,
  setWheelParticipant: (multiplier: Multiplier, data: BetData) =>
    set((state) => ({
      ...state,
      wheelParticipants: {
        ...state.wheelParticipants,
        [multiplier]: {
          ...state.wheelParticipants[multiplier],
          [data.player]: data.bet,
        },
      },
    })),
  resetWheelParticipant: () =>
    set((state) => ({ ...state, wheelParticipants: defaultWheelParticipant })),
  allParticipantCount: () => 0,
  updateState: (newState: Partial<WheelGameState>) =>
    set((state) => ({ ...state, ...newState })),
  updateTime: (joiningStart: number, joiningFinish: number) =>
    set((state) => ({ ...state, joiningStart, joiningFinish })),
  resetState: () =>
    set(() => ({
      joiningStart: 0,
      joiningFinish: 0,
      cooldownFinish: 0,
      status: MultiplayerGameStatus.None,
      winnerColor: WheelColor.IDLE,
      isGamblerParticipant: false,
      showResult: false,
    })),
}));

export const useWheelGameStore = createSelectors<WheelGameStore>(
  wheelGameStore,
);
