import { useMutation } from '@tanstack/react-query';
import debug from 'debug';
import superjson from 'superjson';
import { Address, Hex, WalletClient } from 'viem';
import { useWalletClient } from 'wagmi';

import { MutationHook } from '../../utils/types';
import { BundlerClientNotFoundError } from '../transaction/error';
import { useBundlerClient, WinrBundlerClient } from '../use-bundler-client';
import { serverPublicKey } from './constants';
import { decryptAndParse, generateKeyPair, getHashedPassword, stringifyAndEncrypt } from './lib';
import { useSessionStore } from './session.store';
import { delay } from '../use-token-allowance';

const log = debug('worker:UseSession');

export type SupportedHours = 1 | 4 | 8 | 12 | 24;

type PermitMessage = {
  domain: {
    chainId: number;
    verifyingContract: Address;
    name: string;
    version: string;
  };
  types: {
    Permit: [
      { name: 'authorizedAddress'; type: 'address' },
      { name: 'verifyingContract'; type: 'address' },
      { name: 'nonce'; type: 'uint256' },
      { name: 'until'; type: 'uint256' },
    ];
  };
  primaryType: 'Permit';
  message: {
    verifyingContract: Address;
    authorizedAddress: Address;
    nonce: bigint;
    until: bigint;
  };
};

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

      log(typedMessage, 'typed message');

      const parsedMessage = superjson.parse<PermitMessage>(typedMessage);

      if (
        !parsedMessage.message ||
        !parsedMessage.domain ||
        !parsedMessage.types ||
        !parsedMessage.message.authorizedAddress
      ) {
        throw new Error('Invalid message');
      }

      log(parsedMessage, 'parsed message');

      const userPermission = await walletClient.signTypedData({
        account: request.signerAddress,
        types: parsedMessage.types,
        primaryType: parsedMessage.primaryType,
        message: parsedMessage.message,
        domain: parsedMessage.domain,
      });

      log(userPermission, 'user permission');

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

export interface CreateSessionRequestV2 {
  customClient?: WinrBundlerClient<'v2'>;
  customWalletClient?: WalletClient;
  signerAddress: Address;
  pin: string;
}

export const useCreateSessionV2: MutationHook<
  CreateSessionRequestV2,
  { message: string; status: string }
> = (options = {}) => {
  const { client: defaultClient } = useBundlerClient<'v2'>();

  const { data: defaultWalletClient } = useWalletClient();

  const sessionStore = useSessionStore();

  return useMutation({
    mutationFn: async (request) => {
      const client = request.customClient ?? defaultClient;

      const clientKeyPair = await generateKeyPair();

      const hashedPin = getHashedPassword(request.pin);

      if (!client) {
        throw new BundlerClientNotFoundError();
      }

      const walletClient = request.customWalletClient ?? defaultWalletClient;

      if (!walletClient) {
        throw new Error('Wallet client not found');
      }

      const message = await stringifyAndEncrypt(serverPublicKey, {
        owner: request.signerAddress,
        publicKey: clientKeyPair.publicKey,
      });

      const response = await client.request('handshake', {
        message,
      });

      const { publicKey: sessionPublicKey } = await decryptAndParse<{ publicKey: string }>(
        clientKeyPair.privateKey,
        response.message as string
      );

      const nonceResponse = await client.request('getNonce', {});

      const _message = await stringifyAndEncrypt(sessionPublicKey, {
        password: hashedPin,
        nonce: nonceResponse.nonce,
      });

      const permitTypedMessageResponse = await client.request('permitTypedMessage', {
        message: _message,
      });

      const permitMessage = await decryptAndParse<PermitMessage>(
        clientKeyPair.privateKey,
        permitTypedMessageResponse.message as string
      );

      const signature = await walletClient.signTypedData({
        account: request.signerAddress,
        types: permitMessage.types,
        primaryType: permitMessage.primaryType,
        message: permitMessage.message,
        domain: permitMessage.domain,
      });

      const authResponse = await client.request('authorize', {
        message: await stringifyAndEncrypt(sessionPublicKey, {
          nonce: nonceResponse.nonce,
          password: hashedPin,
          signature,
        }),
      });

      sessionStore.setSessionCreatedAt(Date.now());


      sessionStore.setCachedNonce(nonceResponse.nonce);

      sessionStore.setPublicKey(sessionPublicKey);

      sessionStore.setPin(hashedPin);

      return {
        message: authResponse.message,
        status: authResponse.status,
      };
    },

    ...options,
  });
};
