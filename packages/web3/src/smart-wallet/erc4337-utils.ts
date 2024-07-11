// @ts-nocheck
// import {
//   defaultAbiCoder,
//   hexConcat, hexDataLength,
//   hexDataSlice,
//   hexlify,
//   hexZeroPad,
//   keccak256,
//   resolveProperties
// } from 'ethers/lib/utils'
// import { abi as entryPointAbi } from '@account-abstraction/contracts/artifacts/IEntryPoint.json'

// import { BigNumber, BigNumberish, BytesLike, ethers } from 'ethers'
import {
  Address,
  concat,
  decodeAbiParameters,
  encodeAbiParameters,
  keccak256,
  pad,
  parseAbiParameters,
  size,
  slice,
  toHex,
  zeroAddress,
} from "viem";
import { Hex } from "viem";

import entryPointAbi from "./abis/entry-point-abi";
import { PackedUserOperation } from "./utils";

// const debug = Debug("aa.utils");

// UserOperation is the first parameter of getUserOpHash
const getUserOpHashMethod = "getUserOpHash";

const PackedUserOpType = entryPointAbi.find(
  (entry) => entry.name === getUserOpHashMethod
)?.inputs[0];

if (PackedUserOpType == null) {
  throw new Error(
    `unable to find method ${getUserOpHashMethod} in EP ${entryPointAbi
      .filter((x) => x.type === "function")
      .map((x) => x.name)
      .join(",")}`
  );
}

// reverse "Deferrable" or "PromiseOrValue" fields
export type NotPromise<T> = {
  [P in keyof T]: Exclude<T[P], Promise<any>>;
};

export interface UserOperation {
  sender: Address;
  nonce: string;
  factory?: Address;
  factoryData?: Hex;
  callData: Hex;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: any;
  maxPriorityFeePerGas: any;
  paymaster?: Address;
  paymasterVerificationGasLimit?: string;
  paymasterPostOpGasLimit?: string;
  paymasterData?: Hex;
  signature: Hex;
}

// todo: remove this wrapper method?
export function packAccountGasLimits(
  validationGasLimit: bigint,
  callGasLimit: bigint
): string {
  return packUint(validationGasLimit, callGasLimit);
}

export function unpackAccountGasLimits(accountGasLimits: Hex): {
  verificationGasLimit: bigint;
  callGasLimit: bigint;
} {
  const [verificationGasLimit, callGasLimit] = unpackUint(accountGasLimits);

  return {
    verificationGasLimit,
    callGasLimit,
  };
}

export function packUint(high128: bigint, low128: bigint): Hex {
  // return pad(encodeAbiParameters(parseAbiParameters('uint128, uint128'), [high128, low128]), { size: 32 });
  return pad(toHex((high128 << 128n) + low128), { size: 32 });
}

export function unpackUint(packed: Hex): readonly [bigint, bigint] {
  return decodeAbiParameters(parseAbiParameters("uint128, uint128"), packed);
}

export function packPaymasterData(
  paymaster: Address,
  paymasterVerificationGasLimit: bigint,
  postOpGasLimit: bigint,
  paymasterData?: Hex
): Hex {
  return concat([
    paymaster,
    packUint(paymasterVerificationGasLimit, postOpGasLimit),
    paymasterData ?? "0x",
  ]);
}

export interface ValidationData {
  aggregator: Address;
  validAfter: bigint;
  validUntil: bigint;
}

export const maxUint48 = 2 ** 48 - 1;

export const SIG_VALIDATION_FAILED = pad("0x01", { size: 20 });

/**
 * parse validationData as returned from validateUserOp or validatePaymasterUserOp into ValidationData struct
 * @param validationData
 */
export function parseValidationData(validationData: bigint): ValidationData {
  const data = pad(
    encodeAbiParameters(parseAbiParameters("uint256"), [validationData]),
    { size: 32 }
  );

  // string offsets start from left (msb)
  const aggregator = slice(data, 32 - 20);

  let validUntil = BigInt(slice(data, 32 - 26, 32 - 20));

  if (validUntil === 0n) validUntil = BigInt(maxUint48);

  const validAfter = BigInt(slice(data, 0, 6));

  return {
    aggregator,
    validAfter,
    validUntil,
  };
}

export function mergeValidationDataValues(
  accountValidationData: bigint,
  paymasterValidationData: bigint
): ValidationData {
  return mergeValidationData(
    parseValidationData(accountValidationData),
    parseValidationData(paymasterValidationData)
  );
}

