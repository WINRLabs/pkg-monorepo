import React from 'react';
import { Address, encodeFunctionData, parseUnits } from 'viem';

import { wrappedWinrAbi } from '../abis';
import { useTokenStore } from '../providers/token';
import { toDecimals } from '../utils/number';
import { useHandleTx } from './use-handle-tx';
import { useNativeTokenBalance } from './use-native-token-balance';
import { useTokenAllowance } from './use-token-allowance';
import { WRAPPED_WINR_BANKROLL } from './use-token-balances';

interface IUseWrapWinr {
  amount: number;
  spender: Address;
  account: Address;
}

export const useWrapWinr = ({ amount, spender, account }: IUseWrapWinr) => {
  const tokens = useTokenStore((s) => s.tokens);
  const wrappedWinr = tokens.find((t) => t.bankrollIndex == WRAPPED_WINR_BANKROLL);
  const nativeWinr = useNativeTokenBalance({ account });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: account || '0x0',
    spender,
    tokenAddress: wrappedWinr?.address || '0x0',
    showDefaultToasts: false,
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
      value: parseUnits(String(toDecimals(amount, 6)), wrappedWinr?.decimals || 18) as any,
    },
    encodedTxData: encodedTxData,
    options: {},
  });

  const wrapWinr = async () => {
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    await wrapTx.mutateAsync();
    nativeWinr.refetch();
  };

  return wrapWinr;
};
