'use client';

import { useQuery } from '@tanstack/react-query';
import { JSONRPCClient, TypedJSONRPCClient } from 'json-rpc-2.0';
import React, { createContext, ReactNode, useContext } from 'react';
import { Address, Hex } from 'viem';
import { Config, useAccount } from 'wagmi';

import { UserOperation } from '../smart-wallet';

const BundlerClientContext = createContext<UseBundlerClient>({
  client: undefined,
  isLoading: false,
  error: undefined,
  changeBundlerNetwork: () => {},
});

export const useBundlerClient = () => {
  return useContext(BundlerClientContext);
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

export type BundlerMethods = {
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

  'permitTypedMessage'(params: { owner: Address }): {
    typedMessage: Hex;
  };
};

export enum BundlerNetwork {
  WINR = 'WINR',
  ARBITRUM = 'ARBITRUM',
  BLAST = 'BLAST',
  OPTIMISM = 'OPTIMISM',
}

interface JSONPCClientRequestParams {
  walletAddress?: `0x${string}`;
  rpcUrl: string;
  network: BundlerNetwork;
}

export type WinrBundlerClient = TypedJSONRPCClient<BundlerMethods>;

interface UseBundlerClient {
  client?: WinrBundlerClient;
  isLoading: boolean;
  error?: Error;
  changeBundlerNetwork: (network: BundlerNetwork) => void;
  globalChainId?: number;
}

export const fetchBundlerClient = async ({
  rpcUrl,
  walletAddress,
  network,
}: JSONPCClientRequestParams): Promise<WinrBundlerClient> => {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const client: WinrBundlerClient | undefined = new JSONRPCClient((jsonRPCRequest) =>
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
          console.log('Error fetching JSON-RPC response', response.statusText);

          return Promise.reject(new Error(response.statusText));
        }
      })
      .catch((e) => {
        console.log('Error fetching JSON-RPC response', e);
        throw e;
      })
  );

  return client;
};

export const BundlerClientProvider: React.FC<{
  children: ReactNode;
  rpcUrl: string;
  initialNetwork?: BundlerNetwork;
  config?: Config;
  globalChainId?: number;
}> = ({ children, rpcUrl, initialNetwork = BundlerNetwork.WINR, config, globalChainId }) => {
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
  } = useQuery<WinrBundlerClient>({
    queryKey: ['bundler-client', address],
    queryFn: () =>
      fetchBundlerClient({
        rpcUrl,
        walletAddress: address,
        network,
      }),
    enabled: !!address && !!rpcUrl && !!network,
  });

  React.useEffect(() => {
    console.log(client, 'client');
  }, [client]);

  return (
    <BundlerClientContext.Provider
      value={{
        client,
        isLoading,
        error: error as unknown as Error | undefined,
        changeBundlerNetwork,
        globalChainId,
      }}
    >
      {children}
    </BundlerClientContext.Provider>
  );
};
