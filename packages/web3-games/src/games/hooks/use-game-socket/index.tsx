'use client';

import { BundlerNetwork } from '@winrlabs/web3';
import React from 'react';

interface GameSocket {
  bundlerWsUrl: string;
  network: BundlerNetwork;
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

const GameSocketContext = React.createContext<GameSocket>({
  bundlerWsUrl: '',
  network: BundlerNetwork.WINR,
  connected: false,
  setConnected: () => null,
});

export const useGameSocketContext = () => {
  return React.useContext(GameSocketContext);
};

export const GameSocketProvider: React.FC<{
  bundlerWsUrl: string;
  network: BundlerNetwork;
  children: React.ReactNode;
  connected: boolean;
  setConnected: (connected: boolean) => void;
}> = ({ bundlerWsUrl, network, children, connected, setConnected }) => {
  return (
    <GameSocketContext.Provider
      value={{
        bundlerWsUrl,
        network,
        connected,
        setConnected,
      }}
    >
      {children}
    </GameSocketContext.Provider>
  );
};
