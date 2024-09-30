import { createContext, useContext } from 'react';

import { CDN_URL } from '../../../constants';

export interface WheelTheme {
  wheelBackground?: string;
  hideWager?: boolean;
  tokenPrefix?: string;
  cursorBackground?: string;
  controllerHeader?: React.ReactNode;
  hideMaxPayout?: boolean;
  controllerFooter?: React.ReactNode;
}

const defaultTheme: Partial<WheelTheme> = {
  wheelBackground: `${CDN_URL}/wheel/circle.svg`,
  cursorBackground: `${CDN_URL}/wheel/cursor-wheel.svg`,
  hideWager: false,
  hideMaxPayout: false,
  tokenPrefix: '$',
  controllerHeader: null,
  controllerFooter: null,
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
