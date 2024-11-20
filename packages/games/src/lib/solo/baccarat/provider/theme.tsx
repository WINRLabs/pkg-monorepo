import { createContext, useContext, useState } from 'react';

import { CDN_URL } from '../../../constants';

export interface BaccaratTheme {
  backgroundImage?: string;
  tieBackgroundImage?: string;
  bankerBackgroundImage?: string;
  playerBackgroundImage?: string;
  centerCircleBackgroundImage?: string;
  betAreaBackgroundImage?: string;
  cardBackImage?: string;
  cardFrontLogoImage?: string;
  idleCardImage?: string;
}

const defaultTheme: Partial<BaccaratTheme> = {
  backgroundImage: `${CDN_URL}/baccarat/baccarat-bg.png`,
  tieBackgroundImage: `${CDN_URL}/baccarat/table-effect.png`,
  bankerBackgroundImage: `${CDN_URL}/baccarat/table-effect.png`,
  playerBackgroundImage: `${CDN_URL}/baccarat/table-effect.png`,
  centerCircleBackgroundImage: `${CDN_URL}/baccarat/table-effect.png`,
  cardBackImage: `${CDN_URL}/baccarat/jb-card-bg.svg`,
  cardFrontLogoImage: `${CDN_URL}/baccarat/card-front-logo.svg`,
  idleCardImage: `${CDN_URL}/baccarat/stack.svg`,
};

const BaccaratThemeContext = createContext<Partial<BaccaratTheme>>(defaultTheme);

export const BaccaratThemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme: Partial<BaccaratTheme>;
}) => {
  const [currentTheme] = useState<Partial<BaccaratTheme>>(() => {
    return { ...defaultTheme, ...theme };
  });

  return (
    <BaccaratThemeContext.Provider value={currentTheme}>{children}</BaccaratThemeContext.Provider>
  );
};

export const useBaccaratTheme = () => {
  const context = useContext(BaccaratThemeContext);
  if (!context) {
    throw new Error('useBaccaratTheme must be used within a BaccaratThemeProvider');
  }
  return context;
};
