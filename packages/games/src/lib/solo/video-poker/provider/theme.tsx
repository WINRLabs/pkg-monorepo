import { createContext, useContext, useState } from 'react';

import { CDN_URL } from '../../../constants';

export interface VideoPokerTheme {
  cardStackImage?: string;
  cardFrontLogo?: string;
}

const defaultTheme: Partial<VideoPokerTheme> = {
  cardStackImage: `${CDN_URL}/video-poker/card-stack.png`,
  cardFrontLogo: `${CDN_URL}/baccarat/card-front-logo.svg`,
};

const VideoPokerThemeContext = createContext<Partial<VideoPokerTheme>>(defaultTheme);

export const VideoPokerThemeProvider = ({
  children,
  theme = {},
}: {
  children: React.ReactNode;
  theme: Partial<VideoPokerTheme>;
}) => {
  const [currentTheme] = useState<Partial<VideoPokerTheme>>(() => {
    return { ...defaultTheme, ...theme };
  });

  return (
    <VideoPokerThemeContext.Provider value={currentTheme}>
      {children}
    </VideoPokerThemeContext.Provider>
  );
};

export const useVideoPokerTheme = () => {
  const context = useContext(VideoPokerThemeContext);
  if (!context) {
    throw new Error('useVideoPokerTheme must be used within a VideoPokerThemeProvider');
  }
  return context;
};
