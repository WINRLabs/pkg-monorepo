import { MinesBetController } from './components/bet-controller';
import MineCell from './components/cell';
import MinesCountButton from './components/count-button';
import MinesCountDisplay from './components/count-display';
import { MinesGame } from './components/game';
import { MinesScene } from './components/scene';

export const Mines = {
  Controller: MinesBetController,
  Game: MinesGame,
  Scene: MinesScene,
  CountDisplay: MinesCountDisplay,
  CountButton: MinesCountButton,
  Cell: MineCell,
};

export { default as MinesTemplate } from './components/template';
export * from './constants';
export * from './provider/theme';
export * from './store';
export * from './types';
