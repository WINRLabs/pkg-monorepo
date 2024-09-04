'use client';

import {
  delay,
  erc20Abi,
  FastOrVerifiedOption,
  useCurrentAccount,
  useFastOrVerifiedStore,
  useHandleTx,
  useSendTx,
  useTokenBalances,
  useTokenStore,
} from '@winrlabs/web3';
import React from 'react';
import { encodeFunctionData, parseUnits } from 'viem';
import { Config, useConnectors, useDisconnect } from 'wagmi';

import { useWagmiConfig } from '../../providers/wagmi-config';
import { LogoMain, Wallet } from '../../svgs';
import { cn } from '../../utils';
import { Button } from '../button';
import { Chat } from '../chat';
import useModalsStore from '../modals/modals.store';
import { Skeleton } from '../skeleton';
import { Spinner } from '../spinner';
import { SelectGameCurrency } from '../wallet/token-dropdown';

export interface HeaderProps {
  appLogo?: React.ReactNode;
  leftSideComponents?: React.ReactNode[];
  wagmiConfig?: Config;
  chat: {
    show?: boolean;
  };
  containerClassName?: string;
}

const Connecting = () => {
  return (
    <div className="wr-flex wr-items-center wr-justify-center wr-h-64 wr-gap-2">
      <Spinner />
    </div>
  );
};

export const Header = ({ appLogo, leftSideComponents, chat, containerClassName }: HeaderProps) => {
  const modalStore = useModalsStore();
  const account = useCurrentAccount();
  const { wagmiConfig } = useWagmiConfig();
  const connectors = useConnectors({
    config: wagmiConfig,
  });
  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { option, updateOption } = useFastOrVerifiedStore();

  const { disconnect, disconnectAsync, isPending, data } = useDisconnect({
    config: wagmiConfig,
  });

  useTokenBalances({
    account: account.address!,
  });

  const encodedTxData = React.useMemo(() => {
    if (!account.address) return;

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'mint',
      args: [account.address as `0x${string}`, parseUnits('100', selectedToken.decimals)],
    });

    return encodedData;
  }, [account.address, selectedToken.address]);

  const mintTx = useHandleTx({
    writeContractVariables: {
      abi: erc20Abi,
      address: selectedToken.address,
      functionName: 'mint',
      args: [account.address as `0x${string}`, parseUnits('100', selectedToken.decimals)],
    },
    encodedTxData: encodedTxData || '0x0',
    options: {},
  });

  const send = useSendTx({
    onError: (error) => {
      console.log(error, 'mint tx error');
    },
  });

  return (
    <header
      className={cn(
        'wr-sticky -wr-top-6 wr-z-40 wr-mx-auto wr-max-w-[1140px] wr-bg-zinc-950  wr-pb-[22px] wr-pt-[18px] lg:wr-top-0',
        containerClassName
      )}
    >
      <nav className="wr-relative wr-top-0 wr-flex writems-center wr-justify-between">
        <section className="wr-flex wr-items-center wr-gap-2 lg:wr-gap-6 wr-relative">
          {appLogo ? appLogo : <LogoMain />}

          <span className="wr-bg-emerald-600 wr-px-2 wr-rounded-full wr-font-semibold wr-absolute -wr-right-4 -wr-bottom-2 wr-text-xs">
            DEV
          </span>

          {leftSideComponents &&
            leftSideComponents.length &&
            leftSideComponents.map((component, index) => <div key={index}>{component}</div>)}
        </section>
        {account.isGettingAddress && <Skeleton className="wr-h-10 wr-w-24" />}
        {account.address && !account.isGettingAddress && (
          <>
            <section className="wr-flex wr-gap-2">
              <div
                className={cn(
                  'wr-p-2 wr-rounded-lg wr-transition-all wr-duration-200 wr-text-center wr-font-bold wr-cursor-pointer',
                  {
                    'wr-bg-green-500': option == FastOrVerifiedOption.FAST,
                  }
                )}
                onClick={() => updateOption(FastOrVerifiedOption.FAST)}
              >
                Fast
              </div>
              <div
                className={cn(
                  'wr-p-2 wr-rounded-lg wr-transition-all wr-duration-200 wr-text-center wr-font-bold wr-cursor-pointer',
                  {
                    'wr-bg-green-500': option == FastOrVerifiedOption.VERIFIED,
                  }
                )}
                onClick={() => updateOption(FastOrVerifiedOption.VERIFIED)}
              >
                Verified
              </div>
            </section>

            <div className="wr-mx-4 wr-gap-2 wr-flex wr-items-center lg:wr-absolute lg:wr-left-[50%] lg:wr-top-[50%] lg:wr-mx-0 lg:wr-translate-x-[-50%] lg:wr-translate-y-[-50%]">
              <SelectGameCurrency />
              <Button
                isLoading={mintTx.isPending}
                variant={'success'}
                onClick={async () => {
                  try {
                    // await mintTx.mutateAsync();

                    await send.mutateAsync({
                      encodedTxData: encodeFunctionData({
                        abi: erc20Abi,
                        functionName: 'mint',
                        args: [
                          account.address as `0x${string}`,
                          parseUnits('100', selectedToken.decimals),
                        ],
                      }),
                      target: selectedToken.address,
                    });
                  } catch (e: any) {
                    console.log('error', e);
                  }
                }}
              >
                MINT
              </Button>
            </div>
            <Button
              disabled={isPending}
              onClick={async () => {
                try {
                  await Promise.all(
                    connectors.map(async (connector, index) => {
                      await delay(index * 100); // Ensures the delay between each call
                      await disconnectAsync({ connector });
                    })
                  );
                  localStorage.clear();
                  account?.resetCurrentAccount?.();
                } catch (error) {
                  console.error('Error during disconnect:', error);
                }
              }}
              isLoading={isPending}
            >
              {account.address}
            </Button>
          </>
        )}
        {!account.isGettingAddress && !account.address && (
          <section className="wr-ml-6 wr-flex wr-gap-2">
            <Button
              onClick={() => {
                modalStore.openModal('login');
              }}
              withIcon
              variant="success"
              className="wr-flex  wr-items-center wr-gap-2"
              style={{ flex: '0 0 auto' }}
            >
              <Wallet className="wr-h-5 wr-w-5" /> Log In
            </Button>

            {chat.show && <Chat />}
          </section>
        )}
      </nav>
    </header>
  );
};
