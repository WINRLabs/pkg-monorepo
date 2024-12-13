'use client';

import React, { createContext, useContext } from 'react';

interface Currency {
  icon: string;
  name: string;
  symbol: string;
}

interface Account {
  isLoggedIn?: boolean;
  address?: `0x${string}`;
  balance: number;
  balanceAsDollar: number;
}

interface Defaults {
  minWager: number;
  maxWager: number;
  maxBet: number;
}

export interface GameDictionary {
  submitBtn?: string;
  maxPayout?: string;
  betToStart?: string;
  betToStartDescription?: string;
  betCount?: string;
  gems?: string;
}

export enum Badge {
  LuckyWinner = 'LuckyWinner',
  BettingBuddy = 'BettingBuddy',
  BankrollBooster = 'BankrollBooster',
  StakingStar = 'StakingStar',
  VolumeUp = 'VolumeUp',
  StakingTycoon = 'StakingTycoon',
  ReferralBadge = 'ReferralBadge',
  BetVeteran = 'BetVeteran',
  BankrollHyperBooster = 'BankrollHyperBooster',
  BettingTitan = 'BettingTitan',
  LuckyStriker = 'LuckyStriker',
  WeeklyClaimer = 'WeeklyClaimer',
  LossLegend = 'LossLegend',
  WinrChainKingpin = 'WinrChainKingpin',
  BankrollCashCow = 'BankrollCashCow',
  StakingSage = 'StakingSage',
  JackpotJamboree = 'JackpotJamboree',
  VolumeWinner = 'VolumeWinner',
  LuckyStreak = 'LuckyStreak',
  GamblingGuru = 'GamblingGuru',
  DailyStreak = 'DailyStreak',
  WinrChainer = 'WinrChainer',
  HighRoller = 'HighRoller',
  LuckyRoller = 'LuckyRoller',
}

export interface GameContextProps {
  options: {
    /**
     * Selected currency for the games
     */
    currency: Currency;
    /**
     * Account details
     */
    account?: Account;
    /**
     * Default values for the games
     */
    defaults?: Defaults;

    /**
     * Button text for the games
     */

    /**
     * Dictionary for the game texts
     *
     */
    dictionary?: GameDictionary;

    /**
     * Disable refund popup and force refund the game
     */
    forceRefund?: boolean;

    /**
     * Token for the game
     *
     * @default '$'
     */
    winAnimationTokenPrefix?: string;
  };
  readyToPlay: boolean;
  /**
   * Callback when user levels up
   */
  onLevelUp?: () => Promise<void>;

  /**
   * Handles the retrieval of badges based on the provided parameters.
   *
   * @param params - The parameters for retrieving badges.
   * @param params.totalWager - The total amount wagered by the player.
   * @param params.totalPayout - The total payout received by the player.
   * @param params.onPlayerStatusUpdate - Callback function to update the player's status.
   * @returns A promise that resolves when the badges have been retrieved.
   */
  handleGetBadges?: (params: {
    totalWager: number;
    totalPayout: number;
    onPlayerStatusUpdate?: (d: {
      type: 'levelUp' | 'badgeUp';
      awardBadges: Badge[] | undefined;
      level: number | undefined;
    }) => void;
  }) => Promise<void>;
}

interface GameProviderProps extends GameContextProps {
  children: React.ReactNode;
}

const defaultDictionary: GameDictionary = {
  submitBtn: 'Bet',
  maxPayout: 'Max Payout',
  betToStart: 'Bet to Start',
  betToStartDescription: 'The game will start after someone places a bet',
  betCount: 'Bet Count',
  gems: 'GEMS',
};

const GameContext = createContext<
  GameContextProps & {
    isAnimationSkipped: boolean;
    updateSkipAnimation: (b: boolean) => void;
    options: GameContextProps['options'] & {
      dictionary: GameDictionary;
    };
    readyToPlay: boolean;
  }
>({
  options: {
    dictionary: defaultDictionary,
    currency: {
      icon: '',
      name: '',
      symbol: '',
    },
    forceRefund: false,
    winAnimationTokenPrefix: '$',
  },
  readyToPlay: false,
  isAnimationSkipped: false,
  updateSkipAnimation: () => null,
  onLevelUp: () => Promise.resolve(),
  handleGetBadges: async () => {},
});

export const GameProvider = ({
  children,
  options,
  readyToPlay,
  onLevelUp,
  handleGetBadges,
}: GameProviderProps) => {
  const [isAnimationSkipped, setIsAnimationSkipped] = React.useState<boolean>(false);

  return (
    <GameContext.Provider
      value={{
        options: {
          ...options,
          forceRefund: options.forceRefund,
          winAnimationTokenPrefix:
            typeof options.winAnimationTokenPrefix === 'string'
              ? options.winAnimationTokenPrefix
              : '$',
          dictionary: {
            ...defaultDictionary,
            ...options.dictionary,
          },
        },
        updateSkipAnimation: setIsAnimationSkipped,
        isAnimationSkipped,
        readyToPlay,
        onLevelUp,
        handleGetBadges,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};

export const useGameOptions = () => {
  return useGame().options;
};

export const useGameSkip = () => {
  return {
    isAnimationSkipped: useGame().isAnimationSkipped,
    updateSkipAnimation: useGame().updateSkipAnimation,
  };
};
