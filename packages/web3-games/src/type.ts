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
  winrpoker = 'winrpoker',
  videopoker = 'videopoker',
  winrbonanza = 'winrbonanza',
  blackjackrouter = 'blackjackrouter',
  rockpaperscissor = 'rockpaperscissor',
  singleblackjackrouter = 'singleblackjackrouter',
  gateofolympos = 'gateofolympos',
  princesswinr = 'princesswinr',
}
