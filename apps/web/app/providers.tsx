"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "./wagmi";
import { WinrLabsWeb3Provider } from "@winrlabs/web3";
import { AudioContextProvider } from "@winrlabs/games";
import { AppUiProviders } from "@winrlabs/ui";
import { WinrLabsWeb3GamesProvider } from "@winrlabs/web3-games";
import { Address } from "viem";

const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || "";
const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || "";
const entryPointAddress = process.env.NEXT_PUBLIC_ENTRYPOINT_ADDRESS as Address;
const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address;

const controllerAddress = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS as Address;
const cashierAddress = process.env.NEXT_PUBLIC_CASHIER_ADDRESS as Address;
const uiOperatorAddress = process.env
  .NEXT_PUBLIC_UI_OPERATOR_ADDRESS as Address;

const gameAddresses = {
  coinFlip: process.env.NEXT_PUBLIC_COIN_FLIP_ADDRESS as Address,
  plinko: process.env.NEXT_PUBLIC_PLINKO_ADDRESS as Address,
  limbo: process.env.NEXT_PUBLIC_LIMBO_ADDRESS as Address,
  rps: process.env.NEXT_PUBLIC_RPS_ADDRESS as Address,
  roll: process.env.NEXT_PUBLIC_ROLL_ADDRESS as Address,
  dice: process.env.NEXT_PUBLIC_DICE_ADDRESS as Address,
  roulette: process.env.NEXT_PUBLIC_ROULETTE_ADDRESS as Address,
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
        >
          <AppUiProviders
            wagmiConfig={config}
            appTokens={[
              {
                tokenAddress: "0x031C21aC79baac1E6AD074ea63ED9e9a318cab26",
                displayDecimals: 6,
                tokenDecimals: 18,
                icon: "https://assets.coingecko.com/coins/images/325/standard/wETH.png?1696501661",
                tokenSymbol: "wETH",
              },
            ]}
          >
            <WinrLabsWeb3GamesProvider
              config={{
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
