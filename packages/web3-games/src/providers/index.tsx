import { GameDictionary, GameProvider } from '@winrlabs/games';
import {
  BundlerNetwork,
  useBalanceStore,
  useCurrentAccount,
  usePriceFeed,
  useTokenStore,
} from '@winrlabs/web3';
import { useState } from 'react';
import { Config } from 'wagmi';

import { GameSocketProvider, GameStrategyProvider } from '../games/hooks';
import { ContractConfig, ContractConfigProvider } from '../games/hooks/use-contract-config';

type WinrLabsWeb3GamesConfig = {
  wagmiConfig: Config;
  bundlerWsUrl: string;
  network: BundlerNetwork;
  contracts: ContractConfig;
  forceRefund?: boolean;
  dictionary?: GameDictionary;
  winAnimationTokenPrefix?: string;
};

type WinrLabsWeb3GamesProviderProps = {
  children: React.ReactNode;
  config: WinrLabsWeb3GamesConfig;
};

export const WinrLabsWeb3GamesProvider = ({ children, config }: WinrLabsWeb3GamesProviderProps) => {
  const { address } = useCurrentAccount();
  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));

  const { balances } = useBalanceStore();
  const { getTokenPrice } = usePriceFeed();

  const balance = balances[selectedToken.address] || 0;
  const balanceAsDollar = balance * getTokenPrice(selectedToken.priceKey);
  const [connected, setConnected] = useState(false);

  return (
    <ContractConfigProvider wagmiConfig={config.wagmiConfig} config={config.contracts}>
      <GameProvider
        options={{
          dictionary: config?.dictionary || {},
          forceRefund: config?.forceRefund,
          winAnimationTokenPrefix: config?.winAnimationTokenPrefix,
          currency: {
            icon: selectedToken.icon,
            name: selectedToken.symbol,
            symbol: selectedToken.symbol,
          },
          account: {
            address: address,
            isLoggedIn: !!address,
            balance,
            balanceAsDollar,
          },
        }}
        readyToPlay={connected}
      >
        <GameStrategyProvider>
          <GameSocketProvider
            network={config.network}
            bundlerWsUrl={config.bundlerWsUrl}
            connected={connected}
            setConnected={setConnected}
          >
            {children}
          </GameSocketProvider>
        </GameStrategyProvider>
      </GameProvider>
    </ContractConfigProvider>
  );
};
