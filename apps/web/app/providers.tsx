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
const network = BundlerNetwork.WINR;

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
            paymasterAddress: '0x37C6F569A0d68C8381Eb501b79F501aDc132c144',
          }}
          tokens={[
            {
              address: '0x59edbB343991D30f77dcdBad94003777e9B09BA9',
              bankrollIndex: '0x0000000000000000000000000000000000000001',
              displayDecimals: 2,
              decimals: 6,
              icon: '/tokens/usdc.png',
              symbol: 'USDC',
              playable: true,
              priceKey: 'usdc',
            },
            {
              address: '0x0381132632E9E27A8f37F1bc56bd5a62d21a382B',
              bankrollIndex: '0x0000000000000000000000000000000000000002',
              displayDecimals: 2,
              decimals: 6,
              icon: '/tokens/usdt.png',
              symbol: 'USDT',
              playable: true,
              priceKey: 'usdt',
            },
            {
              address: '0x44BD533C211C78e01f0F738826e8b18Bb9b936f5',
              bankrollIndex: '0x0000000000000000000000000000000000000003',
              displayDecimals: 6,
              decimals: 8,
              icon: '/tokens/wbtc.png',
              symbol: 'BTC',
              playable: true,
              priceKey: 'btc',
            },
            {
              address: '0xE60256921AE414D7B35d6e881e47931f45E027cf',
              bankrollIndex: '0x0000000000000000000000000000000000000004',
              displayDecimals: 6,
              decimals: 18,
              icon: '/tokens/weth.png',
              symbol: 'ETH',
              playable: true,
              priceKey: 'weth',
            },
            {
              address: '0xBF6FA9d2BF9f681E7b6521b49Cf8ecCF9ad8d31d',
              bankrollIndex: '0x0000000000000000000000000000000000000006',
              displayDecimals: 2,
              decimals: 18,
              icon: '/tokens/winr.png',
              symbol: 'WINR',
              playable: true,
              priceKey: 'winr',
            },
            {
              address: '0x372B5997502E668B8804D11d1569eB28F51a7e4e',
              bankrollIndex: '0x0000000000000000000000000000000000000007',
              displayDecimals: 2,
              decimals: 18,
              icon: '/tokens/usdt.png',
              symbol: 'MCK',
              playable: true,
              priceKey: 'usdt',
            },
          ]}
          selectedToken={{
            address: '0x372B5997502E668B8804D11d1569eB28F51a7e4e',
            bankrollIndex: '0x0000000000000000000000000000000000000007',
            displayDecimals: 2,
            decimals: 18,
            icon: '/tokens/usdt.png',
            symbol: 'MCK',
            playable: true,
            priceKey: 'usdt',
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
