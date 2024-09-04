import { createContext, useContext } from 'react';

import { CDN_URL } from '../../../constants';

export interface WheelTheme {
  wheelBackground?: string;
}

const defaultTheme: Partial<WheelTheme> = {
  wheelBackground: `${CDN_URL}/wheel/cursor-wheel.svg`,
};

const WheelThemeContext = createContext<Partial<WheelTheme>>(defaultTheme);

export const WheelThemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme?: Partial<WheelTheme>;
}) => {
  const currentTheme = {
    ...defaultTheme,
    ...theme,
  };

  return <WheelThemeContext.Provider value={currentTheme}>{children}</WheelThemeContext.Provider>;
};

export const useWheelTheme = () => {
  const context = useContext(WheelThemeContext);
  if (!context) {
    throw new Error('useWheelTheme must be used within a WheelThemeProvider');
  }
  return context;
};
