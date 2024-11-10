'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { AudioContextProvider } from '@winrlabs/games';
import { AppUiProviders } from '@winrlabs/ui';
import { BundlerNetwork, WinrLabsWeb3Provider } from '@winrlabs/web3';
import { WinrLabsWeb3GamesProvider } from '@winrlabs/web3-games';
import { Address } from 'viem';
import { config } from './wagmi';
import { allAddresses, appTokens } from '../constants';

const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || '';
const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || '';
const network = BundlerNetwork.WINR;

export const entryPointAddress = allAddresses.entryPoint;
export const factoryAddress = allAddresses.factory;

export const controllerAddress = allAddresses.controller;
export const cashierAddress = allAddresses.cashier;
export const uiOperatorAddress = allAddresses.uiOperator;
export const strategyStoreAddress = allAddresses.strategyStore;

export const rankMiddlewareAddress = allAddresses.rankMiddleware;

export const gameAddresses = {
  coinFlip: allAddresses.coinFlip,
  plinko: allAddresses.plinko,
  limbo: allAddresses.limbo,
  rps: allAddresses.rps,
  roll: allAddresses.roll,
  dice: allAddresses.dice,
  roulette: allAddresses.roulette,
  baccarat: allAddresses.baccarat,
  keno: allAddresses.keno,
  wheel: allAddresses.wheel,
  winrBonanza: allAddresses.winrBonanza,
  mines: allAddresses.mines,
  videoPoker: allAddresses.videoPoker,
  blackjack: allAddresses.blackjack,
  blackjackReader: allAddresses.blackjackReader,
  horseRace: allAddresses.horseRace,
  crash: allAddresses.crash,
  singleBlackjack: allAddresses.singleBlackjack,
  singleBlackjackReader: allAddresses.singleBlackjackReader,
  holdemPoker: allAddresses.holdemPoker,
  winrOfOlympus: allAddresses.winrOfOlympus,
  princessWinr: allAddresses.princessWinr,
  singleWheel: '0x' as Address,
};

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isPreviouslyConnected, setIsPreviouslyConnected] = useState(false);

  useEffect(() => {
    if (!localStorage) return;
    setIsPreviouslyConnected(localStorage['isConnected']);
  }, []);

  return (
    <WagmiProvider reconnectOnMount={isPreviouslyConnected} config={config}>
      <QueryClientProvider client={queryClient}>
        <WinrLabsWeb3Provider
          bundlerVersion="v2"
          // apiConfig={{
          //   baseUrl: 'https://abc.com',
          // }}
          globalChainId={66666666}
          apiConfig={{}}
          smartAccountConfig={{
            bundlerUrl,
            network,
            entryPointAddress,
            factoryAddress,
            paymasterAddress: '0x37C6F569A0d68C8381Eb501b79F501aDc132c144',
          }}
          tokens={appTokens}
          selectedToken={{
            address: '0xaF31A7E835fA24f13ae1e0be8EB1fb56F906BE11',
            bankrollIndex: '0x0000000000000000000000000000000000000001',
            displayDecimals: 2,
            decimals: 6,
            icon: '/images/tokens/usdc.png',
            symbol: 'USDC',
            playable: true,
            priceKey: 'usdc',
          }}
          onPinNotFound={() => {
            console.log('Pin not found');
          }}
        >
          <AppUiProviders wagmiConfig={config}>
            <WinrLabsWeb3GamesProvider
              config={{
                dictionary: {
                  submitBtn: 'Submit',
                  maxPayout: 'Max Reward',
                  betCount: 'Bet Count',
                },
                winAnimationTokenPrefix: '',
                wagmiConfig: config,
                bundlerWsUrl,
                network,
                contracts: {
                  gameAddresses,
                  controllerAddress,
                  cashierAddress,
                  uiOperatorAddress,
                  rankMiddlewareAddress,
                  strategyStoreAddress,
                },
              }}
            >
              <AudioContextProvider>{props.children}</AudioContextProvider>
            </WinrLabsWeb3GamesProvider>
          </AppUiProviders>
        </WinrLabsWeb3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
