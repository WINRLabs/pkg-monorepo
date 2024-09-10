export interface BaseGameProps {
  onError?: (error: any) => void;
  onLogin?: () => void;
}

export enum GameTypesEnvironmentStore {
  moon = 'moon',
  keno = 'keno',
  dice = 'dice',
  limbo = 'limbo',
  range = 'range',
  wheel = 'wheel',
  mines = 'mines',
  plinko = 'plinko',
  coinflip = 'coinflip',
  lottery = 'lottery',
  roulette = 'roulette',
  baccarat = 'baccarat',
  horserace = 'horserace',
  videopoker = 'videopoker',
  winrbonanza = 'winrbonanza',
  rockpaperscissor = 'rockpaperscissor',
  blackjackprocessorsecond = 'blackjackprocessorsecond',
  singleblackjackprocessorsecond = 'singleblackjackprocessorsecond',
}
