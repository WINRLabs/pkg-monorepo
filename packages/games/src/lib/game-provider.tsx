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
    submitBtnText?: string;
  };
}

interface GameProviderProps extends GameContextProps {
  children: React.ReactNode;
}

const GameContext = createContext<
  GameContextProps & {
    isAnimationSkipped: boolean;
    updateSkipAnimation: (b: boolean) => void;
  }
>({
  options: {
    submitBtnText: 'Bet',
    currency: {
      icon: '',
      name: '',
      symbol: '',
    },
  },
  isAnimationSkipped: false,
  updateSkipAnimation: () => null,
});

export const GameProvider = ({ children, options }: GameProviderProps) => {
  const [isAnimationSkipped, setIsAnimationSkipped] = React.useState<boolean>(false);

  return (
    <GameContext.Provider
      value={{
        options: {
          ...options,
          submitBtnText: options.submitBtnText || 'Bet',
        },
        updateSkipAnimation: setIsAnimationSkipped,
        isAnimationSkipped,
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
