import { createContext, useContext, useState } from 'react';

import { CDN_URL } from '../../../constants';

export interface SingleBlackjackTheme {
  cardFrontLogo?: string;
  cardBg?: string;
  cardBackBg?: string;
  cardDeck?: string;
  cardDeckDistributed?: string;
}

const defaultTheme: Partial<SingleBlackjackTheme> = {
  cardFrontLogo: `${CDN_URL}/blackjack/card-front-logo.svg`,
  cardBg: `${CDN_URL}/blackjack/card-bg-black.png`,
  cardBackBg: `${CDN_URL}/blackjack/card-bg.svg`,
  cardDeck: `${CDN_URL}/blackjack/deck.svg`,
  cardDeckDistributed: `${CDN_URL}/blackjack/distributed-deck.svg`,
};

const SingleBlackjackThemeContext = createContext<Partial<SingleBlackjackTheme>>(defaultTheme);

export const SingleBlackjackThemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme: Partial<SingleBlackjackTheme>;
}) => {
  const [currentTheme] = useState<Partial<SingleBlackjackTheme>>(() => {
    return { ...defaultTheme, ...theme };
  });

  return (
    <SingleBlackjackThemeContext.Provider value={currentTheme}>
      {children}
    </SingleBlackjackThemeContext.Provider>
  );
};

export const useSingleBlackjackTheme = () => {
  const context = useContext(SingleBlackjackThemeContext);
  if (!context) {
    throw new Error('useSingleBlackjackTheme must be used within a SingleBlackjackThemeProvider');
  }
  return context;
};
