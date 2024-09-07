import { useMutation } from '@tanstack/react-query';
import { Hex, SwitchChainError } from 'viem';
import { useSwitchChain } from 'wagmi';

import { MutationHook } from '../../utils/types';
import { useBundlerClient } from '../use-bundler-client';
import { useCurrentAccount } from '../use-current-address';
import { SendTxRequest } from './types';
import { useSocialAccountTx } from './use-social-account-tx';
import { useWeb3AccountTx } from './use-web3-account-tx';

export const useSendTx: MutationHook<SendTxRequest, { status: string; hash: Hex }> = (
  options = {}
) => {
  const { isSocialLogin } = useCurrentAccount();

  const { mutateAsync: sendSocialAccountTx } = useSocialAccountTx();

  const { mutateAsync: sendWeb3AccountTx } = useWeb3AccountTx();

  const { switchChainAsync } = useSwitchChain();

  const { globalChainId } = useBundlerClient();

  return useMutation({
    ...options,
    mutationFn: async (request) => {
      const {
        method,
        target,
        encodedTxData,
        customAccountApi,
        value,
        customBundlerClient,
        enforceSign,
      } = request;

      const networkId = request.networkId || globalChainId || 777777;

      if (isSocialLogin) {
        return await sendSocialAccountTx({
          target,
          customAccountApi,
          customBundlerClient,
          encodedTxData,
          method,
          value,
        });
      } else {
        try {
          await switchChainAsync({ chainId: networkId! });
        } catch (error) {
          throw new SwitchChainError(error as Error);
        }

        return await sendWeb3AccountTx({
          customAccountApi,
          customBundlerClient,
          target,
          encodedTxData,
          value,
          enforceSign,
        });
      }
    },
  });
};
