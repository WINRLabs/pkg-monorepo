"use client";

import { delay, useCurrentAccount } from "@winrlabs/web3";
import { Config, useConnectors, useDisconnect } from "wagmi";

import { useWagmiConfig } from "../../providers/wagmi-config";
import { LogoMain, Wallet } from "../../svgs";
import { cn } from "../../utils";
import { Button } from "../button";
import { Chat } from "../chat";
import useModalsStore from "../modals/modals.store";
import { Skeleton } from "../skeleton";
import { Spinner } from "../spinner";
import { SelectGameCurrency } from "../wallet/token-dropdown";

export interface HeaderProps {
  appLogo?: React.ReactNode;
  leftSideComponents?: React.ReactNode[];
  wagmiConfig?: Config;
  chat: {
    show?: boolean;
  };
  containerClassName?: string;
}

const Connecting = () => {
  return (
    <div className="wr-flex wr-items-center wr-justify-center wr-h-64 wr-gap-2">
      <Spinner />
    </div>
  );
};

export const Header = ({
  appLogo,
  leftSideComponents,
  chat,
  containerClassName,
}: HeaderProps) => {
  const modalStore = useModalsStore();
  const account = useCurrentAccount();
  const { wagmiConfig } = useWagmiConfig();
  const connectors = useConnectors({
    config: wagmiConfig,
  });

  const { disconnect, disconnectAsync, isPending, data } = useDisconnect({
    config: wagmiConfig,
  });

  return (
    <header
      className={cn(
        "wr-sticky -wr-top-6 wr-z-40 wr-mx-auto wr-max-w-[1140px] wr-bg-zinc-950  wr-pb-[22px] wr-pt-[18px] lg:wr-top-0",
        containerClassName
      )}
    >
      <nav className="wr-relative wr-top-0 wr-flex writems-center wr-justify-between">
        <section className="wr-flex wr-items-center wr-gap-2 lg:wr-gap-6">
          {appLogo ? appLogo : <LogoMain />}

          {leftSideComponents &&
            leftSideComponents.length &&
            leftSideComponents.map((component, index) => (
              <div key={index}>{component}</div>
            ))}
        </section>
        {account.isGettingAddress && <Skeleton className="wr-h-10 wr-w-24" />}
        {account.address && !account.isGettingAddress && (
          <>
            <div className="wr-mx-4 wr-flex wr-items-center lg:wr-absolute lg:wr-left-[50%] lg:wr-top-[50%] lg:wr-mx-0 lg:wr-translate-x-[-50%] lg:wr-translate-y-[-50%]">
              <SelectGameCurrency />
            </div>
            <Button
              disabled={isPending}
              onClick={async () => {
                try {
                  await Promise.all(
                    connectors.map(async (connector, index) => {
                      await delay(index * 100); // Ensures the delay between each call
                      await disconnectAsync({ connector });
                    })
                  );
                  localStorage.clear();
                  account?.resetCurrentAccount?.();
                } catch (error) {
                  console.error("Error during disconnect:", error);
                }
              }}
              isLoading={isPending}
            >
              {account.address}
            </Button>
          </>
        )}
        {!account.isGettingAddress && !account.address && (
          <section className="wr-ml-6 wr-flex wr-gap-2">
            <Button
              onClick={() => {
                modalStore.openModal("login");
              }}
              withIcon
              variant="success"
              className="wr-flex  wr-items-center wr-gap-2"
              style={{ flex: "0 0 auto" }}
            >
              <Wallet className="wr-h-5 wr-w-5" /> Log In
            </Button>

            {chat.show && <Chat />}
          </section>
        )}
      </nav>
    </header>
  );
};
