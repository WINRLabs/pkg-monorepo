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

const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || '';
const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || '';
const network = 'SONIC';

export const entryPointAddress = process.env.NEXT_PUBLIC_ENTRYPOINT_ADDRESS as Address;
export const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address;

export const controllerAddress = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS as Address;
export const cashierAddress = process.env.NEXT_PUBLIC_CASHIER_ADDRESS as Address;
export const uiOperatorAddress = process.env.NEXT_PUBLIC_UI_OPERATOR_ADDRESS as Address;
export const strategyStoreAddress = process.env.NEXT_PUBLIC_STRATEGY_STORE_ADDRESS as Address;

export const rankMiddlewareAddress = process.env.NEXT_PUBLIC_RANK_MIDDLEWARE_ADDRESS as Address;

export const gameAddresses = {
  coinFlip: process.env.NEXT_PUBLIC_COIN_FLIP_ADDRESS as Address,
  plinko: process.env.NEXT_PUBLIC_PLINKO_ADDRESS as Address,
  limbo: process.env.NEXT_PUBLIC_LIMBO_ADDRESS as Address,
  rps: process.env.NEXT_PUBLIC_RPS_ADDRESS as Address,
  roll: process.env.NEXT_PUBLIC_ROLL_ADDRESS as Address,
  dice: process.env.NEXT_PUBLIC_DICE_ADDRESS as Address,
  roulette: process.env.NEXT_PUBLIC_ROULETTE_ADDRESS as Address,
  baccarat: process.env.NEXT_PUBLIC_BACCARAT_ADDRESS as Address,
  keno: process.env.NEXT_PUBLIC_KENO_ADDRESS as Address,
  wheel: process.env.NEXT_PUBLIC_WHEEL_ADDRESS as Address,
  winrBonanza: process.env.NEXT_PUBLIC_WINR_BONANZA_ADDRESS as Address,
  mines: process.env.NEXT_PUBLIC_MINES_ADDRESS as Address,
  videoPoker: process.env.NEXT_PUBLIC_VIDEO_POKER_ADDRESS as Address,
  blackjack: process.env.NEXT_PUBLIC_BLACKJACK_ADDRESS as Address,
  blackjackReader: process.env.NEXT_PUBLIC_BLACKJACK_READER_ADDRESS as Address,
  horseRace: process.env.NEXT_PUBLIC_HORSE_RACE_ADDRESS as Address,
  crash: process.env.NEXT_PUBLIC_CRASH_ADDRESS as Address,
  singleBlackjack: process.env.NEXT_PUBLIC_SINGLE_BLACKJACK_ADDRESS as Address,
  singleBlackjackReader: process.env.NEXT_PUBLIC_SINGLE_BLACKJACK_READER_ADDRESS as Address,
  holdemPoker: process.env.NEXT_PUBLIC_HOLDEM_POKER_ADDRESS as Address,
  winrOfOlympus: process.env.NEXT_PUBLIC_WINR_OF_OLYMPUS_ADDRESS as Address,
  princessWinr: process.env.NEXT_PUBLIC_PRINCESS_WINR_ADDRESS as Address,
  singleWheel: process.env.NEXT_PUBLIC_SINGLE_WHEEL_ADDRESS as Address,
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
          // apiConfig={{
          //   baseUrl: 'https://abc.com',
          // }}
          smartAccountConfig={{
            bundlerUrl,
            network,
            entryPointAddress,
            factoryAddress,
            paymasterAddress: '0xAC0C412F56cd00ea21D96eB6768675B430A50FE8',
          }}
          tokens={[
            {
              address: '0x4Cc7b0ddCD0597496E57C5325cf4c73dBA30cdc9',
              bankrollIndex: '0x0000000000000000000000000000000000000002',
              displayDecimals: 2,
              decimals: 18,
              icon: '/tokens/gold-coin.svg',
              symbol: 'TOKEN',
              playable: true,
              pairToken: 'TOKEN-LP',
              priceKey: 'usdc',
            },
          ]}
          selectedToken={{
            address: '0x4Cc7b0ddCD0597496E57C5325cf4c73dBA30cdc9',
            bankrollIndex: '0x0000000000000000000000000000000000000002',
            displayDecimals: 2,
            decimals: 18,
            icon: '/tokens/gold-coin.svg',
            symbol: 'TOKEN',
            playable: true,
            pairToken: 'TOKEN-LP',
            priceKey: 'usdc',
          }}
          globalChainId={64165}
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
