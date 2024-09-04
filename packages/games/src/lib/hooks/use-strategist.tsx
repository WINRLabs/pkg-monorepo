'use client';

import React from 'react';

import { useGameOptions } from '../game-provider';
import * as Strategist from '../strategist';
import * as Action from '../strategist/items/action';
import * as Profit from '../strategist/items/profit';
import { parseToBigInt } from '../utils/number';

interface IUseStrategist {
  wager: number;
  increasePercentageOnWin: number;
  increasePercentageOnLoss: number;
  stopProfit: number;
  stopLoss: number;
  isAutoBetMode: boolean;
}

export const useStrategist = ({
  wager,
  increasePercentageOnWin,
  increasePercentageOnLoss,
  stopProfit,
  stopLoss,
  isAutoBetMode,
}: IUseStrategist) => {
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const strategist = React.useMemo(() => {
    const stopStrategyItems = [];
    // stop action and conditions
    const stopOnProfitCondition = Profit.toCondition({
      type: Profit.ProfitType.CumulativeProfit,
      term: Profit.ProfitTerm.GreaterThanOrEqualTo,
      amount: parseToBigInt(stopProfit, 8),
    });

    const stopOnLossCondition = Profit.toCondition({
      type: Profit.ProfitType.CumulativeLost,
      term: Profit.ProfitTerm.GreaterThanOrEqualTo,
      amount: parseToBigInt(stopLoss, 8),
    });

    const stopAction = Action.toAction({
      amount: 0n,
      option: Action.Option.Stop,
    });

    stopProfit > 0 &&
      stopStrategyItems.push({
        condition: stopOnProfitCondition,
        action: stopAction,
      });
    stopLoss > 0 &&
      stopStrategyItems.push({
        condition: stopOnLossCondition,
        action: stopAction,
      });

    // profit on win condition and action
    const profitOnWin = Profit.toCondition({
      type: Profit.ProfitType.Profit,
      term: Profit.ProfitTerm.GreaterThan,
      amount: 0n,
    });
    const profitOnWinAction = Action.toAction({
      amount: parseToBigInt(
        increasePercentageOnWin < 0 ? increasePercentageOnWin * -1 : increasePercentageOnWin,
        6
      ),
      option:
        increasePercentageOnWin < 0
          ? Action.Option.DecreaseByPercentage
          : Action.Option.IncreaseByPercentage,
    });

    // profit on loss condition and action
    const profitOnLoss = Profit.toCondition({
      type: Profit.ProfitType.Lost,
      term: Profit.ProfitTerm.GreaterThan,
      amount: 0n,
    });

    const profitOnLossAction = Action.toAction({
      amount: parseToBigInt(
        increasePercentageOnLoss < 0 ? increasePercentageOnLoss * -1 : increasePercentageOnLoss,
        6
      ),
      option:
        increasePercentageOnLoss < 0
          ? Action.Option.DecreaseByPercentage
          : Action.Option.IncreaseByPercentage,
    });

    return Strategist.load({
      items: [
        ...stopStrategyItems,
        {
          condition: profitOnWin,
          action: profitOnWinAction,
        },
        {
          condition: profitOnLoss,
          action: profitOnLossAction,
        },
      ],
      wager: parseToBigInt(wager, 8),
      balance: parseToBigInt(balanceAsDollar, 8),
    });
  }, [increasePercentageOnWin, increasePercentageOnLoss, wager, stopProfit, stopLoss]);

  React.useEffect(() => {
    isAutoBetMode && strategist.reset();
  }, [isAutoBetMode]);

  return strategist;
};
