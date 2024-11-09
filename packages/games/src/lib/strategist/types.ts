import * as Strategist from '.';

export interface StrategyStruct {
  itemIds: readonly number[];
  name: string;
  owner: `0x${string}`;
  strategyId: bigint;
}

export interface StrategyItem {
  bet: {
    term: number;
    type_: number;
    amount: number;
  };
  profit: {
    term: number;
    type_: number;
    amount: bigint;
  };
  action: {
    amount: bigint;
    option: number;
  };
  type_: number;
}

export interface CreatedStrategy {
  strategyId: bigint;
  name: string;
  items: CreatedStrategyItem[];
}

export interface CreatedStrategyItem extends StrategyItem {
  itemId: number;
}

export enum ConditionType {
  BET = 1,
  PROFIT,
}

export interface NormalizedStrategyStruct {
  items: NormalizedStrategyItem[];
  originalItems?: CreatedStrategyItem[];
  name: string;
  isPredefined?: boolean;
  strategyId?: number;
}

export interface NormalizedStrategyItem extends Strategist.Item {
  itemId?: number;
}

export interface BetConditionFormValues {
  onTerm: number;
  onType: number;
  onAmount: number;
  actionOption: number;
  actionAmount: bigint;
}

export interface ProfitConditionFormValues {
  onTerm: number;
  onType: number;
  onAmount: bigint;
  actionOption: number;
  actionAmount: bigint;
}
