import React from "react";
import { Config } from "wagmi";

export interface ContractConfig {
  gameAddresses: GameAddresses;
  controllerAddress: `0x${string}`;
  cashierAddress: `0x${string}`;
  uiOperatorAddress: `0x${string}`;
  selectedTokenAddress: `0x${string}`;
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
}

interface ContractConfigContext extends ContractConfig {
  wagmiConfig: Config;
}

const ContractConfigContext = React.createContext<ContractConfigContext>({
  wagmiConfig: {} as Config,
  gameAddresses: {
    coinFlip: "0x",
    plinko: "0x",
    limbo: "0x",
    rps: "0x",
    roll: "0x",
    dice: "0x",
    roulette: "0x",
    baccarat: "0x",
    keno: "0x",
    wheel: "0x",
    winrBonanza: "0x",
  },
  selectedTokenAddress: "0x",
  controllerAddress: "0x",
  cashierAddress: "0x",
  uiOperatorAddress: "0x",
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
