import { UseFormReturn } from "react-hook-form";
import { DICE } from "../types";

export const MIN_BET_COUNT = 1 as const;

export const MAX_BET_COUNT = 100 as const;

export interface DiceFormField {
  wager: number;
  betCount: number;
  stopGain: number;
  stopLoss: number;
  dices: DICE[];
}

export type DiceForm = UseFormReturn<DiceFormField, any, undefined>;

export const ALL_DICES = [
  DICE.ONE,
  DICE.TWO,
  DICE.THREE,
  DICE.FOUR,
  DICE.FIVE,
  DICE.SIX,
] as const;

export const LUCK_MULTIPLIER = 0.98;