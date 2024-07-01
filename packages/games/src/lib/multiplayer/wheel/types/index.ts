import { UseFormReturn } from "react-hook-form";
import { WheelColor, WheelStatus } from "../constants";

export interface WheelUnitProps {
  width: number;
  rotation: number;
  color: WheelColor;
}

export interface WheelSettledResult {
  color: number;
  angle: string;
}

export interface WheelCreatedResult {
  startTime: number;
  endTime: number;
}

export interface WheelParticipatedResult {
  token: string;
  color: number;
  player: string;
  amount: string;
  amountInUsd: number;
}

export interface WheelRef {
  move(): void;
  toDegree(toDegree: number): Promise<void>;
  reset(): Promise<void>;
}

export interface WheelContainerProps {
  spin?: boolean;
  degree?: number;
  units: WheelColor[];
  onComplete?: () => void;
}

export interface WheelAreaTimerProps {
  spinStartTime: number;
}

export interface WheelAreaProps {
  status: WheelStatus;
  timer: WheelAreaTimerProps;
  units: WheelColor[];
  multiplier: number;
  degree: number;
  onComplete?: () => void;
}

export interface WheelFormFields {
  wager: number;
  color: WheelColor;
}
export type WheelForm = UseFormReturn<WheelFormFields, any, undefined>;

export interface WheelInitialGameData {
  gameStartTime: number;
  gameFinishTime: number;
  state: any;
  participants: WheelInitialParticipant[];
}

export interface WheelInitialParticipant {
  address: string;
  selection: number;
  amountInUsd: number;
}
