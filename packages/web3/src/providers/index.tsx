'use client';

import { Config } from 'wagmi';

import { BundlerClientProvider, BundlerNetwork, BundlerVersion } from '../hooks/use-bundler-client';
import { CurrentAccountProvider } from '../hooks/use-current-address';
import { SmartAccountApiProvider } from '../hooks/use-smart-account-api';
import { ApiContextType, ApiProvider } from './api';
import { Token, TokenProvider } from './token';

export const WinrLabsWeb3Provider = ({
  children,
  smartAccountConfig,
  tokens,
  selectedToken,
  wagmiConfig,
  globalChainId,
  apiConfig,
  bundlerVersion = 'v1',
  onPinNotFound,
}: {
  children: React.ReactNode;
  smartAccountConfig: {
    bundlerUrl: string;
    entryPointAddress: `0x${string}`;
    factoryAddress: `0x${string}`;
    network: BundlerNetwork;
    paymasterAddress: `0x${string}`;
  };
  wagmiConfig?: Config;
  tokens: Token[];
  selectedToken: Token;
  globalChainId?: number;
  apiConfig?: ApiContextType;
  bundlerVersion?: BundlerVersion;
  onPinNotFound?: () => void;
}) => {
  return (
    <ApiProvider config={apiConfig}>
      <BundlerClientProvider
        rpcUrl={smartAccountConfig.bundlerUrl}
        initialNetwork={smartAccountConfig.network}
        globalChainId={globalChainId}
        bundlerVersion={bundlerVersion}
        onPinNotFound={onPinNotFound}
      >
        <SmartAccountApiProvider
          entryPointAddress={smartAccountConfig.entryPointAddress}
          factoryAddress={smartAccountConfig.factoryAddress}
          paymasterAddress={smartAccountConfig.paymasterAddress}
          config={wagmiConfig}
        >
          <TokenProvider tokens={tokens} selectedToken={selectedToken}>
            <CurrentAccountProvider config={wagmiConfig}>{children}</CurrentAccountProvider>
          </TokenProvider>
        </SmartAccountApiProvider>
      </BundlerClientProvider>
    </ApiProvider>
  );
};
