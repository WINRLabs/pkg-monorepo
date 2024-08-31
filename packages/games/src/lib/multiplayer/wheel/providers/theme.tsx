import { createContext, useContext } from 'react';

import { CDN_URL } from '../../../constants';

export interface WheelTeme {
  wheelBackground: string;
}

const defaultTheme: Partial<WheelTeme> = {
  wheelBackground: `${CDN_URL}/wheel/cursor-wheel.svg`,
};

const WheelTemeContext = createContext<Partial<WheelTeme>>(defaultTheme);

export const WheelTemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme: Partial<WheelTeme>;
}) => {
  const currentTheme = {
    ...defaultTheme,
    ...theme,
  };

  return <WheelTemeContext.Provider value={currentTheme}>{children}</WheelTemeContext.Provider>;
};

export const useWheelTeme = () => {
  const context = useContext(WheelTemeContext);
  if (!context) {
    throw new Error('useWheelTeme must be used within a WheelTemeProvider');
  }
  return context;
};
