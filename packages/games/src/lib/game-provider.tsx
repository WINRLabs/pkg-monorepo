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

interface GameContextProps {
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
});

export const GameProvider = ({ children, options, readyToPlay }: GameProviderProps) => {
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
