/**
 * Generated by @openapi-codegen
 *
 * @version 2.0
 */
export type PriceResponse = {
  token: string;
  price: number;
};

export type PaginatedResonse = {
  totalCount: number;
  totalPages: number;
  limit: number;
  currentPage: number;
  /**
   * @default false
   */
  hasMore: boolean;
};

export type GameResultDto = {
  id: string;
  game:
    | 'COINFLIP'
    | 'RANGE'
    | 'WHEEL'
    | 'PLINKO'
    | 'MOON'
    | 'LOTTERY'
    | 'RPS'
    | 'DICE'
    | 'LIMBO'
    | 'SLOT'
    | 'ROULETTE'
    | 'MINES'
    | 'VIDEO_POKER'
    | 'KENO'
    | 'BACCARAT'
    | 'HORSE_RACE'
    | 'BLACKJACK'
    | 'HOLDEM_POKER'
    | 'WINR_BONANZA'
    | 'ONE_HAND_BLACKJACK';
  /**
   * @default 0
   */
  wager: number;
  /**
   * @default 0
   */
  wagerInDollar: number;
  /**
   * @default 0
   */
  playedGameCount: number;
  /**
   * @default 0
   */
  multiplier: number;
  /**
   * @default 0
   */
  profit: number;
  /**
   * @default 0
   */
  profitInDollar: number;
  /**
   * @default 0
   */
  payout: number;
  /**
   * @default 0
   */
  payoutInDollar: number;
  /**
   * @default 0
   */
  loss: number;
  /**
   * @default 0
   */
  lossInDollar: number;
  won: boolean;
  player: string;
  requestId: number;
  token: string;
  amountOut: number;
  username: string;
  time: number;
  /**
   * @default null
   */
  hash?: string | null;
  level: number;
  createdAt: number;
};

export type ChartObject = {
  x?: string | null;
  y?: number | null;
};

export type TransactionResponse = {
  success: boolean;
  message: string;
};

export type AssignUsernameInput = {
  username: string;
  walletAddress: string;
  signature: string;
  avatar?: number | null;
  isAA: boolean;
};

export type UsernameObject = {
  username?: string | null;
  activeSince?: number | null;
  avatar?: number | null;
  level?: number;
};

export type MultiplayerGameHistoryObject = {
  /**
   * @default 0
   */
  result: number;
};

export type LiveWinsDto = {
  game:
    | 'COINFLIP'
    | 'RANGE'
    | 'WHEEL'
    | 'PLINKO'
    | 'MOON'
    | 'LOTTERY'
    | 'RPS'
    | 'DICE'
    | 'LIMBO'
    | 'SLOT'
    | 'ROULETTE'
    | 'MINES'
    | 'VIDEO_POKER'
    | 'KENO'
    | 'BACCARAT'
    | 'HORSE_RACE'
    | 'BLACKJACK'
    | 'HOLDEM_POKER'
    | 'WINR_BONANZA'
    | 'ONE_HAND_BLACKJACK';
  player: string;
  username: string | null;
  id: string;
  level: number;
  /**
   * @default 0
   */
  profitInDollar: number;
};

export type BigWinsDto = {
  game:
    | 'COINFLIP'
    | 'RANGE'
    | 'WHEEL'
    | 'PLINKO'
    | 'MOON'
    | 'LOTTERY'
    | 'RPS'
    | 'DICE'
    | 'LIMBO'
    | 'SLOT'
    | 'ROULETTE'
    | 'MINES'
    | 'VIDEO_POKER'
    | 'KENO'
    | 'BACCARAT'
    | 'HORSE_RACE'
    | 'BLACKJACK'
    | 'HOLDEM_POKER'
    | 'WINR_BONANZA'
    | 'ONE_HAND_BLACKJACK';
  player: string;
  username: string | null;
  id: string;
  level: number;
  /**
   * @default 0
   */
  profitInDollar: number;
};

export type LuckyWinsDto = {
  game:
    | 'COINFLIP'
    | 'RANGE'
    | 'WHEEL'
    | 'PLINKO'
    | 'MOON'
    | 'LOTTERY'
    | 'RPS'
    | 'DICE'
    | 'LIMBO'
    | 'SLOT'
    | 'ROULETTE'
    | 'MINES'
    | 'VIDEO_POKER'
    | 'KENO'
    | 'BACCARAT'
    | 'HORSE_RACE'
    | 'BLACKJACK'
    | 'HOLDEM_POKER'
    | 'WINR_BONANZA'
    | 'ONE_HAND_BLACKJACK';
  player: string;
  username: string | null;
  id: string;
  level: number;
  /**
   * @default 0
   */
  multiplier: number;
};

