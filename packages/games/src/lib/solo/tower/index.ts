import { BetController } from './components/bet-controller';
import { TowerGame as TowerScene } from './components/game';
import TowerGame from './components/tower-game';

export const Tower = {
  Controller: BetController,
  Game: TowerScene,
  Scene: TowerGame,
};

export { default as TowerTemplate } from './components/template';
export * from './constants';
export * from './store';
export * from './types';
