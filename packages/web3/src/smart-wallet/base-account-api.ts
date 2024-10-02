// @ts-nocheck
// import { ethers, BigNumber, BigNumberish, BytesLike } from 'ethers'
// import { Provider } from '@ethersproject/providers'

import {
  Address,
  decodeAbiParameters,
  EstimateFeesPerGasReturnType,
  Hex,
  parseAbiParameters,
  PublicClient,
  zeroAddress,
} from 'viem';

import { calcPreVerificationGas, GasOverheads } from './calc-pre-verification-gas';
import { encodeUserOp, getUserOpHash, UserOperation } from './erc4337-utils'; // IEntryPoint, IEntryPoint__factory,
// import { defaultAbiCoder } from 'ethers/lib/utils'
import { PaymasterAPI } from './paymaster-api';
import { TransactionDetailsForUserOp } from './transaction-details-for-user-op';
import debug from 'debug';

const log = debug('worker:BaseAccountApi');

export interface FactoryParams {
  factory: Address;
  factoryData?: Hex;
}

export interface BaseApiParams {
  provider: PublicClient;
  entryPointAddress: Address;
  accountAddress?: Address;
  overheads?: Partial<GasOverheads>;
  paymasterAPI?: PaymasterAPI;
}

export interface UserOpResult {
  transactionHash: Hex;
  success: boolean;
}

/**
 * Base class for all Smart Wallet ERC-4337 Clients to implement.
 * Subclass should inherit 5 methods to support a specific wallet contract:
 *
 * - getAccountInitCode - return the value to put into the "initCode" field, if the account is not yet deployed. should create the account instance using a factory contract.
 * - getNonce - return current account's nonce value
 * - encodeExecute - encode the call from entryPoint through our account to the target contract.
 * - signUserOpHash - sign the hash of a UserOp.
 *
 * The user can use the following APIs:
 * - createUnsignedUserOp - given "target" and "calldata", fill userOp to perform that operation from the account.
 * - createSignedUserOp - helper to call the above createUnsignedUserOp, and then extract the userOpHash and sign it
 */
export abstract class BaseAccountAPI {
  private senderAddress!: Address;
  private feeData: EstimateFeesPerGasReturnType = {
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
  };
  private feeDataPollingInterval: number = 30 * 1000;
  private isPhantom = true;
  // entryPoint connected to "zero" address. allowed to make static calls (e.g. to getSenderAddress)
  //   private readonly entryPointView: IEntryPoint

  provider: PublicClient;
  chainId: bigint;
  overheads?: Partial<GasOverheads>;
  entryPointAddress: Address;
  accountAddress?: Address;
  paymasterAPI?: PaymasterAPI;

  /**
   * base constructor.
   * subclass SHOULD add parameters that define the owner (signer) of this wallet
   */
  protected constructor(params: BaseApiParams) {
    this.provider = params.provider;
    this.overheads = params.overheads;
    this.entryPointAddress = params.entryPointAddress;
    this.accountAddress = params.accountAddress;
    this.paymasterAPI = params.paymasterAPI;

    // factory "connect" define the contract address. the contract "connect" defines the "from" address.
    // this.entryPointView = IEntryPoint__factory.connect(params.entryPointAddress, params.provider).connect(ethers.constants.AddressZero)

    this.collectFeeData();
    this.setChainId();
  }

  private async setChainId() {
    this.chainId = BigInt(await this.provider.getChainId());
  }

  async init(): Promise<this> {
    if ((await this.provider.getBytecode({ address: this.entryPointAddress })) === '0x') {
      throw new Error(`entryPoint not deployed at ${this.entryPointAddress}`);
    }

    await this.getAccountAddress();
    return this;
  }

  /**
   * return the value to put into the "factory" and "factoryData", when the contract is not yet deployed.
   */
  abstract getFactoryData(): Promise<FactoryParams | null>;

  /**
   * return current account's nonce.
   */
  abstract getNonce(): Promise<bigint>;

