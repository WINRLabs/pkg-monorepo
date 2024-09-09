'use client';

import { useMutation } from '@tanstack/react-query';
import debug from 'debug';
import { Hex } from 'viem';

import { MutationHook } from '../../utils/types';
import { useBundlerClient } from '../use-bundler-client';
import { useSmartAccountApi } from '../use-smart-account-api';
import {
  AccountApiNotFoundError,
  BundlerClientNotFoundError,
  BundlerRequestError,
  NoSignatureFound,
} from './error';
import { CreateUserOpRequest, SocialAccountTxRequest } from './types';

const log = debug('worker:UseSocialAccount');

export const createUserOperation = async (request: CreateUserOpRequest) => {
  const { target, encodedData, accountApi, value } = request;
  if (!accountApi) {
    throw new AccountApiNotFoundError();
  }

  const userOp = await accountApi?.createSignedUserOp({
    target,
    data: encodedData,
    value,
  });

  return userOp;
};

export const useSocialAccountTx: MutationHook<
  SocialAccountTxRequest,
  { status: string; hash: Hex }
> = (options = {}) => {
  const { accountApi: defaultAccountApi } = useSmartAccountApi();
  const { client: defaultClient } = useBundlerClient();

  return useMutation({
    ...options,
    mutationFn: async (request) => {
      let client = request.customBundlerClient ? request.customBundlerClient : defaultClient;

      let accountApi = request.customAccountApi ? request.customAccountApi : defaultAccountApi;

      if (!client) {
        throw new BundlerClientNotFoundError();
      }

      const userOp = await createUserOperation({
        target: request.target!,
        encodedData: request.encodedTxData!,
        accountApi,
        value: request.value,
      });

      if (!userOp) {
        throw new NoSignatureFound();
      }

      const _method = request.method || 'sendUserOperation';

      try {
        const { status, hash } = await client.request(_method, {
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
          throw new Error(status);
        } else {
          log(accountApi?.cachedNonce, 'cached nonce');
          accountApi?.cachedNonce && accountApi.increaseNonce();
          log(accountApi?.cachedNonce, 'cached nonce updated');
        }

        return { status, hash };
      } catch (e: any) {
        log('request error', e);

        throw new BundlerRequestError(e.message);
      }
    },
  });
};
