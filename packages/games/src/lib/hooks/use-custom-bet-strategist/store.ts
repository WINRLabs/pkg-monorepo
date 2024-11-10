import { create } from 'zustand';

import { NormalizedStrategyStruct } from '../../strategist';
import { getMartingaleStrategy } from '../../strategist/default-strategies';
import { createSelectors } from '../../utils/store';

interface CustomBetStrategistState {
  allStrategies: NormalizedStrategyStruct[];
  selectedStrategy: NormalizedStrategyStruct;
}

interface CustomBetStrategistStateActions {
  setAllStrategies: (strategies: NormalizedStrategyStruct[]) => void;
  setSelectedStrategy: (strategy: NormalizedStrategyStruct) => void;
}

type CustomBetStrategistStore = CustomBetStrategistState & CustomBetStrategistStateActions;

const customBetStrategistStore = create<CustomBetStrategistStore>()((set, get) => ({
  allStrategies: [],
  selectedStrategy: getMartingaleStrategy(),
  setAllStrategies: (strategies: NormalizedStrategyStruct[]) => {
    set({ allStrategies: strategies });
  },
  setSelectedStrategy: (strategy: NormalizedStrategyStruct) => {
    set({ selectedStrategy: strategy });
  },
}));

export const useCustomBetStrategistStore =
  createSelectors<CustomBetStrategistStore>(customBetStrategistStore);
