import { useMutation } from '@tanstack/react-query';
import superjson from 'superjson';
import { Address, Hex, WalletClient } from 'viem';
import { useWalletClient } from 'wagmi';

import { MutationHook } from '../../utils/types';
import { BundlerClientNotFoundError } from '../transaction/error';
import { useBundlerClient, WinrBundlerClient } from '../use-bundler-client';

export type SupportedHours = 1 | 4 | 8 | 12 | 24;

const getHoursInMs = (hours: SupportedHours) => hours * 60 * 60 * 1000;

export interface CreateSessionRequest {
  customClient?: WinrBundlerClient;
  customWalletClient?: WalletClient;
  untilInHours: SupportedHours;
  signerAddress: Address;
}

export const useCreateSession: MutationHook<CreateSessionRequest, { permit: Hex; part: Hex }> = (
  options = {}
) => {
  const { client: defaultClient } = useBundlerClient();

  const { data: defaultWalletClient } = useWalletClient();

  return useMutation({
    mutationFn: async (request) => {
      const client = request.customClient ?? defaultClient;

      if (!client) {
        throw new BundlerClientNotFoundError();
      }

      const walletClient = request.customWalletClient ?? defaultWalletClient;

      if (!walletClient) {
        throw new Error('Wallet client not found');
      }

      const response = await client.request('createSession', {
        owner: request.signerAddress,
        until: Date.now() + getHoursInMs(request.untilInHours),
      });

      if (response?.status !== 'success') {
        throw new Error('Failed to create session');
      }

      const { typedMessage } = await client.request('permitTypedMessage', {
        owner: request.signerAddress,
      });

      const parsedMessage = superjson.parse<Hex>(typedMessage);

      const userPermission = await walletClient.signTypedData(parsedMessage as any);

      const userKeys = await client.request('permit', {
        owner: request.signerAddress,
        signature: userPermission as Hex,
      });

      return {
        permit: userPermission as Hex,
        part: userKeys.hashKey,
      };
    },
    ...options,
  });
};
