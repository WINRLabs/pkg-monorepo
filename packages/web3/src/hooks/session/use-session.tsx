import { useMutation } from '@tanstack/react-query';
import debug from 'debug';
import superjson from 'superjson';
import { Address, Hex, keccak256, WalletClient } from 'viem';
import { useWalletClient } from 'wagmi';

import { MutationHook } from '../../utils/types';
import { BundlerClientNotFoundError } from '../transaction/error';
import { useBundlerClient, WinrBundlerClient } from '../use-bundler-client';
import { decryptAndParse, generateKeyPair, getHashedPassword, stringifyAndEncrypt } from './lib';
import { useSessionStore } from './session.store';

const log = debug('worker:UseSession');

// const crypto = new Crypto();

export type SupportedHours = 1 | 4 | 8 | 12 | 24;

const serverPublicKey =
  '7b226b6579223a7b226b7479223a22525341222c226e223a2273786d48637336626166685f4d516d4a5a6841715147666a50466e70572d3670536f5a43424b4765736277746145475074654841614f4e30634273703346624b576172566d747545575a547362637846504273776b55736f6141355f6a53492d6352514c34464d6331314941385745724e69786a68646e68655475746f684b576e4c574a617766593965694231456f72495a784c6679514b32435359685539767738306c77486236736b4d44505a336f554e53434f76434264765a726b463568696b736a6f2d716d6f532d76554f415a5a537243734b504651566656526b362d6a436f6161704845726e635749636953706978345f704c42433041426268617a414e7759335844503065677a7455374c555a7a332d634e7a6f59637248335f736a5669724553695637312d48764947426459502d70766c426256644b4c56422d5071324f6c33354d41416b3148536575486732447a51222c2265223a2241514142227d2c22666f726d6174223a226a776b227d';

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

      const _pin = sessionStore.pin || request.pin;

      if (!sessionStore.pin) {
        sessionStore.setPin(request.pin);
      }

      const pin = getHashedPassword(_pin);

      if (!client) {
        throw new BundlerClientNotFoundError();
      }

      const walletClient = request.customWalletClient ?? defaultWalletClient;

      if (!walletClient) {
        throw new Error('Wallet client not found');
      }

      console.log('request', request);

      const message = await stringifyAndEncrypt(serverPublicKey, {
        owner: request.signerAddress,
        publicKey: clientKeyPair.publicKey,
      });

      console.log(message, 'message');

      const response = await client.request('handshake', {
        message,
      });

      console.log(response, 'response handshake');

      const { publicKey: sessionPublicKey } = await decryptAndParse<{ publicKey: string }>(
        clientKeyPair.privateKey,
        response.message as string
      );

      sessionStore.setPublicKey(sessionPublicKey);

      const nonceResponse = await client.request('getNonce', {});

      sessionStore.setCachedNonce(nonceResponse.nonce);

      const _message = await stringifyAndEncrypt(sessionPublicKey, {
        password: pin,
        nonce: nonceResponse.nonce,
      });

      console.log(_message, 'message');

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
          password: pin,
          signature,
        }),
      });

      return {
        message: authResponse.message,
        status: authResponse.status,
      };
    },

    ...options,
  });
};
