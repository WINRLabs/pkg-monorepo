import { useMutation } from '@tanstack/react-query';
import { Address, Hex } from 'viem';

import { ErrorCode, mmAuthSignErrors, mmAuthSessionErr } from '../../utils/error-codes';
import { MutationHook } from '../../utils/types';
import { useCreateSession, useSessionStore } from '../session';
import { useBundlerClient } from '../use-bundler-client';
import { useCurrentAccount } from '../use-current-address';
import { BundlerClientNotFoundError } from './error';
import { Web3AccountTxRequest } from './types';
import { delay } from '../use-token-allowance';

export const useWeb3AccountTx: MutationHook<Web3AccountTxRequest, { status: string; hash: Hex }> = (
  options = {}
) => {
  const { client: defaultClient } = useBundlerClient();
  const { rootAddress: userAddress } = useCurrentAccount();
  const sessionStore = useSessionStore();
  const createSession = useCreateSession();

  return useMutation({
    ...options,
    mutationFn: async ({
      customBundlerClient,
      target = '0x0',
      encodedTxData = '0x0',
      value = 0,
    }) => {
      const client = customBundlerClient || defaultClient;
      if (!client) throw new BundlerClientNotFoundError();

      let _part = sessionStore.part;
      let _permit = sessionStore.permit;

      const getNewSession = async () => {
        const session = await createSession.mutateAsync({
          customClient: client,
          signerAddress: userAddress!,
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
          return await client.request('call', {
            call: {
              dest: target as Address,
              data: encodedTxData,
              value: Number(value),
            },
            owner: userAddress!,
            part: _part ?? '0x',
            permit: _permit ?? '0x',
          });
        } catch (error: any) {
          if (retryCount < maxRetries) {
            retryCount++;

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
            throw error;
          }
        }
      };

      return makeRequest();
    },
  });
};
