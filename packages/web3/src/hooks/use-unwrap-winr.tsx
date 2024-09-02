import React from 'react';
import { useHandleTx } from './use-handle-tx';
import { useTokenBalances, WRAPPED_WINR_BANKROLL } from './use-token-balances';
import { useTokenStore } from '../providers/token';
import { Address, encodeFunctionData, parseUnits } from 'viem';
import { wrappedWinrAbi } from '../abis';
import { useNativeTokenBalance } from './use-native-token-balance';
import { useBalanceStore } from '../providers/balance';

interface IUseUnwrapWinr {
  account: Address;
}

export const useUnWrapWinr = ({ account }: IUseUnwrapWinr) => {
  const tokens = useTokenStore((s) => s.tokens);
  const { balances } = useBalanceStore();
  const { refetch: updateBalances } = useTokenBalances({
    account,
  });

  const wrappedWinr = tokens.find((t) => t.bankrollIndex == WRAPPED_WINR_BANKROLL);
  const wrappedWinrBalance = balances[wrappedWinr?.address || '0x'] || 0;
  const nativeWinr = useNativeTokenBalance({ account });

  const amount =
    wrappedWinrBalance - nativeWinr.balance < 0
      ? '0'
      : (wrappedWinrBalance - nativeWinr.balance).toFixed(2);

  const encodedTxData = React.useMemo(() => {
    return encodeFunctionData({
      abi: wrappedWinrAbi,
      functionName: 'withdraw',
      args: [parseUnits(amount, wrappedWinr?.decimals || 18)],
    });
  }, [amount, wrappedWinr]);

  const unwrapTx = useHandleTx({
    writeContractVariables: {
      abi: wrappedWinrAbi,
      address: wrappedWinr?.address || '0x0',
      functionName: 'withdraw',
    },
    encodedTxData: encodedTxData,
    options: {},
  });

  const unwrapWinrTx = async () => {
    await unwrapTx.mutateAsync();
    nativeWinr.refetch();
    updateBalances();
  };

  return unwrapWinrTx;
};
