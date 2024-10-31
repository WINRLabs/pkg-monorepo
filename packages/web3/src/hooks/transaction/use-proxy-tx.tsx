import { useMutation } from '@tanstack/react-query';
import { Hex } from 'viem';

import { MutationHook } from '../../utils/types';
import { useSessionStore } from '../session';
import {
  getHashedPassword,
  HubErrorCode,
  HubErrorMessage,
  stringifyAndEncrypt,
} from '../session/lib';
import { useBundlerClient } from '../use-bundler-client';
import { BundlerClientNotFoundError } from './error';
import { Web3AccountTxRequest } from './types';

export const useProxyAccountTx: MutationHook<
  Web3AccountTxRequest,
  { status: string; hash: Hex }
> = (options = {}) => {
  const { client: defaultClient } = useBundlerClient();
  const sessionStore = useSessionStore();

  return useMutation({
    ...options,
    mutationFn: async ({ customBundlerClient, target = '0x0', encodedTxData = '0x0', value }) => {
      const client = customBundlerClient || defaultClient;
      if (!client) throw new BundlerClientNotFoundError();

      const publicKey = sessionStore.publicKey;

      if (!sessionStore.pin) {
        return {
          hash: '0x0',
          status: 'Enter pin',
        };
      }

      if (!publicKey) {
        return {
          hash: '0x0',
          status: 'Enter pin',
        };
      }

      const password = getHashedPassword(sessionStore.pin);

      const { nonce } = await client.request('getNonce', {});

      const message = await stringifyAndEncrypt(publicKey, {
        call: {
          dest: target,
          data: encodedTxData,
          value: value ? (value.toString() as any) : '0',
        },
        password,
        nonce,
      });
      try {
        const req = await client.request('sendTransactionByProxy', {
          message,
        });

        return req;
      } catch (error: any) {
        if (error?.message?.includes(HubErrorMessage[HubErrorCode['InvalidSimpleAccountNonce']])) {
          const nonceResponse = await client.request('getNonce', {});
          sessionStore.setCachedNonce(nonceResponse.nonce);

          return await client.request('sendTransactionByProxy', {
            message,
          });
        } else {
          throw error;
        }
      }
    },
  });
};
