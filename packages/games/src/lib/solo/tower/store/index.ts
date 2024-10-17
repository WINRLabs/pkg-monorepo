import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

import { TowerGameResult } from '../types';

interface TowerGameState {
  towerGameResults: TowerGameResult[];
  gameStatus: 'IDLE' | 'PLAYING' | 'ENDED';
  currentAnimationCount: number;
  gameMode: 'AUTO' | 'MANUAL';
}

interface TowerGameStateActions {
  clearStore: () => void;
  updateTowerGameResults: (item: TowerGameResult[]) => void;
  updateGameStatus: (status: 'IDLE' | 'PLAYING' | 'ENDED') => void;
  updateCurrentAnimationCount: (count: number) => void;
  updateGameMode: (mode: 'AUTO' | 'MANUAL') => void;
}

export type TowerGameStore = TowerGameState & TowerGameStateActions;

export const TowerResultsStore = create<TowerGameStore>()((set) => ({
  towerGameResults: [],
  gameMode: 'MANUAL',
  updateGameMode: (mode) => set(() => ({ gameMode: mode })),
  currentAnimationCount: 0,
  updateTowerGameResults: (item) => set(() => ({ towerGameResults: item })),
  clearStore: () =>
    set({
      towerGameResults: [],
      gameStatus: 'IDLE',
      currentAnimationCount: 0,
    }),
  gameStatus: 'IDLE',
  updateGameStatus: (status) => set(() => ({ gameStatus: status })),
  updateCurrentAnimationCount: (count) => set(() => ({ currentAnimationCount: count })),
}));

export const useTowerGameStore = <T extends keyof TowerGameStore>(keys: T[]) =>
  TowerResultsStore((state) => {
    const x = keys.reduce((acc, cur) => {
      acc[cur] = state[cur];

      return acc;
    }, {} as TowerGameStore);

    return x as Pick<TowerGameStore, T>;
  }, shallow);

export default useTowerGameStore;