export type PlayerRankObject = {
  /**
   * @default 0
   */
  rank: number;
  /**
   * @default 0
   */
  totalWon: number;
  /**
   * @default 0
   */
  bets: number;
  /**
   * @default 0
   */
  winRate: number;
  /**
   * @default 0
   */
  volume: number;
  /**
   * @default
   */
  player: string;
  /**
   * @default
   */
  username: string | null;
  /**
   * @default 0
   */
  refPlayerCount: number;
};

export type WagerInfoResponse = {
  minWager: number;
  maxWager: number;
  multiplier: number;
};

export type JustBetStats = {
  profitShared: number;
  totalVolume: number;
  gameCount: number;
  bankrollProfit: number;
  playerCount: number;
};

export type MiningStatistics = {
  /**
   * @default 0
   */
  totalBurned: number;
  /**
   * @default 0
   */
  totalStaked: number;
  /**
   * @default 0
   */
  totalStakedVWINR: number;
  /**
   * @default 0
   */
  totalSupply: number;
  /**
   * @default 0
   */
  circSupply: number;
  /**
   * @default 0
   */
  maxSupply: number;
};

export type DashboardStats = {
  winrPrice: string;
  winrChange: string;
  winrVolume: string;
  tvl: string;
  holdersUSD: string;
};

export type LeaderboardVolumeObject = {
  rank: number;
  username: string;
  player: string;
  won: number;
  bet: number;
  winRate: number;
  volume: number;
  level: number;
};

export type LeaderboardVolumeResponse = {
  leaderboard: LeaderboardVolumeObject[];
  playerStats: LeaderboardVolumeObject;
};

export type LeaderboardProfitObject = {
  rank: number;
  username: string;
  player: string;
  won: number;
  bet: number;
  winRate: number;
  profit: number;
  level: number;
};

export type LeaderboardProfitResponse = {
  leaderboard: LeaderboardProfitObject[];
  playerStats: LeaderboardProfitObject;
};

export type LeaderboardLuckyWinnerObject = {
  username: string;
  player: string;
  profit: number;
  multiplier: number;
  level: number;
  game:
    | 'COINFLIP'
    | 'RANGE'
    | 'WHEEL'
    | 'PLINKO'
    | 'MOON'
    | 'LOTTERY'
    | 'RPS'
    | 'DICE'
    | 'LIMBO'
    | 'SLOT'
    | 'ROULETTE'
    | 'MINES'
    | 'VIDEO_POKER'
    | 'KENO'
    | 'BACCARAT'
    | 'HORSE_RACE'
    | 'BLACKJACK'
    | 'HOLDEM_POKER'
    | 'WINR_BONANZA'
    | 'ONE_HAND_BLACKJACK'
    | 'WINR_OF_OLYMPUS';
};

export type LeaderboardBigWinsObject = {
  username: string;
  player: string;
  profit: number;
  multiplier: number;
  game:
    | 'COINFLIP'
    | 'RANGE'
    | 'WHEEL'
    | 'PLINKO'
    | 'MOON'
    | 'LOTTERY'
    | 'RPS'
    | 'DICE'
    | 'LIMBO'
    | 'SLOT'
    | 'ROULETTE'
    | 'MINES'
    | 'VIDEO_POKER'
    | 'KENO'
    | 'BACCARAT'
    | 'HORSE_RACE'
    | 'BLACKJACK'
    | 'HOLDEM_POKER'
    | 'WINR_BONANZA'
    | 'ONE_HAND_BLACKJACK';
  level: number;
};

export type LeaderboardLossLegendsObject = {
  rank: number;
  username: string;
  player: string;
  bet: number;
  winRate: number;
  volume: number;
  profit: number;
  level: number;
};

export type LeaderboardLossLegendsResponse = {
  leaderboard: LeaderboardLossLegendsObject[];
  playerStats: LeaderboardLossLegendsObject;
};

export type VaultOutput = {
  bankrollTokenAddress: string;
  liquidityManagerAddress: string;
  shareTokenAddress: string;
  vaultAddress: string;
  price: number;
  lpPrice: number;
  wallet: number;
  poolSupply: number;
  weeklyProfit: number;
  allTimeProfit: number;
  apr: number;
};

export type VaultDetailOutput = {
  vaultIndex: string;
  bankrollBytesIdentifier: string;
  vaultAddress: string;
  bankrollTokenAddress: string;
  shareTokenAddress: string;
  controllerAddress: string;
  liquidityManagerAddress: string;
};

export type VaultAmountOutput = {
  bankrollAmount: string;
  shareTokenAmount: string;
  epochAmount: string;
  totalAmount: string;
  bankrollTokenPrice: string;
  isProfitEpcoh: number;
  isProfitTotal: number;
};

export type PoolOutput = {
  detail: VaultDetailOutput;
  amount: VaultAmountOutput;
};

