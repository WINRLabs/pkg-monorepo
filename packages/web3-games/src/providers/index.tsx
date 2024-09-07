import { GameProvider } from '@winrlabs/games';
import {
  BundlerNetwork,
  useBalanceStore,
  useCurrentAccount,
  usePriceFeed,
  useTokenStore,
} from '@winrlabs/web3';
import { Config } from 'wagmi';

import { GameSocketProvider } from '../games/hooks';
import { ContractConfig, ContractConfigProvider } from '../games/hooks/use-contract-config';

type WinrLabsWeb3GamesConfig = {
  wagmiConfig: Config;
  bundlerWsUrl: string;
  network: BundlerNetwork;
  contracts: ContractConfig;
  submitBtnText?: string;
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
  const { priceFeed } = usePriceFeed();

  const balance = balances[selectedToken.address] || 0;
  const balanceAsDollar = balance * priceFeed[selectedToken.priceKey];

  return (
    <ContractConfigProvider wagmiConfig={config.wagmiConfig} config={config.contracts}>
      <GameProvider
        options={{
          submitBtnText: config?.submitBtnText,
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
      >
        <GameSocketProvider network={config.network} bundlerWsUrl={config.bundlerWsUrl}>
          {children}
        </GameSocketProvider>
      </GameProvider>
    </ContractConfigProvider>
  );
};
