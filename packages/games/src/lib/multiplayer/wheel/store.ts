import { create } from "zustand";
import { createSelectors } from "../../utils/store";
import { MultiplayerGameStatus } from "../core/type";
import { Multiplier, WheelColor } from "./constants";

type BetData = {
  name: string;
  bet: number;
};

type BetArray = BetData[];

export type MultiplierArray = {
  [key in Multiplier]: BetArray;
};

interface WheelGameState {
  startTime: number;
  finishTime: number;
  lastBets: number[];
  status: MultiplayerGameStatus;
  isParticipantsOpen: boolean;
  wheelParticipants: MultiplierArray;
  winnerAngle: number;
  winnerColor: WheelColor;
  allParticipantCount: () => number;
}

interface WheelGameStateActions {
  setIsParticipantsOpen: (isParticipantsOpen: boolean) => void;
  setWheelParticipant: (multiplier: Multiplier, data: BetData) => void;
  resetWheelParticipant: () => void;
  updateTime: (startTime: number, finishTime: number) => void;
  updateState: (state: Partial<WheelGameState>) => void;
}

const defaultWheelParticipant: MultiplierArray = {
  "2x": [],
  "3x": [],
  "6x": [],
  "48x": [],
};

export type WheelGameStore = WheelGameState & WheelGameStateActions;

export const wheelGameStore = create<WheelGameStore>()((set, get) => ({
  lastBets: [],
  startTime: 0,
  finishTime: 0,
  status: MultiplayerGameStatus.None,
  winnerColor: WheelColor.IDLE,
  winnerAngle: 0,

  isParticipantsOpen: false,
  setIsParticipantsOpen: (isParticipantsOpen: boolean) =>
    set(() => ({ isParticipantsOpen })),
  wheelParticipants: defaultWheelParticipant,
  setWheelParticipant: (multiplier: Multiplier, data: BetData) =>
    set((state) => ({
      ...state,
      wheelParticipants: {
        ...state.wheelParticipants,
        [multiplier]: [...state.wheelParticipants[multiplier], data],
      },
    })),
  resetWheelParticipant: () =>
    set((state) => ({ ...state, wheelParticipants: defaultWheelParticipant })),
  allParticipantCount: () =>
    Object.values(get().wheelParticipants).reduce(
      (acc, cur) => acc + cur.length,
      0,
    ),
  updateState: (newState: Partial<WheelGameState>) =>
    set((state) => ({ ...state, ...newState })),
  updateTime: (startTime: number, finishTime: number) =>
    set((state) => ({ ...state, startTime, finishTime })),
}));

export const useWheelGameStore = createSelectors<WheelGameStore>(
  wheelGameStore,
);