export type ReferralRewardEntity = {
  /**
   * UUIDv4
   */
  id: string;
  createdAt: number;
};

export type ReferralClaimEntity = {
  /**
   * UUIDv4
   */
  id: string;
  createdAt: number;
};

export type CodesVolumeAndReward = {
  code: string;
  totalVolume: number;
  totalReward: number;
};

export type AwardBadge = {
  type?:
    | 'LuckyWinner'
    | 'BettingBuddy'
    | 'BankrollBooster'
    | 'StakingStar'
    | 'VolumeUp'
    | 'StakingTycoon'
    | 'ReferralBadge'
    | 'BetVeteran'
    | 'BankrollHyperBooster'
    | 'BettingTitan'
    | 'LuckyStriker'
    | 'WeeklyClaimer'
    | 'LossLegend'
    | 'WinrChainKingpin'
    | 'BankrollCashCow'
    | 'StakingSage'
    | 'JackpotJamboree'
    | 'VolumeWinner'
    | 'LuckyStreak'
    | 'GamblingGuru'
    | 'DailyStreak'
    | 'WinrChainer'
    | 'HighRoller'
    | 'LuckyRoller';
  /**
   * The player address to award the badge to
   *
   * @example 0x1234567890123456789012345678901234567890
   */
  player: string | null;
};

export type AwardBadgeResponse = {
  awarded: boolean;
  player?: string;
  badge?:
    | 'LuckyWinner'
    | 'BettingBuddy'
    | 'BankrollBooster'
    | 'StakingStar'
    | 'VolumeUp'
    | 'StakingTycoon'
    | 'ReferralBadge'
    | 'BetVeteran'
    | 'BankrollHyperBooster'
    | 'BettingTitan'
    | 'LuckyStriker'
    | 'WeeklyClaimer'
    | 'LossLegend'
    | 'WinrChainKingpin'
    | 'BankrollCashCow'
    | 'StakingSage'
    | 'JackpotJamboree'
    | 'VolumeWinner'
    | 'LuckyStreak'
    | 'GamblingGuru'
    | 'DailyStreak'
    | 'WinrChainer'
    | 'HighRoller'
    | 'LuckyRoller';
};

export type WeeklyClaimer = {
  /**
   * The player address
   *
   * @example 0x1234567890123456789012345678901234567890
   */
  player: string;
  /**
   * The bankroll addresses which are claimed by the player
   *
   * @example [0x1234567890123456789012345678901234567890, 0x1234567890123456789012345678901234567890]
   */
  bankrolls: string[];
};

export type BadgeResponse = {
  awarded: boolean;
  player?: string;
  badge?:
    | 'LuckyWinner'
    | 'BettingBuddy'
    | 'BankrollBooster'
    | 'StakingStar'
    | 'VolumeUp'
    | 'StakingTycoon'
    | 'ReferralBadge'
    | 'BetVeteran'
    | 'BankrollHyperBooster'
    | 'BettingTitan'
    | 'LuckyStriker'
    | 'WeeklyClaimer'
    | 'LossLegend'
    | 'WinrChainKingpin'
    | 'BankrollCashCow'
    | 'StakingSage'
    | 'JackpotJamboree'
    | 'VolumeWinner'
    | 'LuckyStreak'
    | 'GamblingGuru'
    | 'DailyStreak'
    | 'WinrChainer'
    | 'HighRoller'
    | 'LuckyRoller';
};

export type NewPlayers = {
  count: number;
};

export type TopPlayersByVolume = {
  rank: number;
  reward: number;
  username: string;
  address: string;
};

export type TopPlayersByBet = {
  rank: number;
  reward: number;
  username: string;
  address: string;
};

export type HighRollerPlayers = {
  rank: number;
  reward: number;
  username: string;
  address: string;
};

export type BadLuckPlayers = {
  rank: number;
  reward: number;
  username: string;
  address: string;
};

export type LotteryWinners = {
  username: string;
  address: string;
};

export type PlayerEpochStats = {
  loss: string;
  profit: string;
  volume: string;
};

export type RewardSummary = {
  newPlayers: NewPlayers;
  topPlayersByVolume: TopPlayersByVolume[];
  topPlayersByBet: TopPlayersByBet[];
  highRollerPlayers: HighRollerPlayers[];
  badLuckPlayers: BadLuckPlayers[];
  lotteryWinners: LotteryWinners[];
  playerEpochStat: PlayerEpochStats;
};

export type SummaryResponse = {
  apr: number;
  totalEarnings: number;
  totalWINRLocked: number;
  totalvWINRLocked: number;
};

export type TakeLevelupSnapshotInput = {
  player: string;
};

export type BridgeHistoryResponse = {
  player: string;
  amount: string;
  status: string;
};
