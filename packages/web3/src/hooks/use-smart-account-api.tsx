"use client";

import { JSONRPCClient } from "json-rpc-2.0";
import React from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { SmartWalletConnectorWagmiType } from "../config/smart-wallet-connectors";
import {
  PaymasterAPI,
  PaymasterParams,
  SimpleAccountAPI,
  UserOperation,
} from "../smart-wallet";
import { useBundlerClient } from "./use-bundler-client";

class Paymaster implements PaymasterAPI {
  client: JSONRPCClient;

  constructor(client: JSONRPCClient) {
    this.client = client;
  }

  async getPaymasterData(
    userOp: Partial<UserOperation>
  ): Promise<PaymasterParams> {
    try {
      const paymasterParams = await this.client.request(
        "preparePaymasterAndData",
        {
          callData: userOp.callData,
        }
      );

      return {
        ...paymasterParams,
        paymasterVerificationGasLimit: BigInt(
          paymasterParams.paymasterVerificationGasLimit
        ),
        paymasterPostOpGasLimit: BigInt(
          paymasterParams.paymasterPostOpGasLimit
        ),
      };
    } catch (err) {
      console.log("PAYMASTER ERROR", err);

      return null as unknown as PaymasterParams;
    }
  }
}

interface UseSmartAccountApi {
  accountApi?: SimpleAccountAPI;
}

const SmartAccountApiContext = React.createContext<UseSmartAccountApi>({
  accountApi: undefined,
});

export const useSmartAccountApi = () => {
  const accountApi = React.useContext(SmartAccountApiContext);

  return accountApi;
};

export const SmartAccountApiProvider: React.FC<{
  children: React.ReactNode;
  entryPointAddress: `0x${string}`;
  factoryAddress: `0x${string}`;
}> = ({ children, entryPointAddress, factoryAddress }) => {
  const { address, connector } = useAccount();

  const { client } = useBundlerClient();

  const publicClient = usePublicClient();

  const { data: signer } = useWalletClient();

  const [accountApi, setAccountApi] = React.useState<
    SimpleAccountAPI | undefined
  >(undefined);

  React.useEffect(() => {
    const createSmartAccountApi = () => {
      if (!client || !address || !signer || !publicClient) return;

      if (connector?.type !== SmartWalletConnectorWagmiType) return;

      const _accountApi = new SimpleAccountAPI({
        provider: publicClient,
        entryPointAddress,
        factoryAddress,
        owner: signer,
        index: BigInt(0),
        paymasterAPI: new Paymaster(client),
        overheads: {
          // perUserOp: 100000
        },
      });
      console.log("CREATE SMART ACCOUNT API", _accountApi);

      setAccountApi(_accountApi);
    };

    createSmartAccountApi();
  }, [client, address, signer, publicClient, connector?.type]);

  return (
    <SmartAccountApiContext.Provider value={{ accountApi }}>
      {children}
    </SmartAccountApiContext.Provider>
  );
};
