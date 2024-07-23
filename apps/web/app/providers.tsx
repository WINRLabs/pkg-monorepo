"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { AudioContextProvider } from "@winrlabs/games";
import { AppUiProviders } from "@winrlabs/ui";
import { WinrLabsWeb3Provider } from "@winrlabs/web3";
import { WinrLabsWeb3GamesProvider } from "@winrlabs/web3-games";
import { Address } from "viem";
import { config } from "./wagmi";

const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || "";
const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || "";
export const entryPointAddress = process.env
  .NEXT_PUBLIC_ENTRYPOINT_ADDRESS as Address;
export const factoryAddress = process.env
  .NEXT_PUBLIC_FACTORY_ADDRESS as Address;

export const controllerAddress = process.env
  .NEXT_PUBLIC_CONTROLLER_ADDRESS as Address;
export const cashierAddress = process.env
  .NEXT_PUBLIC_CASHIER_ADDRESS as Address;
export const uiOperatorAddress = process.env
  .NEXT_PUBLIC_UI_OPERATOR_ADDRESS as Address;

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
};

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isPreviouslyConnected, setIsPreviouslyConnected] = useState(false);

  useEffect(() => {
    if (!localStorage) return;
    setIsPreviouslyConnected(localStorage["isConnected"]);
  }, []);

  return (
    <WagmiProvider reconnectOnMount={isPreviouslyConnected} config={config}>
      <QueryClientProvider client={queryClient}>
        <WinrLabsWeb3Provider
          smartAccountConfig={{
            bundlerUrl,
            entryPointAddress,
            factoryAddress,
          }}
          tokens={[
            {
              address: "0xAfBd36C63F824B60bAc808FA1fA4C2A1a130a772",
              bankrollIndex: "0x0000000000000000000000000000000000000002",
              displayDecimals: 2,
              decimals: 6,
              icon: "/tokens/usdc.png",
              symbol: "USDC",
              playable: true,
            },
            {
              address: "0x32DF602bB33390CefB3cA9F9608ee100971ff1a9",
              bankrollIndex: "0x0000000000000000000000000000000000000003",
              displayDecimals: 2,
              decimals: 6,
              icon: "/tokens/usdt.png",
              symbol: "USDT",
              playable: true,
            },
            {
              address: "0x0Fc2838ad7247a883d96FEA4a4c7402BAf20D1be",
              bankrollIndex: "0x0000000000000000000000000000000000000004",
              displayDecimals: 6,
              decimals: 8,
              icon: "/tokens/wbtc.png",
              symbol: "wBTC",
              playable: true,
            },
            {
              address: "0x7d259fdA68762D0DEB6EA5c8e4e949D97Da6caB9",
              bankrollIndex: "0x0000000000000000000000000000000000000005",
              displayDecimals: 6,
              decimals: 18,
              icon: "/tokens/weth.png",
              symbol: "wETH",
              playable: true,
            },
          ]}
          selectedToken={{
            address: "0x1beC7d3Bc7B898f764C98B26Dc8140463Ffe064E",
            bankrollIndex: "0x0000000000000000000000000000000000000005",
            displayDecimals: 6,
            decimals: 18,
            icon: "/tokens/weth.png",
            symbol: "wETH",
            playable: true,
          }}
        >
          <AppUiProviders wagmiConfig={config}>
            <WinrLabsWeb3GamesProvider
              config={{
                wagmiConfig: config,
                bundlerWsUrl,
                contracts: {
                  gameAddresses,
                  controllerAddress,
                  cashierAddress,
                  uiOperatorAddress,
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
