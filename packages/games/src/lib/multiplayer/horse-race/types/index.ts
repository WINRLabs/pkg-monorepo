import { UseFormReturn } from "react-hook-form";

import { Horse } from "../constants";

export interface HorseRaceFormFields {
  wager: number;
  horse: Horse;
}

export type HorseRaceForm = UseFormReturn<HorseRaceFormFields, any, undefined>;

export interface HorseRaceCreated {
  startTime: number;
  endTime: number;
}

export interface HorseRaceParticipated {
  token: `0x${string}`;
  player: `0x${string}`;
  horse: number;
  amount: bigint;
  mintedVWINR: string;
  amountInUsd: number;
}

export interface HorseRaceSettled {
  horse: number;
  multiplier: string;
}

export interface HorseRaceInitialParticipant {
  address: string;
  selection: number;
  amountInUsd: number;
}
