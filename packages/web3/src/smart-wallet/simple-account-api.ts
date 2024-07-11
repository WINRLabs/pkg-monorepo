// @ts-nocheck
import { Address, encodeFunctionData, toBytes, WalletClient } from 'viem';
import { Hex } from 'viem';

import simpleAccountAbi from './abis/simple-account-abi';
import simpleAccountFactoryAbi from './abis/simple-account-factory-abi';
import { BaseAccountAPI, BaseApiParams, FactoryParams } from './base-account-api';

/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface SimpleAccountApiParams extends BaseApiParams {
  owner: WalletClient;
  factoryAddress?: Address;
  index?: bigint;
}

/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class SimpleAccountAPI extends BaseAccountAPI {
  cachedNonce = 0n;
  factoryAddress?: Address;
  owner: WalletClient;
  index: bigint;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  //   accountContract?: SimpleAccount

  //   factory?: SimpleAccountFactory

  constructor(params: SimpleAccountApiParams) {
    super(params);

    this.factoryAddress = params.factoryAddress;

    this.owner = params.owner;

    this.index = params.index ?? 0n;
  }

  //   async _getAccountContract (): Promise<SimpleAccount> {
  //     if (this.accountContract == null) {
  //       this.accountContract = SimpleAccount__factory.connect(await this.getAccountAddress(), this.provider)
  //     }
  //     return this.accountContract
  //   }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getFactoryData(): Promise<FactoryParams | null> {
    return {
      factory: this.factoryAddress,
      factoryData: encodeFunctionData({
        abi: simpleAccountFactoryAbi,
        functionName: 'createAccount',
        args: [this.owner.account.address, this.index],
      }),
    };
  }

  async getNonce(): Promise<bigint> {
    if (await this.checkAccountPhantom()) {
      return 0n;
    }

    // if (this.cachedNonce != 0n) {
    //   return this.cachedNonce;
    // }

    return (this.cachedNonce = await this.provider.readContract({
      address: await this.getAccountAddress(),
      abi: simpleAccountAbi,
      functionName: 'getNonce',
    }));
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  encodeExecute(target: Address, value: bigint, data: Hex): Hex {
    return encodeFunctionData({
      abi: simpleAccountAbi,
      functionName: 'execute',
      args: [target, value, data],
    });
  }

  async signUserOpHash(userOpHash: Hex): Promise<Hex> {
    return await this.owner.signMessage({
      message: { raw: toBytes(userOpHash) },
    });
  }
}
