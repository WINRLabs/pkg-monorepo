// @ts-nocheck
import { JSONRPCClient } from 'json-rpc-2.0';
import { Hex } from 'viem';

import { UserOperation } from './erc4337-utils';
// import { BigNumberish, BytesLike } from 'ethers'

/**
 * returned paymaster parameters.
 * note that if a paymaster is specified, then the gasLimits must be specified
 * (even if postOp is not called, the paymasterPostOpGasLimit must be set to zero)
 */
export interface PaymasterParams {
  paymaster: string;
  paymasterData?: Hex;
  paymasterVerificationGasLimit: bigint;
  paymasterPostOpGasLimit: bigint;
}

/**
 * an API to external a UserOperation with paymaster info
 */
export class PaymasterAPI {
  /**
   * after gas estimation, return final paymaster parameters to replace the above tepmorary value.
   * @param userOp a partially-filled UserOperation (without signature and paymasterAndData
   *  note that the "preVerificationGas" is incomplete: it can't account for the
   *  paymasterAndData value, which will only be returned by this method..
   * @returns the values to put into paymaster fields, null to leave them empty
   */
  async getPaymasterData(
    userOp: Partial<UserOperation>,
    client: JSONRPCClient
  ): Promise<PaymasterParams | null> {
    return null;
  }
}