  /**
   * encode the call from entryPoint through our account to the target contract.
   * @param target
   * @param value
   * @param data
   */
  abstract encodeExecute(target: Hex, value: bigint, data: Hex): Hex;

  /**
   * sign a userOp's hash (userOpHash).
   * @param userOpHash
   */
  abstract signUserOpHash(userOpHash: Hex): Promise<Hex>;

  /**
   * check if the contract is already deployed.
   */
  async checkAccountPhantom(): Promise<boolean> {
    if (!this.isPhantom) {
      // already deployed. no need to check anymore.
      return this.isPhantom;
    }
    const senderAddressCode = await this.provider.getBytecode({
      address: await this.getAccountAddress(),
    });
    if (senderAddressCode && senderAddressCode?.length > 2) {
      this.isPhantom = false;
    }
    return this.isPhantom;
  }

  /**
   * calculate the account address even before it is deployed
   */
  async getCounterFactualAddress(): Promise<Address> {
    const { factory, factoryData } = (await this.getFactoryData()) ?? {};
    if (factory == null) {
      throw new Error('no counter factual address if not factory');
    }
    // use entryPoint to query account address (factory can provide a helper method to do the same, but
    // this method attempts to be generic
    const retAddr = await this.provider.call({
      to: factory,
      data: factoryData,
    });

    const [addr] = decodeAbiParameters(parseAbiParameters('address'), retAddr.data as Address);
    return addr as Address;
  }

  /**
   * return initCode value to into the UserOp.
   * (either factory and factoryData, or null hex if contract already deployed)
   */
  async getRequiredFactoryData(): Promise<FactoryParams | null> {
    if (await this.checkAccountPhantom()) {
      return await this.getFactoryData();
    }
    return null;
  }

  /**
   * return maximum gas used for verification.
   * NOTE: createUnsignedUserOp will add to this value the cost of creation, if the contract is not yet created.
   */
  async getVerificationGasLimit(): Promise<bigint> {
    return 100000n;
  }

  /**
   * should cover cost of putting calldata on-chain, and some overhead.
   * actual overhead depends on the expected bundle size
   */
  async getPreVerificationGas(userOp: Partial<UserOperation>): Promise<bigint> {
    return calcPreVerificationGas(userOp, this.overheads);
  }

  /**
   * ABI-encode a user operation. used for calldata cost estimation
   */
  encodeUserOP(userOp: UserOperation): Hex {
    return encodeUserOp(userOp, false);
  }

  async encodeUserOpCallDataAndGasLimit(
    detailsForUserOp: TransactionDetailsForUserOp
  ): Promise<{ callData: Hex; callGasLimit: bigint }> {
    function parseNumber(a: any): bigint | null {
      if (a == null || a === '') return null;
      return BigInt(a);
    }

    const value = parseNumber(detailsForUserOp.value) ?? 0n;
    const callData = this.encodeExecute(detailsForUserOp.target, value, detailsForUserOp.data);

    const to = await this.getAccountAddress();

    const callGasLimit = 0n;

    return {
      callData,
      callGasLimit,
    };
  }

  /**
   * return userOpHash for signing.
   * This value matches entryPoint.getUserOpHash (calculated off-chain, to avoid a view call)
   * @param op userOperation, (signature field ignored)
   */
  async getUserOpHash(op: UserOperation): Promise<Hex> {
    return getUserOpHash(op, this.entryPointAddress, this.chainId);
  }

  /**
   * return the account's address.
   * this value is valid even before deploying the contract.
   */
  async getAccountAddress(): Promise<Address> {
    if (this.senderAddress == null) {
      if (this.accountAddress != null) {
        this.senderAddress = this.accountAddress;
      } else {
        this.senderAddress = await this.getCounterFactualAddress();
      }
    }
    return this.senderAddress;
  }

  async estimateCreationGas(factoryParams: FactoryParams | null): Promise<bigint> {
    if (factoryParams == null) {
      return 0n;
    }
    return await this.provider.estimateGas({
      to: factoryParams.factory,
      account: zeroAddress,
      data: factoryParams.factoryData,
    });
  }

