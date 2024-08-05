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
  isSocialLogin?: boolean;
  resetCurrentAccount?: () => void;
}

const initalState: UseCurrentAccount = {
  rootAddress: undefined,
  address: undefined,
  isGettingAddress: false,
  isSocialLogin: false,
  resetCurrentAccount: () => {},
};

const CurrentAccountContext = createContext<UseCurrentAccount>(initalState);

export const useCurrentAccount = () => {
  const currentAccount = useContext(CurrentAccountContext);
  return currentAccount;
};

const fetchSmartAccountAddress = async (accountApi?: SimpleAccountAPI) => {
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
    queryKey: ["currentUserAddress", address],
    queryFn: () => fetchSmartAccountAddress(accountApi),
    enabled: !!address && !!connector?.type && !!accountApi,
  });

  React.useEffect(() => {
    console.log("Status", status);

    setCurrentAccount({
      rootAddress: address,
      address: currentUserAddress,
      isGettingAddress,
      isSocialLogin: connector?.type === SmartWalletConnectorWagmiType,
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
