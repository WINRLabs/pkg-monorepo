import { BetConditionFormValues, CreatedStrategy, ProfitConditionFormValues } from '../strategist';

export type BetMode = 'MANUAL' | 'AUTO' | 'AUTO_CUSTOM_STRATEGY';

export interface StrategyProps {
  createdStrategies: CreatedStrategy[];
  create: (strategyName: string) => Promise<void>;
  remove: (strategyId: number) => Promise<void>;
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
