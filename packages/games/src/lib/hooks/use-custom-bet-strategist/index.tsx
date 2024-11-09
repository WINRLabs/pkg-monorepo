'use client';

import React from 'react';

import { useGameOptions } from '../../game-provider';
import * as Strategist from '../../strategist';
import {
  getDAlembertStrategy,
  getDelayedMartingaleStrategy,
  getMartingaleStrategy,
  getParoliStrategy,
} from '../../strategist/default-strategies';
import { NormalizedStrategyStruct } from '../../strategist/types';
import { normalizeCreatedStrategies } from '../../strategist/utils';
import { parseToBigInt } from '../../utils/number';
import { useCustomBetStrategistStore } from './store';

interface IUseCustomBetStrategist {
  wager: number;
  isAutoBetMode: boolean;
  createdStrategies: Strategist.CreatedStrategy[];
}

export const useCustomBetStrategist = ({
  wager,
  isAutoBetMode,
  createdStrategies,
}: IUseCustomBetStrategist) => {
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const { allStrategies, selectedStrategy, setAllStrategies, setSelectedStrategy } =
    useCustomBetStrategistStore([
      'allStrategies',
      'selectedStrategy',
      'setAllStrategies',
      'setSelectedStrategy',
    ]);

  const strategist = React.useMemo(() => {
    return Strategist.load({
      items: selectedStrategy?.items || [],
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
    const _allStrategies = [
      ...predefinedStrategies,
      ...normalizeCreatedStrategies(createdStrategies),
    ];
    setAllStrategies([..._allStrategies]);

    const getNewStrategy = () => {
      const _new = _allStrategies.find(
        (s) => s.name === selectedStrategy.name
      ) as NormalizedStrategyStruct;

      if (!_new) return selectedStrategy;
      return _new;
    };

    setSelectedStrategy(getNewStrategy());
  }, [predefinedStrategies, isAutoBetMode, createdStrategies]);

  React.useEffect(() => {
    isAutoBetMode && strategist.reset();
  }, [isAutoBetMode]);

  React.useEffect(() => {
    console.log(allStrategies, 'allStrategies');
  }, [allStrategies]);

  return {
    strategist,
  };
};