/**
 * merge validationData structure returned by paymaster and account
 * @param accountValidationData returned from validateUserOp
 * @param paymasterValidationData returned from validatePaymasterUserOp
 */
export function mergeValidationData(
  accountValidationData: ValidationData,
  paymasterValidationData: ValidationData
): ValidationData {
  return {
    aggregator:
      paymasterValidationData.aggregator !== zeroAddress
        ? SIG_VALIDATION_FAILED
        : accountValidationData.aggregator,
    validAfter: BigInt(
      Math.max(
        Number(accountValidationData.validAfter),
        Number(paymasterValidationData.validAfter)
      )
    ),
    validUntil: BigInt(
      Math.min(
        Number(accountValidationData.validUntil),
        Number(paymasterValidationData.validUntil)
      )
    ),
  };
}

// export function packValidationData (validationData: ValidationData): bigint {
//   return (validationData.validAfter ?? 0n) + (validationData.validUntil ?? 0n) + validationData.aggregator
// }

export function unpackPaymasterAndData(paymasterAndData: Hex): {
  paymaster: Address;
  paymasterVerificationGas: bigint;
  postOpGasLimit: bigint;
  paymasterData: Hex;
} | null {
  if (paymasterAndData.length <= 2) return null;

  if (size(paymasterAndData) < 52) {
    // if length is non-zero, then must at least host paymaster address and gas-limits
    throw new Error(`invalid PaymasterAndData: ${paymasterAndData as string}`);
  }

  const [paymasterVerificationGas, postOpGasLimit] = unpackUint(
    slice(paymasterAndData, 20, 52)
  );

  return {
    paymaster: slice(paymasterAndData, 0, 20),
    paymasterVerificationGas,
    postOpGasLimit,
    paymasterData: slice(paymasterAndData, 52),
  };
}

export function packUserOp(op: UserOperation): PackedUserOperation {
  let paymasterAndData: Hex;

  if (op.paymaster == null) {
    paymasterAndData = "0x";
  } else {
    if (
      op.paymasterVerificationGasLimit == null ||
      op.paymasterPostOpGasLimit == null
    ) {
      throw new Error("paymaster with no gas limits");
    }

    paymasterAndData = packPaymasterData(
      op.paymaster,
      op.paymasterVerificationGasLimit,
      op.paymasterPostOpGasLimit,
      op.paymasterData
    );
  }

  return {
    sender: op.sender,
    nonce: op.nonce,
    initCode:
      op.factory == null ? "0x" : concat([op.factory, op.factoryData ?? "0x"]),
    callData: op.callData,
    accountGasLimits: packUint(op.verificationGasLimit, op.callGasLimit),
    preVerificationGas: op.preVerificationGas,
    gasFees: packUint(op.maxPriorityFeePerGas, op.maxFeePerGas),
    paymasterAndData,
    signature: op.signature,
  };
}

export function unpackUserOp(packed: PackedUserOperation): UserOperation {
  const [verificationGasLimit, callGasLimit] = unpackUint(
    packed.accountGasLimits
  );

  const [maxPriorityFeePerGas, maxFeePerGas] = unpackUint(packed.gasFees);

  let ret: UserOperation = {
    sender: packed.sender,
    nonce: packed.nonce,
    callData: packed.callData,
    preVerificationGas: packed.preVerificationGas,
    verificationGasLimit,
    callGasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    signature: packed.signature,
  };

  if (packed.initCode != null && packed.initCode.length > 2) {
    const factory = slice(packed.initCode, 0, 20);

    const factoryData = slice(packed.initCode, 20);

    ret = {
      ...ret,
      factory,
      factoryData,
    };
  }

  const pmData = unpackPaymasterAndData(packed.paymasterAndData);

  if (pmData != null) {
    ret = {
      ...ret,
      paymaster: pmData.paymaster,
      paymasterVerificationGasLimit: pmData.paymasterVerificationGas,
      paymasterPostOpGasLimit: pmData.postOpGasLimit,
      paymasterData: pmData.paymasterData,
    };
  }

  return ret;
}

