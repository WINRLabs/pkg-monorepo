import { Address } from 'viem';
import { useBalance } from 'wagmi';

export const useNativeTokenBalance = ({ account }: { account: Address }) => {
  const { data: nativeBalanceData, refetch } = useBalance({
    address: account,
  });

  const balanceAsBigInt = nativeBalanceData?.value || BigInt(0);
  const balance = Number(nativeBalanceData?.formatted || 0);

  return {
    balanceAsBigInt,
    balance,
    refetch,
  };
};
