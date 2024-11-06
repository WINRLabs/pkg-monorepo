import { UseFormReturn } from 'react-hook-form';

import { SliderTrackOptions } from '../components/slider';

export interface DiceFormFields {
  wager: number;
  betCount: number;
  stopGain: number;
  stopLoss: number;
  rollValue: number;
  winChance: number;
  rollType: 'OVER' | 'UNDER';
  increaseOnWin: number;
  increaseOnLoss: number;
}
export type DiceForm = UseFormReturn<DiceFormFields, any, undefined>;

export interface DiceGameResult {
  resultNumber: number;
  payout: number;
  payoutInUsd: number;
}

export type DiceTemplateOptions = {
  slider?: {
    track?: SliderTrackOptions;
  };
  scene?: {
    background?: string;
  };
};

export interface StrategyProps {
  create: (strategyName: string) => Promise<void>;
  isCreating: boolean;
}
