import * as Action from '../strategist/items/action';
import * as Bet from '../strategist/items/bet';
import * as Profit from '../strategist/items/profit';
import {
  ConditionType,
  CreatedStrategy,
  CreatedStrategyItem,
  NormalizedStrategyItem,
  NormalizedStrategyStruct,
} from '.';

export const normalizeCreatedStrategies = (
  createdStrategy: CreatedStrategy[]
): NormalizedStrategyStruct[] => {
  return createdStrategy.map((s) => {
    return {
      strategyId: Number(s.strategyId),
      name: s.name,
      items: s.items.map(normalizeCreatedStrategyItem),
      originalItems: s.items,
    };
  });
};

const normalizeCreatedStrategyItem = (item: CreatedStrategyItem): NormalizedStrategyItem => {
  let condition: NormalizedStrategyItem['condition'];

  if (item.type_ == ConditionType.BET) {
    condition = Bet.toCondition({
      type: item.bet.type_,
      term: item.bet.term,
      amount: item.bet.amount,
    });
  } else {
    condition = Profit.toCondition({
      type: item.profit.type_,
      term: item.profit.term,
      amount: item.profit.amount,
    });
  }

  const action = Action.toAction({
    amount: item.action.amount,
    option: item.action.option,
  });

  return {
    action,
    condition,
  };
};
