import { UseFormReturn } from 'react-hook-form';

export type KenoMultipliers = Record<number, number[]>;

export interface KenoFormField {
  wager: number;
  betCount: number;
  selections: number[];
  stopGain: number;
  stopLoss: number;
  increaseOnWin: number;
  increaseOnLoss: number;
}

export type KenoForm = UseFormReturn<KenoFormField, any, undefined>;

export type KenoGameResult = {
  resultNumbers: number[];
  settled: KenoSettled;
};

export interface KenoSettled {
  payoutsInUsd: number;
  profitInUsd: number;
  won?: boolean;
}
