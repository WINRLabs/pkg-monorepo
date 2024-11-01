import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { MutationHook } from '../../utils/types';
import { useBundlerClient, WinrBundlerClient } from '../use-bundler-client';
import { stringifyAndEncrypt } from './lib';
import { useSessionStore } from './session.store';

interface UseUnauthorizeRequest {
  customBundlerClient?: WinrBundlerClient<'v2'>;
}

export const useUnauthorize: MutationHook<UseUnauthorizeRequest, { status: string }> = (
  options = {}
) => {
  const { client: defaultBundlerClient } = useBundlerClient<'v2'>();

  const [publicKey, pin] = useSessionStore(useShallow((state) => [state.publicKey, state.pin]));

  return useMutation({
    ...options,
    mutationFn: async (request) => {
      const client = request.customBundlerClient || defaultBundlerClient;

      if (!client) throw new Error('Bundler client not found');

      if (!publicKey) throw new Error('Public key not found');

      if (!pin) throw new Error('Pin not found');

      const nonceResponse = await client?.request('getNonce', {});

      const message = await stringifyAndEncrypt(publicKey, {
        nonce: nonceResponse.nonce,
        password: pin,
      });

      const response = await client?.request('unauthorize', { message });

      return response as { status: string };
    },
  });
};