/**
 * abi-encode the userOperation
 * @param op a PackedUserOp
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
export function encodeUserOp(
  op1: PackedUserOperation | UserOperation,
  forSignature = true
): Hex {
  // if "op" is unpacked UserOperation, then pack it first, before we ABI-encode it.
  let op: PackedUserOperation;

  if ("callGasLimit" in op1) {
    op = packUserOp(op1);
  } else {
    op = op1;
  }

  if (forSignature) {
    return encodeAbiParameters(
      parseAbiParameters(
        "address, uint256, bytes32, bytes32, bytes32, uint256, bytes32, bytes32"
      ),
      [
        op.sender,
        op.nonce,
        keccak256(op.initCode),
        keccak256(op.callData),
        op.accountGasLimits,
        op.preVerificationGas,
        op.gasFees,
        keccak256(op.paymasterAndData),
      ]
    );
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return encodeAbiParameters(
      parseAbiParameters(
        "address, uint256, bytes, bytes, bytes32, uint256, bytes32, bytes, bytes"
      ),
      [
        op.sender,
        op.nonce,
        op.initCode,
        op.callData,
        op.accountGasLimits,
        op.preVerificationGas,
        op.gasFees,
        op.paymasterAndData,
        op.signature,
      ]
    );
  }
}

/**
 * calculate the userOpHash of a given userOperation.
 * The userOpHash is a hash of all UserOperation fields, except the "signature" field.
 * The entryPoint uses this value in the emitted UserOperationEvent.
 * A wallet may use this value as the hash to sign (the SampleWallet uses this method)
 * @param op
 * @param entryPoint
 * @param chainId
 */
export function getUserOpHash(
  op: UserOperation,
  entryPoint: Address,
  chainId: bigint
): Hex {
  const userOpHash = keccak256(encodeUserOp(op, true));

  const enc = encodeAbiParameters(
    parseAbiParameters("bytes32, address, uint256"),
    [userOpHash, entryPoint, chainId]
  );

  return keccak256(enc);
}

const ErrorSig = keccak256(Buffer.from("Error(string)")).slice(0, 10); // 0x08c379a0

const FailedOpSig = keccak256(Buffer.from("FailedOp(uint256,string)")).slice(
  0,
  10
); // 0x220266b6

interface DecodedError {
  message: string;
  opIndex?: bigint;
}

/**
 * decode bytes thrown by revert as Error(message) or FailedOp(opIndex,paymaster,message)
 */
export function decodeErrorReason(
  error: string | Error
): DecodedError | undefined {
  if (typeof error !== "string") {
    const err = error as any;

    error = (err.data ?? err.error.data) as string;
  }

  // debug("decoding", error);

  if (error.startsWith(ErrorSig)) {
    const [message] = decodeAbiParameters(
      parseAbiParameters("string"),
      ("0x" + error.substring(10)) as Hex
    );

    return { message };
  } else if (error.startsWith(FailedOpSig)) {
    let [opIndex, message] = decodeAbiParameters(
      parseAbiParameters("uint256, string"),
      ("0x" + error.substring(10)) as Hex
    );

    message = `FailedOp: ${message as string}`;

    return {
      message,
      opIndex,
    };
  }
}

/**
 * update thrown Error object with our custom FailedOp message, and re-throw it.
 * updated both "message" and inner encoded "data"
 * tested on geth, hardhat-node
 * usage: entryPoint.handleOps().catch(decodeError)
 */
export function rethrowError(e: any): any {
  let error = e;

  let parent = e;

  if (error?.error != null) {
    error = error.error;
  }

  while (error?.data != null) {
    parent = error;

    error = error.data;
  }

  const decoded =
    typeof error === "string" && error.length > 2
      ? decodeErrorReason(error)
      : undefined;

  if (decoded != null) {
    e.message = decoded.message;

    if (decoded.opIndex != null) {
      // helper for chai: convert our FailedOp error into "Error(msg)"
      const errorWithMsg = concat([
        ErrorSig as Hex,
        encodeAbiParameters(parseAbiParameters("string"), [decoded.message]),
      ]);

      // modify in-place the error object:
      parent.data = errorWithMsg;
    }
  }

  throw e;
}

/**
 * hexlify all members of object, recursively
 * @param obj
 */
export function deepHexlify(obj: any): any {
  if (typeof obj === "function") {
    return undefined;
  }

  // if (typeof obj === 'bigint') {
  //   return obj.toString();
  // }
  if (obj == null || typeof obj === "string" || typeof obj === "boolean") {
    return obj;
  } else if (obj._isBigNumber != null || typeof obj !== "object") {
    return toHex(obj).replace(/^0x0/, "0x");
  }

  if (Array.isArray(obj)) {
    return obj.map((member) => deepHexlify(member));
  }

  return Object.keys(obj).reduce(
    (set, key) => ({
      ...set,
      [key]: deepHexlify(obj[key]),
    }),
    {}
  );
}

// // resolve all property and hexlify.
// // (UserOpMethodHandler receives data from the network, so we need to pack our generated values)
// export async function resolveHexlify(a: any): Promise<any> {
//   return deepHexlify(await resolveProperties(a));
// }
