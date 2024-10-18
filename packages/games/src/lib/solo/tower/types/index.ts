import { UseFormReturn } from 'react-hook-form';

export interface Cell {
  isBomb: boolean;
  isClickable: boolean;
  isSelected: boolean;
}

export interface TowerFormField {
  wager: number;
  betCount: number;
  stopGain: number;
  stopLoss: number;
  increaseOnWin: number;
  increaseOnLoss: number;
  riskLevel: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
  rows: number;
  numberOfBet: number;
  cells: Cell[][];
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
