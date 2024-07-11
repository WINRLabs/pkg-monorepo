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
    inputs: [],
    name: "ChoiceNotAllowed",
    type: "error",
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
    inputs: [],
    name: "BASIS_POINTS",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
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
        name: "bankroll",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "bet",
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
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "endGame",
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
        name: "",
        type: "address",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "enum Mines.Status",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "client",
        type: "address",
      },
      {
        internalType: "address",
        name: "bankroll",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wager",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "currentMultiplier",
        type: "uint64",
      },
      {
        internalType: "uint8",
        name: "numMines",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "isCashout",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_numMines",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_numRevealed",
        type: "uint256",
      },
    ],
    name: "getMultipliers",
    outputs: [
      {
        internalType: "uint256",
        name: "multiplier_",
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
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerStatus",
    outputs: [
      {
        components: [
          {
            internalType: "enum Mines.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "client",
            type: "address",
          },
          {
            internalType: "address",
            name: "bankroll",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "wager",
            type: "uint256",
          },
          {
            internalType: "uint64",
            name: "currentMultiplier",
            type: "uint64",
          },
          {
            internalType: "uint8",
            name: "numMines",
            type: "uint8",
          },
          {
            internalType: "bool[25]",
            name: "revealedCells",
            type: "bool[25]",
          },
          {
            internalType: "bool[25]",
            name: "cellsPicked",
            type: "bool[25]",
          },
          {
            internalType: "bool[25]",
            name: "mines",
            type: "bool[25]",
          },
          {
            internalType: "bool",
            name: "isCashout",
            type: "bool",
          },
        ],
        internalType: "struct Mines.Game",
        name: "",
        type: "tuple",
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
    name: "revealCells",
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
        internalType: "uint8[24]",
        name: "maxReveal",
        type: "uint8[24]",
      },
    ],
    name: "setMaxReveal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_numMines",
        type: "uint256",
      },
    ],
    name: "setMultipliers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
