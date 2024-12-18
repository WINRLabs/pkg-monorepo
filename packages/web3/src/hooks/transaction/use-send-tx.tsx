import { useMutation } from '@tanstack/react-query';
import { Hex, SwitchChainError } from 'viem';
import { useSwitchChain } from 'wagmi';

import { MutationHook } from '../../utils/types';
import { useBundlerClient } from '../use-bundler-client';
import { useCurrentAccount } from '../use-current-address';
import { SendTxRequest } from './types';
import { useSocialAccountTx } from './use-social-account-tx';
import { useWeb3AccountTx } from './use-web3-account-tx';
import { useProxyAccountTx } from './use-proxy-tx';
import { useSessionStore } from '../session';

export const useSendTx: MutationHook<SendTxRequest, { status: string; hash: Hex }> = (
  options = {}
) => {
  const { isSocialLogin } = useCurrentAccount();

  const { mutateAsync: sendSocialAccountTx } = useSocialAccountTx();

  const { mutateAsync: sendWeb3AccountTx } = useWeb3AccountTx();

  const { mutateAsync: sendProxyTx } = useProxyAccountTx();

  const { switchChainAsync } = useSwitchChain();

  const {
    globalChainId,
    bundlerVersion: globalBundlerVersion,
    onPinNotFound,
  } = useBundlerClient<'v1' | 'v2'>();

  const sessionStore = useSessionStore();

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
        customBundlerVersion,
        isBridgeRequest = false,
      } = request;

      const networkId = request.networkId || globalChainId || 777777;

      const bundlerVersion = customBundlerVersion || globalBundlerVersion;

      if (isSocialLogin || isBridgeRequest) {
        return await sendSocialAccountTx({
          target,
          customAccountApi,
          customBundlerClient,
          encodedTxData,
          method: bundlerVersion === 'v2' ? 'sendUserOperation' : method,
          networkId,
          value,
          customVerificationGasLimit: request.customVerificationGasLimit,
          customCallGasLimit: request.customCallGasLimit,
        });
      } else {
        try {
          await switchChainAsync({ chainId: networkId! });
        } catch (error) {
          throw new SwitchChainError(error as Error);
        }

        if (bundlerVersion === 'v2') {
          if (!sessionStore.pin || !localStorage['session-store']) {
            onPinNotFound?.();

            return { status: 'pin not found', hash: '0x0' };
          }
          return await sendProxyTx({
            customAccountApi,
            customBundlerClient,
            target,
            encodedTxData,
            value,
            enforceSign,
          });
        } else {
          return await sendWeb3AccountTx({
            customAccountApi,
            customBundlerClient,
            target,
            encodedTxData,
            value,
            enforceSign,
          });
        }
      }
    },
  });
};
