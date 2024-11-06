import * as Action from '../strategist/items/action';
import * as Bet from '../strategist/items/bet';
import { parseToBigInt } from '../utils/number';
import { NORMALIZED_PRECISION, WAGER_PRECISION } from '.';
import { NormalizedStrategyStruct } from './types';

export const getMartingaleStrategy = (): NormalizedStrategyStruct => {
  // on every loses increase bet amount 100%
  const firstItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Lose,
      term: Bet.Term.Every,
      amount: 1,
    }),
    action: Action.toAction({
      amount: parseToBigInt(100, NORMALIZED_PRECISION),
      option: Action.Option.IncreaseByPercentage,
    }),
  };

  return {
    items: [firstItem],
    name: 'Martingale',
    isPredefined: true,
  };
};

export const getDelayedMartingaleStrategy = (): NormalizedStrategyStruct => {
  // on every streak of 3 loses increase bet amount 100%
  const firstItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Lose,
      term: Bet.Term.EveryStreakOf,
      amount: 3,
    }),
    action: Action.toAction({
      amount: parseToBigInt(100, NORMALIZED_PRECISION),
      option: Action.Option.IncreaseByPercentage,
    }),
  };

  // on every wins reset bet amount
  const secondItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Win,
      term: Bet.Term.Every,
      amount: 1,
    }),
    action: Action.toAction({
      option: Action.Option.ResetAmount,
      amount: 0n,
    }),
  };

  return {
    items: [firstItem, secondItem],
    name: 'Delayed Martingale',
    isPredefined: true,
  };
};

export const getParoliStrategy = (): NormalizedStrategyStruct => {
  // on every wins increase bet amount 100%
  const firstItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Win,
      term: Bet.Term.Every,
      amount: 1,
    }),
    action: Action.toAction({
      amount: parseToBigInt(100, NORMALIZED_PRECISION),
      option: Action.Option.IncreaseByPercentage,
    }),
  };

  // on streak greater than 3 wins reset bet amount
  const secondItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Win,
      term: Bet.Term.StreakGreaterThan,
      amount: 3,
    }),
    action: Action.toAction({
      option: Action.Option.ResetAmount,
      amount: 0n,
    }),
  };

  // on every loses reset bet amount
  const thirdItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Lose,
      term: Bet.Term.Every,
      amount: 1,
    }),
    action: Action.toAction({
      option: Action.Option.ResetAmount,
      amount: 0n,
    }),
  };

  return {
    items: [firstItem, secondItem, thirdItem],
    name: 'Paroli',
    isPredefined: true,
  };
};

export const getDAlembertStrategy = (wager: number): NormalizedStrategyStruct => {
  const firstItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Win,
      term: Bet.Term.Every,
      amount: 1,
    }),
    action: Action.toAction({
      option: Action.Option.SubtractFromAmount,
      amount: parseToBigInt(wager, WAGER_PRECISION),
    }),
  };

  const secondItem = {
    condition: Bet.toCondition({
      type: Bet.Type.Lose,
      term: Bet.Term.Every,
      amount: 1,
    }),
    action: Action.toAction({
      option: Action.Option.AddToAmount,
      amount: parseToBigInt(wager, WAGER_PRECISION),
    }),
  };

  return {
    items: [firstItem, secondItem],
    name: "D'Alembert",
    isPredefined: true,
  };
};
