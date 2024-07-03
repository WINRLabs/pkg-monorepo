export default [
  {
    inputs: [
      {
        internalType: "contract RoleStore",
        name: "_roleStore",
        type: "address",
      },
      {
        internalType: "contract Config",
        name: "_config",
        type: "address",
      },
      {
        internalType: "contract BudgetMiddleware",
        name: "_budget",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
    ],
    name: "HasUncompletedGame",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "given",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "max",
        type: "uint128",
      },
    ],
    name: "MaxWagerExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "given",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "min",
        type: "uint128",
      },
    ],
    name: "MinWagerNotMet",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "houseEdge",
        type: "uint64",
      },
    ],
    name: "UpdateHouseEdge",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8[9]",
        name: "payouts",
        type: "uint8[9]",
      },
    ],
    name: "UpdatePayouts",
    type: "event",
  },
  {
    inputs: [],
    name: "budget",
    outputs: [
      {
        internalType: "contract BudgetMiddleware",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "config",
    outputs: [
      {
        internalType: "contract Config",
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
        name: "client",
        type: "address",
      },
    ],
    name: "emergencyRefund",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "randoms",
        type: "uint256[]",
      },
    ],
    name: "fill",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "escrow",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payback",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payout",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "delay",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "iterate",
            type: "uint8",
          },
          {
            internalType: "enum ControllerUtils.Signal",
            name: "signal",
            type: "uint8",
          },
        ],
        internalType: "struct ControllerUtils.Response",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "key",
                    type: "string",
                  },
                  {
                    internalType: "bytes",
                    name: "value",
                    type: "bytes",
                  },
                ],
                internalType: "struct EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
            ],
            internalType: "struct EventUtils.BytesItems",
            name: "list",
            type: "tuple",
          },
        ],
        internalType: "struct EventUtils.Log",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "finish",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "escrow",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payback",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payout",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "delay",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "iterate",
            type: "uint8",
          },
          {
            internalType: "enum ControllerUtils.Signal",
            name: "signal",
            type: "uint8",
          },
        ],
        internalType: "struct ControllerUtils.Response",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "key",
                    type: "string",
                  },
                  {
                    internalType: "bytes",
                    name: "value",
                    type: "bytes",
                  },
                ],
                internalType: "struct EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
            ],
            internalType: "struct EventUtils.BytesItems",
            name: "list",
            type: "tuple",
          },
        ],
        internalType: "struct EventUtils.Log",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "enum VideoPoker.Status",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "cards",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "change",
        type: "uint32",
      },
      {
        internalType: "uint128",
        name: "wager",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getGame",
    outputs: [
      {
        components: [
          {
            internalType: "enum VideoPoker.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "cards",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "change",
            type: "uint32",
          },
          {
            internalType: "uint128",
            name: "wager",
            type: "uint128",
          },
        ],
        internalType: "struct VideoPoker.Game",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPayouts",
    outputs: [
      {
        internalType: "uint8[9]",
        name: "payouts_",
        type: "uint8[9]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getType",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getVersion",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
    ],
    name: "refund",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "start",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "escrow",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payback",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "payout",
            type: "uint128",
          },
          {
            internalType: "uint32",
            name: "delay",
            type: "uint32",
          },
          {
            internalType: "uint8",
            name: "iterate",
            type: "uint8",
          },
          {
            internalType: "enum ControllerUtils.Signal",
            name: "signal",
            type: "uint8",
          },
        ],
        internalType: "struct ControllerUtils.Response",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "key",
                    type: "string",
                  },
                  {
                    internalType: "bytes",
                    name: "value",
                    type: "bytes",
                  },
                ],
                internalType: "struct EventUtils.BytesKeyValue[]",
                name: "items",
                type: "tuple[]",
              },
            ],
            internalType: "struct EventUtils.BytesItems",
            name: "list",
            type: "tuple",
          },
        ],
        internalType: "struct EventUtils.Log",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8[9]",
        name: "_payouts",
        type: "uint8[9]",
      },
    ],
    name: "updatePayouts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cards",
        type: "uint256",
      },
    ],
    name: "win",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;
