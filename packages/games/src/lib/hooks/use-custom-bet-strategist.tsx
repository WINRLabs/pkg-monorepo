'use client';

import React from 'react';

import { useGameOptions } from '../game-provider';
import * as Strategist from '../strategist';
import {
  getDAlembertStrategy,
  getDelayedMartingaleStrategy,
  getMartingaleStrategy,
  getParoliStrategy,
} from '../strategist/default-strategies';
import { NormalizedStrategyStruct } from '../strategist/types';
import { parseToBigInt } from '../utils/number';

interface IUseCustomBetStrategist {
  wager: number;
  isAutoBetMode: boolean;
}

export const useCustomBetStrategist = ({ wager, isAutoBetMode }: IUseCustomBetStrategist) => {
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const [allStrategies, setAllStrategies] = React.useState<NormalizedStrategyStruct[]>([]);

  const [selectedStrategy, setSelectedStrategy] =
    React.useState<NormalizedStrategyStruct>(getMartingaleStrategy());

  const strategist = React.useMemo(() => {
    return Strategist.load({
      items: selectedStrategy.items,
      wager: parseToBigInt(wager, 8),
      balance: parseToBigInt(balanceAsDollar, 8),
    });
  }, [selectedStrategy, isAutoBetMode]);

  const predefinedStrategies = React.useMemo(() => {
    return [
      getMartingaleStrategy(),
      getDelayedMartingaleStrategy(),
      getParoliStrategy(),
      getDAlembertStrategy(wager),
    ];
  }, [isAutoBetMode]);

  React.useEffect(() => {
    setAllStrategies([...predefinedStrategies]);
    setSelectedStrategy(
      (prev) => predefinedStrategies.find((s) => s.name === prev.name) as NormalizedStrategyStruct
    );
  }, [predefinedStrategies, isAutoBetMode]);

  React.useEffect(() => {
    isAutoBetMode && strategist.reset();
  }, [isAutoBetMode]);

  return {
    strategist,

    allStrategies,
    selectedStrategy,
    setSelectedStrategy,
  };
};
