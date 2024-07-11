"use client";

import { useCurrentAccount, useTokenBalances } from "@winrlabs/web3";
import { formatUnits } from "viem";

import { useAppConfig } from "../../providers/app-config";

export const BalanceBox = () => {
  // const {}
  const { appTokens } = useAppConfig();
  const { address } = useCurrentAccount();
  const balance = useTokenBalances({
    balancesToRead: appTokens.map((t) => t.tokenAddress),
    account: address || "0x0",
  });

  return (
    <div>
      weth:{" "}
      {formatUnits(balance.data?.[0]?.result || "0n", 18)?.toString() || "0"}
    </div>
  );
};
