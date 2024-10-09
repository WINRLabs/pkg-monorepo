import { UseFormReturn } from 'react-hook-form';

export interface TowerFormField {
  wager: number;
  betCount: number;
  selections: number[];
  stopGain: number;
  stopLoss: number;
  increaseOnWin: number;
  increaseOnLoss: number;
}

export type TowerForm = UseFormReturn<TowerFormField, any, undefined>;

export type TowerGameResult = {
  resultNumbers: number[];
  settled: TowerSettled;
};

export interface TowerSettled {
  payoutsInUsd: number;
  profitInUsd: number;
  won?: boolean;
}
