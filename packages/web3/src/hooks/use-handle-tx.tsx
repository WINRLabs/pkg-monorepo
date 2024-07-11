"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from "viem";
import { Config, useWriteContract } from "wagmi";
import { WriteContractVariables } from "wagmi/query";

import { SimpleAccountAPI } from "../smart-wallet";
import { useBundlerClient } from "./use-bundler-client";
import { useCurrentAccount } from "./use-current-address";
import { useSmartAccountApi } from "./use-smart-account-api";

export interface UseHandleTxOptions {
  successMessage?: string;
  successCb?: () => void;
  errorCb?: (e?: any) => void;
  confirmations?: number;
  showDefaultToasts?: boolean;
}

interface UseHandleTxParams<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
> {
  writeContractVariables: WriteContractVariables<
    abi,
    ContractFunctionName<abi, "nonpayable" | "payable">,
    ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
    Config,
    Config["chains"][number]["id"]
  >;
  options: UseHandleTxOptions;
  encodedTxData: `0x${string}`;
}

const getCachedSignature = async <
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
>(
  writeContractVariables: UseHandleTxParams<
    abi,
    functionName
  >["writeContractVariables"],
  encodedData: `0x${string}`,
  accountApi?: SimpleAccountAPI,
  isSmartWallet?: boolean
) => {
  if (!accountApi) return;
  if (!isSmartWallet) return;

  const userOp = await accountApi?.createSignedUserOp({
    target: writeContractVariables.address as Address,
    data: encodedData,
  });

  return userOp;
};

export const useHandleTx = <
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
>(
  params: UseHandleTxParams<abi, functionName>
) => {
  const { writeContractVariables, options, encodedTxData } = params;
  const { accountApi } = useSmartAccountApi();
  const { isSmartWallet } = useCurrentAccount();
  const { client } = useBundlerClient();
  const queryClient = useQueryClient();

  const { data: cachedUserOp } = useQuery({
    queryKey: [
      "cachedSignature",
      writeContractVariables.functionName,
      isSmartWallet,
      encodedTxData,
    ],
    queryFn: () =>
      getCachedSignature(
        writeContractVariables,
        encodedTxData,
        accountApi,
        isSmartWallet
      ),
    enabled: !!accountApi && isSmartWallet && !!encodedTxData,
    staleTime: 10000, // Adjust stale time as needed
  });

  const { writeContractAsync } = useWriteContract();

  const handleTxMutation = useMutation({
    mutationFn: async () => {
      if (!client) return;

      if (isSmartWallet) {
        let userOp = cachedUserOp;

        if (!userOp) {
          userOp = await getCachedSignature(
            writeContractVariables,
            encodedTxData,
            accountApi,
            isSmartWallet
          );
        }

        if (!userOp) {
          throw new Error("No cached signature found");
        }

        const { status, hash } = await client.request("sendUserOperation", {
          sender: userOp.sender,
          nonce: userOp.nonce.toString(),
          factory: userOp.factory,
          factoryData: userOp.factoryData,
          callData: userOp.callData,
          callGasLimit: userOp.callGasLimit.toString(),
          verificationGasLimit: userOp.verificationGasLimit.toString(),
          preVerificationGas: userOp.preVerificationGas.toString(),
          maxFeePerGas: userOp.maxFeePerGas.toString(),
          maxPriorityFeePerGas: userOp.maxPriorityFeePerGas.toString(),
          paymaster: userOp.paymaster,
          paymasterVerificationGasLimit: userOp.paymasterVerificationGasLimit
            ? userOp.paymasterVerificationGasLimit.toString()
            : "",
          paymasterPostOpGasLimit: userOp.paymasterPostOpGasLimit
            ? userOp.paymasterPostOpGasLimit.toString()
            : "",
          paymasterData: userOp.paymasterData,
          signature: userOp.signature,
        });

        if (status !== "success") {
          throw new Error(status);
        }

        return { status, hash };
      } else {
        return await writeContractAsync({
          abi: writeContractVariables.abi,
          address: writeContractVariables.address,
          functionName: writeContractVariables.functionName,
          account: writeContractVariables.account,
          args: writeContractVariables.args,
          chainId: writeContractVariables.chainId,
          connector: writeContractVariables.connector,
          dataSuffix: writeContractVariables.dataSuffix,
          value: writeContractVariables.value,
          __mode: writeContractVariables.__mode,
        } as WriteContractVariables<
          Abi,
          string,
          readonly unknown[],
          Config,
          Config["chains"][number]["id"]
        >);
      }
    },
    onSuccess: (data) => {
      if (options.successCb) {
        options.successCb();
      }
      if (isSmartWallet) {
        queryClient.invalidateQueries({
          queryKey: ["cachedSignature"],
        });
      }
    },
    onError: (error) => {
      if (options.errorCb) {
        options.errorCb(error);
      }
    },
  });

  return handleTxMutation;
};
