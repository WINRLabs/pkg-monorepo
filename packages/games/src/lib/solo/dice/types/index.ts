import { UseFormReturn } from 'react-hook-form';

import {
  BetConditionFormValues,
  CreatedStrategy,
  ProfitConditionFormValues,
} from '../../../strategist';
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
  createdStrategies: CreatedStrategy[];
  create: (strategyName: string) => Promise<void>;
  addDefaultCondition: (strategyId: number) => Promise<void>;
  removeCondition: (strategyId: number, index: number) => Promise<void>;
  updateBetCondition: (
    strategyId: number,
    itemId: number,
    newValues: BetConditionFormValues
  ) => Promise<void>;
  updateProfitCondition: (
    strategyId: number,
    itemId: number,
    newValues: ProfitConditionFormValues
  ) => Promise<void>;
}
