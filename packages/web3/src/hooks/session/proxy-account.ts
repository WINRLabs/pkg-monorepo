/* import Debug from 'debug';
import { Address, Hash, Hex, PrivateKeyAccount } from 'viem';
import { BundlerNetwork, fetchBundlerClient, WinrBundlerClient } from '../use-bundler-client';
import { decrypt, encrypt, generateKeyPair, HubErrorCode, HubErrorMessage } from './lib';
import { parse, stringify } from 'superjson';
import { RpcClient } from './rpc-client';

const debug = Debug('ProxyAccount');

export type Options = {
  url: string;
  network: string;
  password: Hash;
  signer: PrivateKeyAccount;
  serverPublicKey: string;
  sessionPublicKey?: string;
  clientKeyPair?: {
    privateKey: string;
    publicKey: string;
  };
};

export class ProxyAccount {
  private clientKeyPair: Options['clientKeyPair'];
  private client: RpcClient | undefined;
  private nonce = 0;
  private sessionPublicKey: string;

  constructor(private options: Options) {
    this.sessionPublicKey = this.options.sessionPublicKey ?? this.options.serverPublicKey;
    this.clientKeyPair = this.options.clientKeyPair;
    this.createClient();
  }

  private async createClient() {
    this.client = new RpcClient(async (request) => {
      try {
        const response = await fetch(this.options.url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            network: this.options.network,
            'x-owner': this.options.signer.address,
          },
          body: JSON.stringify(request),
        });

        return await response.json();
      } catch (err) {
        return err;
      }
    });
  }

  private async createKeyPair() {
    this.clientKeyPair = await generateKeyPair();
  }

  private async decryptAndParse<T>(message: string): Promise<T> {
    if (!this.clientKeyPair) {
      throw new Error('Client keypair not found');
    }

    return parse(await decrypt(this.clientKeyPair.privateKey, message));
  }

  private async stringifyAndEncrypt(message: { [key: string]: any }) {
    return encrypt(this.sessionPublicKey, stringify(message));
  }

  async getAddress() {
    const response = await this.client?.request('getAddress', {
      message: await this.stringifyAndEncrypt({
        password: this.options.password,
        nonce: this.nonce,
      }),
    });

    const data = (await this.decryptAndParse(response?.message as string)) as { address: Address };

    return data.address;
  }

  async getNonce() {
    const response = await this.client?.request('getNonce', {});

    console.log('nonce', response?.nonce);

    return response?.nonce;
  }

  private async setNonce() {
    this.nonce = (await this.getNonce()) ?? 0;
    console.log('nonce', this.nonce);

    console.log('SetNonce=%s', this.nonce);
  }

  private increaseNonce() {
    this.nonce++;
  }

  wrap = async <T extends Awaited<ReturnType<F>>, F extends (nonce: number) => Promise<unknown>>(
    fn: F
  ): Promise<T> => {
    let attempt = 0;
    let response: any;

    while (attempt < 3) {
      try {
        response = (await fn(this.nonce)) as T;
        break;
      } catch (err: any) {
        if (!err?.type || err.type !== 'hub' || err.code !== HubErrorCode.InvalidSimpleAccountNonce) {
          throw err;
        }

        debug('CurrentNonce=%s,Attempt=%s,Error=%s,', this.nonce, attempt, err);
        await this.setNonce();
      }

      attempt++;
    }

    this.increaseNonce();

    return response as T;
  };

  private async handshake() {
    if (!this.clientKeyPair) {
      throw new Error('Client keypair not found');
    }

    const response = await this.client?.request('handshake', {
      message: await this.stringifyAndEncrypt({
        owner: this.options.signer.address,
        publicKey: this.clientKeyPair.publicKey,
      }),
    });

    const { publicKey } = await this.decryptAndParse<{ publicKey: string }>(
      response?.message as string
    );

    return publicKey;
  }

  private async getPermitMessage() {
    const response = await this.client?.request('permitTypedMessage', {
      message: await this.stringifyAndEncrypt({
        password: this.options.password,
        nonce: this.nonce,
      }),
    });

    return this.decryptAndParse(response?.message as string);
  }

  private async authorize(signature: Hash): Promise<{ status: string }> {
    const response = await this.wrap(async (nonce) => {
      console.log({
        nonce,
        password: this.options.password,
        signature,
      });

      return this.client?.request('authorize', {
        message: await this.stringifyAndEncrypt({
          nonce,
          password: this.options.password,
          signature,
        }),
      });
    });

    return this.decryptAndParse(response?.message as string);
  }

  async sendTransaction(call: {
    dest: Address;
    value: string;
    data: Hash;
  }): Promise<{ hash: Hex; status: string }> {
    debug('transaction sending');
    const response = await this.wrap(async (nonce) =>
      this.client?.request('sendTransactionByProxy', {
        message: await this.stringifyAndEncrypt({ call, password: this.options.password, nonce }),
      })
    );
    debug('transaction send');

    return this.decryptAndParse(response?.status as string);
  }

  async unauthorize(): Promise<{ status: string }> {
    const response = await this.wrap(async (nonce) =>
      this.client?.request('unauthorize', {
        message: await this.stringifyAndEncrypt({
          nonce,
          password: this.options.password,
        }),
      })
    );

    return this.decryptAndParse(response?.status as string);
  }

  async login() {
    this.nonce = (await this.client?.request('getNonce', {}))?.nonce ?? 0;
    console.log('nonce', this.nonce);

    debug('logging in');
    await this.createKeyPair();
    debug('keypair created');
    this.sessionPublicKey = await this.handshake();
    debug('handshaked');
    const permitMessage = await this.getPermitMessage();
    debug('message fetched');
    const signature = await this.options.signer.signTypedData(permitMessage as any);
    debug('signed');

    await this.authorize(signature);
    debug('authorized');

    return {
      sessionPublicKey: this.sessionPublicKey,
      clientKeyPair: this.clientKeyPair,
    };
  }
}
 */
