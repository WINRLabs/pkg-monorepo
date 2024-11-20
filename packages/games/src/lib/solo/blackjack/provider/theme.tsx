import { createContext, useContext, useState } from 'react';

import { CDN_URL } from '../../../constants';

export interface BlackjackTheme {
  deck?: string;
  distributedDeck?: string;
  cardFrontLogo?: string;
  cardBg?: string;
  cardBack?: string;
}

const defaultTheme: Partial<BlackjackTheme> = {
  deck: `${CDN_URL}/blackjack/deck.svg`,
  distributedDeck: `${CDN_URL}/blackjack/distributed-deck.svg`,
  cardFrontLogo: `${CDN_URL}/blackjack/card-front-logo.svg`,
  cardBg: `${CDN_URL}/blackjack/card-bg-black.png`,
  cardBack: `${CDN_URL}/blackjack/card-bg.svg`,
};

const BlackjackThemeContext = createContext<Partial<BlackjackTheme>>(defaultTheme);

export const BlackjackThemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme: Partial<BlackjackTheme>;
}) => {
  const [currentTheme] = useState<Partial<BlackjackTheme>>(() => {
    return { ...defaultTheme, ...theme };
  });

  return (
    <BlackjackThemeContext.Provider value={currentTheme}>{children}</BlackjackThemeContext.Provider>
  );
};

export const useBlackjackTheme = () => {
  const context = useContext(BlackjackThemeContext);
  if (!context) {
    throw new Error('useBlackjackTheme must be used within a BlackjackThemeProvider');
  }
  return context;
};
