'use client';

import { useQuery } from '@tanstack/react-query';
import { JSONRPCClient, TypedJSONRPCClient } from 'json-rpc-2.0';
import React, { createContext, ReactNode, useContext } from 'react';
import { Address, Hex } from 'viem';
import { Config, useAccount } from 'wagmi';

import { UserOperation } from '../smart-wallet';
import debug from 'debug';

const log = debug('worker:UseBundlerClient');

export type BundlerVersion = 'v1' | 'v2';

const BundlerClientContext = createContext<UseBundlerClient<BundlerVersion>>({
  client: undefined,
  isLoading: false,
  error: undefined,
  changeBundlerNetwork: () => {},
  bundlerVersion: 'v1' as BundlerVersion, // Default version
});

export const useBundlerClient = <T extends BundlerVersion = 'v1'>() => {
  return useContext(BundlerClientContext) as UseBundlerClient<T>;
};

interface CallParams {
  owner: Address;
  permit: Hex;
  part: Hex;
  call: {
    dest: Address;
    value: bigint | number;
    data: Hex;
  };
}

interface CreateSessionParams {
  owner: Address;
  until: number;
}

export type BundlerMethods<T extends BundlerVersion = 'v1'> = {
  'preparePaymasterAndData'(params: { callData?: Hex }): {
    paymaster: string;
    paymasterData?: Hex;
    paymasterVerificationGasLimit: number;
    paymasterPostOpGasLimit: number;
  };

  'sendUserOperation'(params: Partial<UserOperation>): {
    hash: Hex;
    status: string;
  };

  'sendGameOperation'(params: Partial<UserOperation>): {
    hash: Hex;
    status: string;
  };

  'call'(params: CallParams): {
    hash: Hex;
    status: string;
  };

  'createSession'(params: CreateSessionParams): {
    status: string;
  };

  'destroySession'(params: { owner: Address }): {
    status: string;
  };

  'permit'(params: { owner: Address; signature: Hex }): {
    pubKey: Hex;
    hashKey: Hex;
  };

  'permitTypedMessage'(
    params: T extends 'v1' ? { owner: Address } : { message: string }
  ): T extends 'v1'
    ? {
        typedMessage: string;
      }
    : {
        message: string;
      };

  'reIterate'(params: { game: string; player: Address }): {
    status: string;
  };

  'refund'(params: { game: string; player: Address }): {
    status: string;
  };

  'getAddress'(params: { message: string }): {
    message: string;
  };

  'getNonce'(params: {}): {
    nonce: number;
  };

  'handshake'(params: { message: string }): {
    message: string;
  };

  'sendTransactionByProxy'(params: { message: string }): {
    hash: Hex;
    status: string;
  };

  'unauthorize'(params: { message: string }): {
    status: string;
  };

  'authorize'(params: { message: string }): {
    message: string;
    status: string;
  };

  'sendTransactionByProxy'(params: { message: string }): {
    hash: Hex;
    status: string;
  };
  'multiplayerGameState'(params: { gameName: 'horserace' | 'wheel' | 'moon' }): any;
};

export enum BundlerNetwork {
  WINR = 'WINR',
  ARBITRUM = 'ARBITRUM',
  BLAST = 'BLAST',
  OPTIMISM = 'OPTIMISM',
  MAINNET = 'MAINNET',
  BASE = 'BASE',
  BSC = 'BSC',
}

interface JSONPCClientRequestParams {
  walletAddress?: `0x${string}`;
  rpcUrl: string;
  network: BundlerNetwork;
}

export type WinrBundlerClient<T extends BundlerVersion = 'v1'> = TypedJSONRPCClient<
  BundlerMethods<T>
>;

interface UseBundlerClient<T extends BundlerVersion = 'v1'> {
  client?: WinrBundlerClient<T>;
  isLoading: boolean;
  error?: Error;
  changeBundlerNetwork: (network: BundlerNetwork) => void;
  globalChainId?: number;
  bundlerVersion: T; // Add bundlerVersion
  onPinNotFound?: () => void;
}

export const fetchBundlerClient = async <T extends BundlerVersion = 'v1'>({
  rpcUrl,
  walletAddress,
  network,
}: JSONPCClientRequestParams): Promise<WinrBundlerClient<T>> => {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const client: WinrBundlerClient<T> | undefined = new JSONRPCClient((jsonRPCRequest) =>
    fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-owner': walletAddress,
        network: network,
      },
      body: JSON.stringify(jsonRPCRequest),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((jsonRPCResponse) => {
            return client?.receive(jsonRPCResponse);
          });
        } else if (jsonRPCRequest.id !== undefined) {
          log('Error fetching JSON-RPC response', response.statusText);

          return Promise.reject(new Error(response.statusText));
        }
      })
      .catch((e) => {
        log('Error fetching JSON-RPC response', e);
        throw e;
      })
  );

  return client;
};

export const BundlerClientProvider = <T extends BundlerVersion = 'v1'>({
  children,
  rpcUrl,
  initialNetwork = BundlerNetwork.WINR,
  config,
  globalChainId,
  bundlerVersion = 'v1' as T, // Default versionw
  onPinNotFound,
}: {
  children: ReactNode;
  rpcUrl: string;
  initialNetwork?: BundlerNetwork;
  config?: Config;
  globalChainId?: number;
  bundlerVersion?: T; // Add bundlerVersion
  onPinNotFound?: () => void;
}) => {
  const { address } = useAccount();

  const [network, setNetwork] = React.useState<BundlerNetwork>(initialNetwork);

  const changeBundlerNetwork = (network: BundlerNetwork) => {
    setNetwork(network);
    refetch();
  };

  const {
    data: client,
    error,
    isLoading,
    refetch,
  } = useQuery<WinrBundlerClient<T>>({
    queryKey: ['bundler-client', address],
    queryFn: () =>
      fetchBundlerClient<T>({
        rpcUrl,
        walletAddress: address,
        network,
      }),
    enabled: !!address && !!rpcUrl && !!network,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    log(client, 'client');
  }, [client]);

  return (
    <BundlerClientContext.Provider
      value={{
        client,
        isLoading,
        error: error as unknown as Error | undefined,
        changeBundlerNetwork,
        globalChainId,
        bundlerVersion, // Provide bundlerVersion
        onPinNotFound,
      }}
    >
      {children}
    </BundlerClientContext.Provider>
  );
};
