import debug from 'debug';
import { useEffect, useMemo } from 'react';
import { Address, formatUnits } from 'viem';
import { useReadContracts } from 'wagmi';

import { erc20Abi } from '../abis';
import { BalanceMap, useBalanceStore } from '../providers/balance';
import { useTokenStore } from '../providers/token';
import { toDecimals } from '../utils/number';
import { useNativeTokenBalance } from './use-native-token-balance';

const log = debug('worker:UseTokenBalances');

export const WRAPPED_WINR_BANKROLL = '0x0000000000000000000000000000000000000006';

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
      functionName: 'balanceOf',
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
  const balanceStore = useBalanceStore((state) => ({
    balances: state.balances,
    updateBalances: state.updateBalances,
  }));
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

  const nativeWinr = useNativeTokenBalance({ account });

  useEffect(() => {
    let balances: BalanceMap = {};
    if (!result || !result.data) return;

    Object.entries(result.data).forEach(([key, value]) => {
      if (value.error) return;

      const tokenAddress = targetBalanceToRead[Number(key)];

      const token = tokens.find((t) => t.address == tokenAddress);

      if (!token) return;

      let balance = Number(formatUnits(value.result as bigint, token.decimals));

      if (token.bankrollIndex == WRAPPED_WINR_BANKROLL) {
        log(
          value.result,
          balance,
          'wrapped <- balance -> native',
          nativeWinr.balance,
          nativeWinr.balanceAsBigInt
        );
      }

      if (token.bankrollIndex == WRAPPED_WINR_BANKROLL) balance += nativeWinr.balance;

      balances[token.address] = toDecimals(balance, token.displayDecimals);
    });

    balanceStore.updateBalances({ ...balanceStore.balances, ...balances });
  }, [result.data, tokens, nativeWinr.balance, targetBalanceToRead.length]);

  return result;
};
