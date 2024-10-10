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
  WINR_OLYMPUS = 'WINR_OLYMPUS',
  WINR_PRINCESS = 'WINR_PRINCESS',
  SINGLE_WHEEL = 'SINGLE_WHEEL',
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

export const wagerLevels = [
  {
    level: 1,
    wageredAmount: 5000,
    levelColor: '#ed9981',
    levelIcon: 'bronze',
    title: 'Bronze 1',
  },
  {
    level: 2,
    wageredAmount: 10000,
    levelColor: '#ed9981',
    levelIcon: 'bronze',
    title: 'Bronze 2',
  },
  {
    level: 3,
    wageredAmount: 20000,
    levelColor: '#ed9981',
    levelIcon: 'bronze',
    title: 'Bronze 3',
  },
  {
    level: 4,
    wageredAmount: 25000,
    levelColor: '#ed9981',
    levelIcon: 'bronze',
    title: 'Bronze 4',
  },
  {
    level: 5,
    wageredAmount: 30000,
    levelColor: '#ed9981',
    levelIcon: 'bronze',
    title: 'Bronze 5',
  },
  {
    level: 6,
    wageredAmount: 50000,
    levelColor: '#cfcfcf',
    levelIcon: 'silver',
    title: 'Silver 1',
  },
  {
    level: 7,
    wageredAmount: 75000,
    levelColor: '#cfcfcf',
    levelIcon: 'silver',
    title: 'Silver 2',
  },
  {
    level: 8,
    wageredAmount: 100000,
    levelColor: '#cfcfcf',
    levelIcon: 'silver',
    title: 'Silver 3',
  },
  {
    level: 9,
    wageredAmount: 125000,
    levelColor: '#cfcfcf',
    levelIcon: 'silver',
    title: 'Silver 4',
  },
  {
    level: 10,
    wageredAmount: 150000,
    levelColor: '#cfcfcf',
    levelIcon: 'silver',
    title: 'Silver 5',
  },
  {
    level: 11,
    wageredAmount: 200000,
    levelColor: '#e6bc5d',
    levelIcon: 'gold',
    title: 'Gold 1',
  },
  {
    level: 12,
    wageredAmount: 300000,
    levelColor: '#e6bc5d',
    levelIcon: 'gold',
    title: 'Gold 2',
  },
  {
    level: 13,
    wageredAmount: 400000,
    levelColor: '#e6bc5d',
    levelIcon: 'gold',
    title: 'Gold 3',
  },
  {
    level: 14,
    wageredAmount: 500000,
    levelColor: '#e6bc5d',
    levelIcon: 'gold',
    title: 'Gold 4',
  },
  {
    level: 15,
    wageredAmount: 600000,
    levelColor: '#e6bc5d',
    levelIcon: 'gold',
    title: 'Gold 5',
  },
  {
    level: 16,
    wageredAmount: 750000,
    levelColor: '#7cb6ff',
    levelIcon: 'platinum',
    title: 'Platinum 1',
  },
  {
    level: 17,
    wageredAmount: 1000000,
    levelColor: '#7cb6ff',
    levelIcon: 'platinum',
    title: 'Platinum 2',
  },
  {
    level: 18,
    wageredAmount: 1500000,
    levelColor: '#7cb6ff',
    levelIcon: 'platinum',
    title: 'Platinum 3',
  },
  {
    level: 19,
    wageredAmount: 2500000,
    levelColor: '#7cb6ff',
    levelIcon: 'platinum',
    title: 'Platinum 4',
  },
  {
    level: 20,
    wageredAmount: 5000000,
    levelColor: '#7cb6ff',
    levelIcon: 'platinum',
    title: 'Platinum 5',
  },
  {
    level: 21,
    wageredAmount: 10000000,
    levelColor: '#ffc18d',
    levelIcon: 'diamond',
    title: 'Diamond 1',
  },
  {
    level: 22,
    wageredAmount: 25000000,
    levelColor: '#ffc18d',
    levelIcon: 'diamond',
    title: 'Diamond 2',
  },
  {
    level: 23,
    wageredAmount: 50000000,
    levelColor: '#ffc18d',
    levelIcon: 'diamond',
    title: 'Diamond 3',
  },
  {
    level: 24,
    wageredAmount: 100000000,
    levelColor: '#ffc18d',
    levelIcon: 'diamond',
    title: 'Diamond 4',
  },
  {
    level: 25,
    wageredAmount: 250000000,
    levelColor: '#ffc18d',
    levelIcon: 'diamond',
    title: 'Diamond 5',
  },
  {
    level: 26,
    wageredAmount: 500000000,
    levelColor: '#c2b3fa',
    levelIcon: 'obsidian',
    title: 'Obsidian',
  },
  {
    level: 27,
    wageredAmount: 1000000000,
    levelColor: '#fed4e3',
    levelIcon: 'iridium',
    title: 'Iridium',
  },
] as const;
