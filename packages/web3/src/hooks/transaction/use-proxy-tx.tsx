import { useMutation } from '@tanstack/react-query';
import { Hex } from 'viem';
import { useShallow } from 'zustand/react/shallow';

import { MutationHook } from '../../utils/types';
import { useSessionStore } from '../session';
import { HubError, HubErrorCode, HubErrorMessage, stringifyAndEncrypt } from '../session/lib';
import { useBundlerClient } from '../use-bundler-client';
import { BundlerClientNotFoundError } from './error';
import { Web3AccountTxRequest } from './types';

export const useProxyAccountTx: MutationHook<
  Web3AccountTxRequest,
  { status: string; hash: Hex }
> = (options = {}) => {
  const { client: defaultClient } = useBundlerClient();
  const [pin, publicKey] = useSessionStore(useShallow((state) => [state.pin, state.publicKey]));

  return useMutation({
    ...options,
    mutationFn: async ({ customBundlerClient, target = '0x0', encodedTxData = '0x0', value }) => {
      const client = customBundlerClient || defaultClient;
      if (!client) throw new BundlerClientNotFoundError();

      if (!pin) {
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

      const { nonce } = await client.request('getNonce', {});

      const message = await stringifyAndEncrypt(publicKey, {
        call: {
          dest: target,
          data: encodedTxData,
          value: value ? (value.toString() as any) : '0',
        },
        password: pin,
        nonce,
      });
      try {
        const req = await client.request('sendTransactionByProxy', {
          message,
        });

        return req;
      } catch (error: unknown) {
        const _error = error as HubError;

        if (_error?.message?.includes(HubErrorMessage[HubErrorCode['InvalidSimpleAccountNonce']])) {
          const nonceResponse = await client.request('getNonce', {});

          const newMessage = await stringifyAndEncrypt(publicKey, {
            call: {
              dest: target,
              data: encodedTxData,
              value: value ? (value.toString() as any) : '0',
            },
            password: pin,
            nonce: nonceResponse.nonce,
          });

          return await client.request('sendTransactionByProxy', {
            message: newMessage,
          });
        } else {
          throw error;
        }
      }
    },
  });
};
