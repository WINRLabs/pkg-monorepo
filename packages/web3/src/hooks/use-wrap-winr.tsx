import { Address, encodeFunctionData, parseUnits } from 'viem';

import { wrappedWinrAbi } from '../abis';
import { useTokenStore } from '../providers/token';
import { toDecimals } from '../utils/number';
import { useSendTx } from './transaction';
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

  const sendTx = useSendTx();

  const wrapWinr = async () => {
    if (!nativeWinr.balance || nativeWinr.balance <= 0.001) return;

    await sendTx.mutateAsync({
      encodedTxData: encodeFunctionData({
        abi: wrappedWinrAbi,
        functionName: 'deposit',
        args: [],
      }),
      value: parseUnits(String(toDecimals(nativeWinr.balance, 4)), 18) as any,
      target: wrappedWinr?.address,
    });

    nativeWinr.refetch();
    updateBalances();
  };

  return wrapWinr;
};