  async collectFeeData() {
    this.feeData = await this.provider.estimateFeesPerGas();

    setTimeout(() => this.collectFeeData(), this.feeDataPollingInterval);
  }

  /**
   * create a UserOperation, filling all details (except signature)
   * - if account is not yet created, add initCode to deploy it.
   * - if gas or nonce are missing, read them from the chain (note that we can't fill gaslimit before the account is created)
   * @param info
   */
  async createUnsignedUserOp(info: TransactionDetailsForUserOp): Promise<UserOperation> {
    const { callData, callGasLimit } = await this.encodeUserOpCallDataAndGasLimit(info);
    const factoryParams = await this.getRequiredFactoryData();

    const initGas = await this.estimateCreationGas(factoryParams);
    const verificationGasLimit = (await this.getVerificationGasLimit()) + initGas;

    let { maxFeePerGas, maxPriorityFeePerGas } = info;
    if (maxFeePerGas == null || maxPriorityFeePerGas == null) {
      if (maxFeePerGas == null) {
        maxFeePerGas = this.feeData.maxFeePerGas ?? undefined;
      }
      if (maxPriorityFeePerGas == null) {
        maxPriorityFeePerGas = this.feeData.maxPriorityFeePerGas ?? undefined;
      }
    }

    let partialUserOp = {
      sender: await this.getAccountAddress(),
      nonce: info.nonce ?? (await this.getNonce()),
      factory: factoryParams?.factory,
      factoryData: factoryParams?.factoryData,
      callData,
      callGasLimit,
      verificationGasLimit,
      maxFeePerGas: maxFeePerGas as any,
      maxPriorityFeePerGas: maxPriorityFeePerGas as any,
    };

    if (this.paymasterAPI != null) {
      // fill (partial) preVerificationGas (all except the cost of the generated paymasterAndData)
      log(partialUserOp, 'partial user op');
      const pmFields = await this.paymasterAPI.getPaymasterData(partialUserOp);
      log(pmFields, 'pm fields');
      if (pmFields != null) {
        partialUserOp = {
          ...partialUserOp,
          paymaster: pmFields?.paymaster,
          paymasterPostOpGasLimit: pmFields?.paymasterPostOpGasLimit,
          paymasterVerificationGasLimit: pmFields?.paymasterVerificationGasLimit,
          paymasterData: pmFields?.paymasterData,
        } as any;
      }
    }

    return {
      ...partialUserOp,
      preVerificationGas: await this.getPreVerificationGas(partialUserOp),
      signature: '0x',
    };
  }

  /**
   * Sign the filled userOp.
   * @param userOp the UserOperation to sign (with signature field ignored)
   */
  async signUserOp(userOp: UserOperation): Promise<UserOperation> {
    const userOpHash = await this.getUserOpHash(userOp);
    const signature = await this.signUserOpHash(userOpHash);
    return {
      ...userOp,
      signature,
    };
  }

  /**
   * helper method: create and sign a user operation.
   * @param info transaction details for the userOp
   */
  async createSignedUserOp(info: TransactionDetailsForUserOp): Promise<UserOperation> {
    return await this.signUserOp(await this.createUnsignedUserOp(info));
  }

  /**
   * get the transaction that has this userOpHash mined, or null if not found
   * @param userOpHash returned by sendUserOpToBundler (or by getUserOpHash..)
   * @param timeout stop waiting after this timeout
   * @param interval time to wait between polls.
   * @return the transactionHash this userOp was mined, or null if not found.
   */
  //   async getUserOpReceipt (userOpHash: string, timeout = 30000, interval = 5000): Promise<string | null> {
  //     const endtime = Date.now() + timeout
  //     while (Date.now() < endtime) {
  //       const events = await this.entryPointView.queryFilter(this.entryPointView.filters.UserOperationEvent(userOpHash))
  //       if (events.length > 0) {
  //         return events[0].transactionHash
  //       }
  //       await new Promise(resolve => setTimeout(resolve, interval))
  //     }
  //     return null
  //   }
}
