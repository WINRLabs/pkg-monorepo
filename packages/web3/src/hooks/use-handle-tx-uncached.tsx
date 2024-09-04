'use client';

import { useMutation } from '@tanstack/react-query';
import {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  encodeFunctionData,
  EncodeFunctionDataParameters,
  SwitchChainError,
} from 'viem';
import { Config, useSwitchChain } from 'wagmi';
import { WriteContractVariables } from 'wagmi/query';

import { SimpleAccountAPI } from '../smart-wallet';
import { useBundlerClient, WinrBundlerClient } from './use-bundler-client';
import { useSmartAccountApi } from './use-smart-account-api';
import { useCurrentAccount } from './use-current-address';
import { useCreateSession, useSessionStore } from './session';
import { ErrorCode, mmAuthSessionErr, mmAuthSignErrors } from '../utils/error-codes';
import { delay } from './use-token-allowance';

export interface UseHandleTxUncachedOptions {
  successMessage?: string;
  successCb?: () => void;
  errorCb?: (e?: any) => void;
  confirmations?: number;
  showDefaultToasts?: boolean;
  refetchInterval?: number;
  unauthRedirectionCb?: () => void;
  method?: 'sendUserOperation' | 'sendGameOperation';
  client?: WinrBundlerClient;
  accountApi?: SimpleAccountAPI;
}

interface UseHandleTxParams {
  options: UseHandleTxUncachedOptions;
}

interface HandleTxParams<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
> {
  writeContractVariables: WriteContractVariables<
    abi,
    ContractFunctionName<abi, 'nonpayable' | 'payable'>,
    ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
    Config,
    Config['chains'][number]['id']
  >;
}

const createUserOp = async <
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
>(
  writeContractVariables: HandleTxParams<abi, functionName>['writeContractVariables'],
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
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
>(
  params: UseHandleTxParams
) => {
  const { options } = params;
  const { method = 'sendUserOperation' } = options;
  const { address, isSocialLogin, rootAddress } = useCurrentAccount();
  const { accountApi: defaultAccountApi } = useSmartAccountApi();
  const { client: defaultClient } = useBundlerClient();
  const { switchChainAsync } = useSwitchChain();

  const createSession = useCreateSession();

  const sessionStore = useSessionStore();

  const handleTxUncached = async ({
    encodedTxData,
    params,
    writeContractVariables,
  }: {
    encodedTxData: Address;
    params: {
      networkId?: number;
    };
    writeContractVariables: HandleTxParams<abi, functionName>['writeContractVariables'];
  }) => {
    const networkId = params && 'networkId' in params ? params.networkId : 777777;

    if (!address && options.unauthRedirectionCb) {
      options.unauthRedirectionCb();

      return;
    }

    let client = options.client ? options.client : defaultClient;

    let accountApi = options.accountApi ? options.accountApi : defaultAccountApi;

    let encodedData = encodedTxData
      ? encodedTxData
      : encodeFunctionData<abi, functionName>({
          abi: writeContractVariables.abi,
          functionName: writeContractVariables.functionName,
          args: writeContractVariables.args,
        } as EncodeFunctionDataParameters<abi, functionName>);

    if (!client) return;

    if (!isSocialLogin) {
      try {
        await switchChainAsync({ chainId: networkId! });
      } catch (error) {
        throw new SwitchChainError(error as Error);
      }

      let _part = sessionStore.part;
      let _permit = sessionStore.permit;

      const getNewSession = async () => {
        const session = await createSession.mutateAsync({
          customClient: client,
          signerAddress: rootAddress!,
          untilInHours: 24,
        });

        sessionStore.setPart(session.part);
        sessionStore.setPermit(session.permit);

        return { part: session.part, permit: session.permit };
      };

      let retryCount = 0;
      const maxRetries = 3;

      const makeRequest = async () => {
        try {
          return await client?.request('call', {
            call: {
              dest: writeContractVariables.address as Address,
              data: encodedData,
              value: Number(writeContractVariables.value || 0),
            },
            owner: rootAddress!,
            part: _part ?? '0x',
            permit: _permit ?? '0x',
          });
        } catch (error: any) {
          if (retryCount < maxRetries) {
            retryCount++;
            // If the first attempt fails, get a new session and try again
            if (
              error?.code !== ErrorCode.InvalidNonce &&
              (mmAuthSignErrors.includes(error?.message) ||
                error?.message?.includes(mmAuthSessionErr))
            ) {
              ({ part: _part, permit: _permit } = await getNewSession());
            }
            await delay(200);
            return await makeRequest();
          } else {
            throw error; // Rethrow the error if max retries reached
          }
        }
      };

      return makeRequest();
    }

    const userOp = await createUserOp(writeContractVariables, encodedData, accountApi);

    if (!userOp) {
      throw new Error('No cached signature found');
    }

    const { status, hash } = await client.request(method, {
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
        : '',
      paymasterPostOpGasLimit: userOp.paymasterPostOpGasLimit
        ? userOp.paymasterPostOpGasLimit.toString()
        : '',
      paymasterData: userOp.paymasterData,
      signature: userOp.signature,
    });

    if (status !== 'success') {
      accountApi && (await accountApi.refreshNonce());
      throw new Error(status);
    } else {
      console.log(accountApi?.cachedNonce, 'cached nonce');
      accountApi?.cachedNonce && accountApi.increaseNonce();
      console.log(accountApi?.cachedNonce, 'cached nonce updated');
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
