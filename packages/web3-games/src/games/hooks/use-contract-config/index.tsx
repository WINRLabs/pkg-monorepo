import React from 'react';
import { Config } from 'wagmi';

export interface ContractConfig {
  gameAddresses: GameAddresses;
  controllerAddress: `0x${string}`;
  cashierAddress: `0x${string}`;
  uiOperatorAddress: `0x${string}`;
  rankMiddlewareAddress: `0x${string}`;
}

export interface GameAddresses {
  coinFlip: `0x${string}`;
  plinko: `0x${string}`;
  limbo: `0x${string}`;
  rps: `0x${string}`;
  roll: `0x${string}`;
  dice: `0x${string}`;
  roulette: `0x${string}`;
  baccarat: `0x${string}`;
  keno: `0x${string}`;
  wheel: `0x${string}`;
  winrBonanza: `0x${string}`;
  mines: `0x${string}`;
  videoPoker: `0x${string}`;
  blackjack: `0x${string}`;
  blackjackReader: `0x${string}`;
  horseRace: `0x${string}`;
  crash: `0x${string}`;
  singleBlackjack: `0x${string}`;
  singleBlackjackReader: `0x${string}`;
  holdemPoker: `0x${string}`;
  winrOfOlympus: `0x${string}`;
  princessWinr: `0x${string}`;
}

interface ContractConfigContext extends ContractConfig {
  wagmiConfig: Config;
}

const ContractConfigContext = React.createContext<ContractConfigContext>({
  wagmiConfig: {} as Config,
  gameAddresses: {
    coinFlip: '0x',
    plinko: '0x',
    limbo: '0x',
    rps: '0x',
    roll: '0x',
    dice: '0x',
    roulette: '0x',
    baccarat: '0x',
    keno: '0x',
    wheel: '0x',
    winrBonanza: '0x',
    mines: '0x',
    videoPoker: '0x',
    blackjack: '0x',
    blackjackReader: '0x',
    horseRace: '0x',
    crash: '0x',
    singleBlackjack: '0x',
    singleBlackjackReader: '0x',
    holdemPoker: '0x',
    winrOfOlympus: '0x',
    princessWinr: '0x',
  },
  controllerAddress: '0x',
  cashierAddress: '0x',
  uiOperatorAddress: '0x',
  rankMiddlewareAddress: '0x',
});

export const useContractConfigContext = () => {
  return React.useContext(ContractConfigContext);
};

export const ContractConfigProvider: React.FC<{
  children: React.ReactNode;
  wagmiConfig: Config;
  config: ContractConfig;
}> = ({ children, config, wagmiConfig }) => {
  return (
    <ContractConfigContext.Provider
      value={{
        ...config,
        wagmiConfig: wagmiConfig,
      }}
    >
      {children}
    </ContractConfigContext.Provider>
  );
};
