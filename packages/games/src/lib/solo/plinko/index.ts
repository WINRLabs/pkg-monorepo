import { Body } from './components/body';
import { Canvas } from './components/canvas';
import { PlinkoGame } from './components/game';
import { PlinkoLastBets } from './components/last-bets';

export const Plinko = {
  Game: PlinkoGame,
  Body,
  Canvas,
  LastBets: PlinkoLastBets,
};

export type { PlinkoTemplateOptions } from './components/template';
export { default as PlinkoTemplate } from './components/template';
export * from './store';
export * from './types';
