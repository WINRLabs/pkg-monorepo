import { BetController } from './components/bet-controller';
import { TowerGame } from './components/game';
import { TowerScene } from './components/scene';

export const Tower = {
  Controller: BetController,
  Game: TowerGame,
  Scene: TowerScene,
};

export { default as TowerTemplate } from './components/template';
export * from './constants';
export * from './store';
export * from './types';
