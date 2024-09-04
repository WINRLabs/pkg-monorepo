import React from 'react';
import { Address, encodeFunctionData } from 'viem';

import { wrappedWinrAbi } from '../abis';
import { useTokenStore } from '../providers/token';
import { useHandleTx } from './use-handle-tx';
import { useNativeTokenBalance } from './use-native-token-balance';
import { useTokenBalances, WRAPPED_WINR_BANKROLL } from './use-token-balances';

interface IUseWrapWinr {
  account: Address;
}

export const useWrapWinr = ({ account }: IUseWrapWinr) => {
  const tokens = useTokenStore((s) => s.tokens);
  const wrappedWinr = tokens.find((t) => t.bankrollIndex == WRAPPED_WINR_BANKROLL);
  const nativeWinr = useNativeTokenBalance({ account });
  const { refetch: updateBalances } = useTokenBalances({
    account,
    balancesToRead: [wrappedWinr?.address || '0x'],
  });

  const encodedTxData = React.useMemo(() => {
    return encodeFunctionData({
      abi: wrappedWinrAbi,
      functionName: 'deposit',
      args: [],
    });
  }, []);

  const wrapTx = useHandleTx({
    writeContractVariables: {
      abi: wrappedWinrAbi,
      address: wrappedWinr?.address || '0x0',
      functionName: 'deposit',
      value: nativeWinr.balanceAsBigInt as any,
    },
    encodedTxData: encodedTxData,
    options: {},
  });

  const wrapWinr = async () => {
    if (!nativeWinr.balanceAsBigInt || nativeWinr.balanceAsBigInt <= 0) return;

    await wrapTx.mutateAsync();
    nativeWinr.refetch();
    updateBalances();
  };

  return wrapWinr;
};
