import { GameProvider } from "@winrlabs/games";
import {
  useBalanceStore,
  useCurrentAccount,
  useTokenStore,
} from "@winrlabs/web3";
import { Config } from "wagmi";

import { GameSocketProvider } from "../games/hooks";
import {
  ContractConfig,
  ContractConfigProvider,
} from "../games/hooks/use-contract-config";

type WinrLabsWeb3GamesConfig = {
  wagmiConfig: Config;
  bundlerWsUrl: string;
  contracts: ContractConfig;
};

type WinrLabsWeb3GamesProviderProps = {
  children: React.ReactNode;
  config: WinrLabsWeb3GamesConfig;
};

export const WinrLabsWeb3GamesProvider = ({
  children,
  config,
}: WinrLabsWeb3GamesProviderProps) => {
  const { address } = useCurrentAccount();
  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));

  const { balances } = useBalanceStore();

  return (
    <ContractConfigProvider
      wagmiConfig={config.wagmiConfig}
      config={config.contracts}
    >
      <GameProvider
        options={{
          currency: {
            icon: selectedToken.icon,
            name: selectedToken.symbol,
            symbol: selectedToken.symbol,
          },
          account: {
            isLoggedIn: !!address,
            balance: balances[selectedToken.address] || 0,
          },
        }}
      >
        <GameSocketProvider bundlerWsUrl={config.bundlerWsUrl}>
          {children}
        </GameSocketProvider>
      </GameProvider>
    </ContractConfigProvider>
  );
};
