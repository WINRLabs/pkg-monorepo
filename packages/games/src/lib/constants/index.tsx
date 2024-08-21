export const CDN_URL = 'https://jbassets.fra1.digitaloceanspaces.com/winrlabs-games';

export enum GameType {
  COINFLIP = 'COINFLIP',
  RANGE = 'RANGE',
  WHEEL = 'WHEEL',
  PLINKO = 'PLINKO',
  MOON = 'MOON',
  LOTTERY = 'LOTTERY',
  RPS = 'RPS',
  DICE = 'DICE',
  LIMBO = 'LIMBO',
  SLOT = 'SLOT',
  ROULETTE = 'ROULETTE',
  MINES = 'MINES',
  VIDEO_POKER = 'VIDEO_POKER',
  KENO = 'KENO',
  BACCARAT = 'BACCARAT',
  HORSE_RACE = 'HORSE_RACE',
  BLACKJACK = 'BLACKJACK',
  HOLDEM_POKER = 'HOLDEM_POKER',
  WINR_BONANZA = 'WINR_BONANZA',
  ONE_HAND_BLACKJACK = 'ONE_HAND_BLACKJACK',
}

// TODO: move this levels into centralized place, it is used at consumer apps
export const profileLevels = [
  {
    level: 1,
    name: 'McDonalds',
    xp: 50000,
    xpValue: 50000 * 1000,
    rakebackExtraPercentage: '2.50',
    levelColor: '#fff',
  },
  {
    level: 2,
    xp: 250000,
    xpValue: 250000 * 1000,
    name: 'NGMI',
    rakebackExtraPercentage: '3.75',
    levelColor: '#93C5FD',
  },
  {
    level: 3,
    xp: 500000,
    xpValue: 500000 * 1000,
    name: 'WAGMI',
    rakebackExtraPercentage: '5.00',
    levelColor: '#F9A8D4',
  },
  {
    level: 4,
    xp: 1000000,
    xpValue: 1000000 * 1000,
    name: 'Wen Lambo',
    rakebackExtraPercentage: '6.25',
    levelColor: '#FDBA74',
  },
  {
    level: 5,
    xp: 2000000,
    xpValue: 2000000 * 1000,
    name: 'Moon Boy',
    rakebackExtraPercentage: '7.50',
    levelColor: '#FCA5A5',
  },
  {
    level: 6,
    xp: 5000000,
    xpValue: 5000000 * 1000,
    name: 'Degen',
    rakebackExtraPercentage: '10.00',
    levelColor: '#C4B5FD',
  },
] as const;
