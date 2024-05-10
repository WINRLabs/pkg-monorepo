import { UseFormReturn } from "react-hook-form";

export const MIN_BET_COUNT = 1 as const;

export const MAX_BET_COUNT = 100 as const;

export const ROLL_TYPE = {
  UNDER: 0,
  OVER: 1,
} as const;

export const LUCK_MULTIPLIER = 0.98;

export const RANGE_ANIMATION_DURATION = 1000 as const;
