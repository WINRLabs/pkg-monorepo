import { useEffect, useMemo } from "react";
import { Address, formatUnits } from "viem";
import { useReadContracts } from "wagmi";

import { erc20Abi } from "../abis";
import { BalanceMap, useBalanceStore } from "../providers/balance";
import { useTokenStore } from "../providers/token";
import { toDecimals } from "../utils/number";

const getContractsToRead = ({
  balancesToRead,
  account,
}: {
  balancesToRead: Address[];
  account: Address;
}) => {
  return balancesToRead.map((tokenAddress) => {
    return {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account],
    };
  });
};

/**
 *
 * @param account
 * @param balancesToRead
 * @returns
 *
 * If no balancesToRead is provided, it will return the balances of all the tokens in the token store
 */
export const useTokenBalances = ({
  account,
  balancesToRead,
}: {
  account: Address;
  balancesToRead?: Address[];
}) => {
  const updateBalances = useBalanceStore((state) => state.updateBalances);
  const tokens = useTokenStore((s) => s.tokens);
  const targetBalanceToRead =
    balancesToRead && balancesToRead?.length > 0
      ? balancesToRead
      : tokens.map((token) => token.address);

  const contractsToRead = useMemo(() => {
    if (!targetBalanceToRead || !account) return [];
    return getContractsToRead({ balancesToRead: targetBalanceToRead, account });
  }, [targetBalanceToRead, account]);

  const result = useReadContracts({
    contracts: contractsToRead,
    query: {
      enabled: !!contractsToRead || !!account,
    },
  });

  useEffect(() => {
    let balances: BalanceMap = {};
    if (!result || !result.data) return;

    Object.entries(result.data).forEach(([key, value]) => {
      if (value.error) return;

      const token = tokens[Number(key)];

      if (!token) return;

      const balance = Number(
        formatUnits(value.result as bigint, token.decimals)
      );

      balances[token.address] = toDecimals(balance, token.displayDecimals);
    });

    updateBalances(balances);
  }, [result.data, tokens]);

  return result;
};
