'use client';

import debug from 'debug';
import { useCallback, useMemo, useState } from 'react';
import { encodeFunctionData, formatUnits, parseEther } from 'viem';
import { useReadContract } from 'wagmi';

import { erc20Abi } from '../abis';
import { useSendTx } from './transaction';
import { WinrBundlerClient } from './use-bundler-client';

const log = debug('worker:UseTokenAllowance');

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const UNLIMITED_AMOUNT = 999999999999999;

interface UseTokenAllowanceParams {
  owner: `0x${string}`;
  tokenAddress: `0x${string}`;
  spender: string;
  amountToApprove: number;
  showDefaultToasts?: boolean;
  client?: WinrBundlerClient;
}

export function useTokenAllowance({
  owner,
  spender,
  tokenAddress,
  amountToApprove,
  showDefaultToasts = true,
  client,
}: UseTokenAllowanceParams) {
  const sendTx = useSendTx();

  const [isApproving, setIsApproving] = useState(false);

  const allowanceRead = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    account: owner,
    functionName: 'allowance',
    args: [owner as `0x${string}`, spender as `0x${string}`],
    query: {
      enabled: !!owner && !!spender && !!tokenAddress && !!amountToApprove,
    },
  });

  const tokenDecimalRead = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    account: owner,
    functionName: 'decimals',
    query: {
      enabled: !!owner && !!spender && !!tokenAddress,
    },
  });

  const allowance = useMemo(() => {
    if (!tokenDecimalRead.data) return undefined;

    log('ALLOWANCE', allowanceRead.data, tokenDecimalRead.data);

    const allowanceAmountInEther = Number(
      formatUnits(allowanceRead.data || BigInt(0), tokenDecimalRead.data)
    );

    return allowanceAmountInEther;
  }, [allowanceRead.data, tokenDecimalRead.data, amountToApprove]);

  const handleAllowance = useCallback(
    async ({ errorCb }: { errorCb: (e?: any) => void }) => {
      log('tokenAddress', tokenAddress);
      log('spender', spender);

      if (!allowance && allowance !== 0) return false;

      if (allowance > amountToApprove) return true;
      else {
        try {
          setIsApproving(true);

          await sendTx.mutateAsync({
            encodedTxData: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [spender as `0x${string}`, parseEther(UNLIMITED_AMOUNT.toString())],
            }),
            target: tokenAddress,
          });

          await delay(500);

          allowanceRead.refetch();

          setIsApproving(false);

          return true;
        } catch (e) {
          allowanceRead.refetch();

          errorCb(e);

          setIsApproving(false);

          return false;
        }
      }
    },
    [allowance, tokenAddress, spender, amountToApprove, owner, sendTx]
  );

  const hasAllowance = useMemo(() => {
    return allowance && allowance >= amountToApprove;
  }, [allowance, amountToApprove]);

  return {
    handleAllowance,
    allowanceAmount: allowance,
    hasAllowance,
    isApproving,
    isFetchingAllowance:
      allowanceRead.isFetching || allowanceRead.isLoading || allowanceRead.isRefetching,
  };
}
