"use client";

import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { SmartWalletConnectorWagmiType } from "../config/smart-wallet-connectors";
import { SimpleAccountAPI } from "../smart-wallet";
import { useSmartAccountApi } from "./use-smart-account-api";

interface UseCurrentAccount {
  rootAddress?: Address;
  address?: Address;
  isGettingAddress?: boolean;
  isSmartWallet?: boolean;
  resetCurrentAccount?: () => void;
}

const initalState: UseCurrentAccount = {
  rootAddress: undefined,
  address: undefined,
  isGettingAddress: false,
  isSmartWallet: false,
  resetCurrentAccount: () => {},
};

const CurrentAccountContext = createContext<UseCurrentAccount>(initalState);

export const useCurrentAccount = () => {
  const currentAccount = useContext(CurrentAccountContext);
  return currentAccount;
};

const fetchSmartAccountAddress = async (
  accountApi?: SimpleAccountAPI,
  isSmartWallet?: boolean
) => {
  if (!isSmartWallet) return;
  if (!accountApi) return;

  const smartWalletAddress = await accountApi?.getAccountAddress();

  return smartWalletAddress;
};

export const CurrentAccountProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { address, connector, isConnecting, status } = useAccount();

  const { accountApi } = useSmartAccountApi();
  const [currentAccount, setCurrentAccount] =
    useState<UseCurrentAccount>(initalState);

  const { data: currentUserAddress, isFetching: isGettingAddress } = useQuery({
    queryKey: [
      "currentUserAddress",
      address,
      connector?.type === SmartWalletConnectorWagmiType,
    ],
    queryFn: () =>
      fetchSmartAccountAddress(
        accountApi,
        connector?.type === SmartWalletConnectorWagmiType
      ),
    enabled: !!address && !!connector?.type && !!accountApi,
  });

  React.useEffect(() => {
    console.log("Status", status);

    const isSmartWallet = connector?.type === SmartWalletConnectorWagmiType;

    setCurrentAccount({
      rootAddress: address,
      address: isSmartWallet ? currentUserAddress : address,
      isGettingAddress,
      isSmartWallet: connector?.type === SmartWalletConnectorWagmiType,
    });
  }, [
    address,
    currentUserAddress,
    isGettingAddress,
    connector?.type,
    isConnecting,
    status,
  ]);


  const resetCurrentAccount = () => {
    setCurrentAccount(initalState);
  };

  return (
    <CurrentAccountContext.Provider
      value={{ ...currentAccount, resetCurrentAccount }}
    >
      {children}
    </CurrentAccountContext.Provider>
  );
};
