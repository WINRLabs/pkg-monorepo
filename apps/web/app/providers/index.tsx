'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { AudioContextProvider } from '@winrlabs/games';
import { AppUiProviders } from '@winrlabs/ui';
import { BundlerNetwork, useCurrentAccount } from '@winrlabs/web3';
import { WinrLabsWeb3GamesProvider } from '@winrlabs/web3-games';
import { Address } from 'viem';
import { config } from '../wagmi';
import { allAddresses } from '../../constants';
import { WinrLabsWeb3Providers } from './winrlabs-web3';
import { baseUrl, useRankControllerTakeLevelupSnapshot } from '@winrlabs/api';

const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || '';
const network = BundlerNetwork.WINR;

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
  winrOfOlympus1000: allAddresses.winrOfOlympus1000,
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

  const currentAccount = useCurrentAccount();

  const playerLevelUp = useRankControllerTakeLevelupSnapshot({});

  const handlePlayerLevelUp = async () => {
    (await playerLevelUp.mutateAsync({
      body: {
        player: currentAccount.address || '0x',
      },
      baseUrl: baseUrl,
    })) as any;
  };

  return (
    <WagmiProvider reconnectOnMount={isPreviouslyConnected} config={config}>
      <QueryClientProvider client={queryClient}>
        <WinrLabsWeb3Providers>
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
              onLevelUp={async () => {
                await handlePlayerLevelUp();
              }}
            >
              <AudioContextProvider>{props.children}</AudioContextProvider>
            </WinrLabsWeb3GamesProvider>
          </AppUiProviders>
        </WinrLabsWeb3Providers>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
