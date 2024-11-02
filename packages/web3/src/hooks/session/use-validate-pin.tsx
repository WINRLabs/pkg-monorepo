import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { MutationHook } from '../../utils/types';
import { useBundlerClient, WinrBundlerClient } from '../use-bundler-client';
import { getHashedPassword, stringifyAndEncrypt } from './lib';
import { useSessionStore } from './session.store';

interface UseValidatePinRequest {
  pin: string;
  customBundlerClient?: WinrBundlerClient<'v1' | 'v2'>;
}

export const useValidatePin: MutationHook<UseValidatePinRequest, { message: string }> = (
  options = {}
) => {
  const { client: defaultBundlerClient } = useBundlerClient<'v1' | 'v2'>();

  const setPin = useSessionStore(useShallow((state) => state.setPin));

  const publicKey = useSessionStore(useShallow((state) => state.publicKey));

  return useMutation({
    ...options,
    mutationFn: async (request: UseValidatePinRequest) => {
      const client = request.customBundlerClient || defaultBundlerClient;
      if (!client) throw new Error('Bundler client not found');

      if (!publicKey) throw new Error('Public key not found');

      const nonceResponse = await client.request('getNonce', {});

      const _pin = getHashedPassword(request.pin);

      await client?.request('getAddress', {
        message: await stringifyAndEncrypt(publicKey, {
          password: _pin,
          nonce: nonceResponse.nonce,
        }),
      });

      setPin(_pin);

      return {
        message: 'success',
      };
    },
  });
};
