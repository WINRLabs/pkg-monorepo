"use client";

import { useMutation } from "@tanstack/react-query";
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from "viem";
import { Config, useWriteContract } from "wagmi";
import { WriteContractVariables } from "wagmi/query";

import { SimpleAccountAPI } from "../smart-wallet";
import { useBundlerClient } from "./use-bundler-client";
import { useCurrentAccount } from "./use-current-address";
import { useSmartAccountApi } from "./use-smart-account-api";

export interface UseHandleTxUncachedOptions {
  successMessage?: string;
  successCb?: () => void;
  errorCb?: (e?: any) => void;
}

interface UseHandleTxParams {
  options: UseHandleTxUncachedOptions;
}

interface HandleTxParams<
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
}

const getCachedSignature = async <
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
>(
  writeContractVariables: HandleTxParams<
    abi,
    functionName
  >["writeContractVariables"],
  encodedData: `0x${string}`,
  accountApi?: SimpleAccountAPI
) => {
  if (!accountApi) return;

  const userOp = await accountApi?.createSignedUserOp({
    target: writeContractVariables.address as Address,
    data: encodedData,
    value: writeContractVariables.value,
  });

  return userOp;
};

export const useHandleTxUncached = <
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
>(
  params: UseHandleTxParams
) => {
  const { options } = params;
  const { accountApi } = useSmartAccountApi();
  const { isSocialLogin } = useCurrentAccount();
  const { client } = useBundlerClient();

  const { writeContractAsync } = useWriteContract();

  const handleTxUncached = async ({
    encodedTxData,
    writeContractVariables,
  }: {
    encodedTxData: Address;
    writeContractVariables: HandleTxParams<
      abi,
      functionName
    >["writeContractVariables"];
  }) => {
    if (!client) return;

    const userOp = await getCachedSignature(
      writeContractVariables,
      encodedTxData,
      accountApi
    );
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
    } else {
      console.log(accountApi?.cachedNonce, "cached nonce");
      accountApi?.cachedNonce && accountApi.increaseNonce();
      console.log(accountApi?.cachedNonce, "cached nonce updated");
    }

    return { status, hash };
  };

  const handleTxMutation = useMutation({
    mutationFn: handleTxUncached,
    onSuccess: () => {
      if (options.successCb) {
        options.successCb();
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
