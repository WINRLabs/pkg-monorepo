import { UseFormReturn } from 'react-hook-form';

export interface RouletteFormFields {
  totalWager: number;
  betCount: number;
  selectedNumbers: number[];
  wager: number;
  increaseOnWin: number;
  increaseOnLoss: number;
  stopGain: number;
  stopLoss: number;
}

export type RouletteForm = UseFormReturn<RouletteFormFields, any, undefined>;

export enum RouletteWheelColor {
  GREEN,
  RED,
  GREY,
}

export interface RouletteGameResult {
  won: boolean;
  outcome: number;
  payout: number;
  payoutInUsd: number;
}

export interface RouletteGameProps {
  gameResults: RouletteGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: RouletteGameResult[]) => void;
  onAnimationSkipped?: (result: RouletteGameResult[]) => void;
}
