"use client";

import { SmartWalletConnectorWagmiType } from "@winrlabs/web3";
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import { Connector, useConnect, useConnectors } from "wagmi";

import { useWagmiConfig } from "../../../providers/wagmi-config";
import { Google, IconWallet } from "../../../svgs";
import { Button } from "../../button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../dialog";
import { Spinner } from "../../spinner";
import useModalsStore from "../modals.store";

const Connecting = () => {
  return (
    <div className="wr-flex wr-items-center wr-justify-center wr-h-64 wr-gap-2">
      <Spinner />
      <span className="wr-text-primary">Connecting...</span>
    </div>
  );
};

export const LoginModal = () => {
  const { modal, closeModal } = useModalsStore();

  const { wagmiConfig } = useWagmiConfig();

  const [isSmartWallet, setIsSmartWallet] = useState(true);

  const connectors = useConnectors({
    config: wagmiConfig,
  });

  const { connect, isPending, isSuccess, connectAsync } = useConnect({
    config: wagmiConfig,
  });

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess]);

  const smartWalletConnectors = connectors.filter(
    (connector) =>
      connector.type === SmartWalletConnectorWagmiType &&
      connector.id !== "web3auth-google"
  );

  const googleConnector = connectors.find(
    (connector) => connector.id === "web3auth-google"
  );

  const web3Connectors = connectors.filter(
    (connector) => connector.type !== SmartWalletConnectorWagmiType
  );

  return (
    <Dialog
      onOpenChange={(d) => {
        console.log(d, "data");
      }}
      open={modal === "login"}
    >
      <DialogContent className="sm:wr-max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="wr-flex wr-items-center wr-gap-2 ">
            <IconWallet className="wr-h-6 wr-w-6" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {isPending && <Connecting />}
          {isSmartWallet && !isPending && (
            <React.Fragment>
              {" "}
              <section>
                <button
                  className="wr-rounded-md wr-px-3 wr-py-0 wr-text-[15px] wr-font-semibold wr-leading-4 wr-transition wr-duration-300 wr-ease-out hover:wr-ease-in focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-cursor-not-allowed wr-bg-zinc-100 wr-flex wr-items-center wr-justify-center wr-gap-1 wr-w-full wr-h-10 wr-text-black"
                  onClick={async () => {
                    await connectAsync({
                      connector: googleConnector as Connector,
                    });
                    localStorage["isConnected"] = true;
                  }}
                >
                  <Google />
                  <span>Continue with Google</span>
                </button>
              </section>
              <section className="wr-grid wr-grid-cols-2 wr-gap-2 wr-my-3">
                {smartWalletConnectors.map((connector) => {
                  return (
                    <div
                      key={connector.id}
                      className="wr-flex wr-flex-col wr-gap-2"
                    >
                      <Button
                        variant={"outline"}
                        size={"lg"}
                        onClick={async () => {
                          await connectAsync({ connector });
                          localStorage["isConnected"] = true;
                        }}
                        type="button"
                      >
                        {connector.name}
                      </Button>
                    </div>
                  );
                })}
              </section>
              <section>
                <Button
                  variant={"success"}
                  size={"lg"}
                  className="wr-w-full"
                  onClick={() => {
                    setIsSmartWallet(false);
                  }}
                >
                  Connect Wallet
                </Button>
              </section>
            </React.Fragment>
          )}
          {!isSmartWallet && !isPending && (
            <React.Fragment>
              <section className="wr-grid wr-grid-cols-2 wr-gap-2 wr-my-3">
                {web3Connectors.map((connector) => {
                  return (
                    <div
                      key={connector.id}
                      className="wr-flex wr-flex-col wr-gap-2"
                    >
                      <Button
                        variant={"outline"}
                        size={"lg"}
                        onClick={async () => {
                          await connectAsync({ connector });
                          localStorage["isConnected"] = true;
                        }}
                        type="button"
                      >
                        {connector.name}
                      </Button>
                    </div>
                  );
                })}
              </section>
              <section>
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="wr-w-full"
                  onClick={() => {
                    setIsSmartWallet(true);
                  }}
                >
                  Connect Smart Wallet
                </Button>
              </section>
            </React.Fragment>
          )}
        </DialogBody>
        <DialogFooter className="wr-text-center wr-leading-5 text-zinc-500 [&_a]:text-zinc-100">
          By using{" "}
          <Link href={"/"} target="_blank">
            JustBet
          </Link>
          , you agree to our{" "}
          <Link href={"/"} target="_blank">
            Terms of Service
          </Link>{" "}
          and our{" "}
          <Link href="/" target="_blank">
            Privacy Policy
          </Link>
          .
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
