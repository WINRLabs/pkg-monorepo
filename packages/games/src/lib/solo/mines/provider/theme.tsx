import { createContext, useContext, useState } from 'react';

import { CDN_URL } from '../../../constants';

export interface MinesTheme {
  gemImage: string;
  cellImage: string;
}

const defaultTheme: Partial<MinesTheme> = {
  gemImage: `${CDN_URL}/mines/revealed-gem.png`,
};

const MinesThemeContext = createContext<Partial<MinesTheme>>(defaultTheme);

export const MinesThemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme: Partial<MinesTheme>;
}) => {
  const [currentTheme] = useState<Partial<MinesTheme>>(() => {
    return { ...defaultTheme, ...theme };
  });

  return <MinesThemeContext.Provider value={currentTheme}>{children}</MinesThemeContext.Provider>;
};

export const useMinesTheme = () => {
  const context = useContext(MinesThemeContext);
  if (!context) {
    throw new Error('useMinesTheme must be used within a MinesThemeProvider');
  }
  return context;
};