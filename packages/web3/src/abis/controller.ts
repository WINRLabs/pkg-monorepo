export default [
  {
    inputs: [
      {
        internalType: "contract RoleStore",
        name: "_roleStore",
        type: "address",
      },
      {
        internalType: "contract ICashier",
        name: "_cashier",
        type: "address",
      },
      {
        internalType: "contract IVaultAdapter",
        name: "_vaultAdapter",
        type: "address",
      },
      {
        internalType: "contract IEventEmitter",
        name: "eventEmitterInstance",
        type: "address",
      },
      {
        internalType: "contract IRandomizerRouter",
        name: "routerInstance",
        type: "address",
      },
      {
        internalType: "contract PriceFeed",
        name: "_priceFeed",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "CallRevert",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "CannotBeZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "escrow",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "wanted",
        type: "uint128",
      },
    ],
    name: "InsufficientEscrow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "MustBeGreater",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "ProgramDidNotRefund",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "RequestCouldNotFind",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "bits",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "SessionNotIterable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "SessionNotRefundable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "SessionWaitingIteration",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "msgSender",
        type: "address",
      },
      {
        internalType: "string",
        name: "role",
        type: "string",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "beginTargets",
    outputs: [
      {
        internalType: "contract IOnBegin",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cashier",
    outputs: [
      {
        internalType: "contract ICashier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IRandomizerRouter",
        name: "_randomizerRouter",
        type: "address",
      },
    ],
    name: "changeRandomizerRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "program",
        type: "address",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
    ],
    name: "emergencyRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eventEmitter",
    outputs: [
      {
        internalType: "contract IEventEmitter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "program",
        type: "address",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
    ],
    name: "getSessionByClient",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "uint128",
                name: "lastRequestId",
                type: "uint128",
              },
              {
                internalType: "uint64",
                name: "startBlock",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endBlock",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "lastSeen",
                type: "uint64",
              },
            ],
            internalType: "struct Session.Detail",
            name: "detail",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "decimals",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "tokenDecimals",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "value",
                type: "uint64",
              },
            ],
            internalType: "struct Price.Props",
            name: "price",
            type: "tuple",
          },
          {
            internalType: "enum Session.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "program",
            type: "address",
          },
          {
            internalType: "address",
            name: "client",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "escrow",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payout",
            type: "uint128",
          },
          {
            internalType: "address",
            name: "bankroll",
            type: "address",
          },
        ],
        internalType: "struct Session.Props",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "getSessionByRequestId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "uint128",
                name: "lastRequestId",
                type: "uint128",
              },
              {
                internalType: "uint64",
                name: "startBlock",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endBlock",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "lastSeen",
                type: "uint64",
              },
            ],
            internalType: "struct Session.Detail",
            name: "detail",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "decimals",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "tokenDecimals",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "value",
                type: "uint64",
              },
            ],
            internalType: "struct Price.Props",
            name: "price",
            type: "tuple",
          },
          {
            internalType: "enum Session.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "program",
            type: "address",
          },
          {
            internalType: "address",
            name: "client",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "escrow",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payout",
            type: "uint128",
          },
          {
            internalType: "address",
            name: "bankroll",
            type: "address",
          },
        ],
        internalType: "struct Session.Props",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "offBegin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "offSettlement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "contract IOnBegin",
        name: "target",
        type: "address",
      },
    ],
    name: "onBegin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "contract IOnSettlement",
        name: "target",
        type: "address",
      },
    ],
    name: "onSettlement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IProgram",
        name: "program",
        type: "address",
      },
      {
        internalType: "address",
        name: "bankroll",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "string",
        name: "route",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "perform",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFeed",
    outputs: [
      {
        internalType: "contract PriceFeed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randoms",
        type: "uint256[]",
      },
    ],
    name: "randomizerCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "randomizerRouter",
    outputs: [
      {
        internalType: "contract IRandomizerRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "program",
        type: "address",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
    ],
    name: "reIterate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reIterationCooldown",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "program",
        type: "address",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "refundCooldown",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "requestCache",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "roleStore",
    outputs: [
      {
        internalType: "contract RoleStore",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "sessions",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "uint128",
            name: "lastRequestId",
            type: "uint128",
          },
          {
            internalType: "uint64",
            name: "startBlock",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "endBlock",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "lastSeen",
            type: "uint64",
          },
        ],
        internalType: "struct Session.Detail",
        name: "detail",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "decimals",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "tokenDecimals",
            type: "uint8",
          },
          {
            internalType: "uint64",
            name: "value",
            type: "uint64",
          },
        ],
        internalType: "struct Price.Props",
        name: "price",
        type: "tuple",
      },
      {
        internalType: "enum Session.Status",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "program",
        type: "address",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "escrow",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "payout",
        type: "uint128",
      },
      {
        internalType: "address",
        name: "bankroll",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "settlementTargets",
    outputs: [
      {
        internalType: "contract IOnSettlement",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_refundCooldown",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_reIterationCooldown",
        type: "uint256",
      },
    ],
    name: "updateCooldowns",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vaultAdapter",
    outputs: [
      {
        internalType: "contract IVaultAdapter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
