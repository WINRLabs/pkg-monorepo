export default [
  {
    inputs: [
      {
        internalType: 'contract RoleStore',
        name: '_roleStore',
        type: 'address',
      },
      {
        internalType: 'contract Config',
        name: '_config',
        type: 'address',
      },
      {
        internalType: 'contract BudgetMiddleware',
        name: '_budget',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'AlreadyCompleted',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
    ],
    name: 'FirstIndexMustBeZero',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'HasUncompletedGame',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'index',
        type: 'uint8',
      },
    ],
    name: 'InFreeSpin',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
    ],
    name: 'IndexOutOfBound',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'given',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'max',
        type: 'uint128',
      },
    ],
    name: 'MaxWagerExceeded',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'NoFreeSpin',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'payout',
        type: 'uint16',
      },
    ],
    name: 'PayoutShouldGreaterThanZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'msgSender',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'role',
        type: 'string',
      },
    ],
    name: 'Unauthorized',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'sum',
        type: 'uint32',
      },
    ],
    name: 'WeightSumIncorrect',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MULTIPLIER_MAX_WAGER_PACKAGE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REEL_ROWS',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'bankroll',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'bet',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'escrow',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payback',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payout',
            type: 'uint128',
          },
          {
            internalType: 'uint32',
            name: 'delay',
            type: 'uint32',
          },
          {
            internalType: 'uint8',
            name: 'iterate',
            type: 'uint8',
          },
          {
            internalType: 'enum ControllerUtils.Signal',
            name: 'signal',
            type: 'uint8',
          },
        ],
        internalType: 'struct ControllerUtils.Response',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'key',
                    type: 'string',
                  },
                  {
                    internalType: 'bytes',
                    name: 'value',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct EventUtils.BytesKeyValue[]',
                name: 'items',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct EventUtils.BytesItems',
            name: 'list',
            type: 'tuple',
          },
        ],
        internalType: 'struct EventUtils.Log',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'budget',
    outputs: [
      {
        internalType: 'contract BudgetMiddleware',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'bankroll',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'buyFreeSpins',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'escrow',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payback',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payout',
            type: 'uint128',
          },
          {
            internalType: 'uint32',
            name: 'delay',
            type: 'uint32',
          },
          {
            internalType: 'uint8',
            name: 'iterate',
            type: 'uint8',
          },
          {
            internalType: 'enum ControllerUtils.Signal',
            name: 'signal',
            type: 'uint8',
          },
        ],
        internalType: 'struct ControllerUtils.Response',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'key',
                    type: 'string',
                  },
                  {
                    internalType: 'bytes',
                    name: 'value',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct EventUtils.BytesKeyValue[]',
                name: 'items',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct EventUtils.BytesItems',
            name: 'list',
            type: 'tuple',
          },
        ],
        internalType: 'struct EventUtils.Log',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'config',
    outputs: [
      {
        internalType: 'contract Config',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'doubleChanceDivisor',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'doubleChanceReelFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'doubleChanceWeights',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'emergencyRefund',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'randoms',
        type: 'uint256[]',
      },
    ],
    name: 'fill',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'escrow',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payback',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payout',
            type: 'uint128',
          },
          {
            internalType: 'uint32',
            name: 'delay',
            type: 'uint32',
          },
          {
            internalType: 'uint8',
            name: 'iterate',
            type: 'uint8',
          },
          {
            internalType: 'enum ControllerUtils.Signal',
            name: 'signal',
            type: 'uint8',
          },
        ],
        internalType: 'struct ControllerUtils.Response',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'key',
                    type: 'string',
                  },
                  {
                    internalType: 'bytes',
                    name: 'value',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct EventUtils.BytesKeyValue[]',
                name: 'items',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct EventUtils.BytesItems',
            name: 'list',
            type: 'tuple',
          },
        ],
        internalType: 'struct EventUtils.Log',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'randomNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint16[12][6]',
        name: 'weights',
        type: 'uint16[12][6]',
      },
      {
        internalType: 'uint16[30]',
        name: 'reel',
        type: 'uint16[30]',
      },
      {
        internalType: 'uint16[6]',
        name: 'remaining',
        type: 'uint16[6]',
      },
    ],
    name: 'fillReels',
    outputs: [
      {
        internalType: 'uint16[30]',
        name: '',
        type: 'uint16[30]',
      },
      {
        internalType: 'uint16[14]',
        name: '',
        type: 'uint16[14]',
      },
      {
        internalType: 'uint16[6]',
        name: '',
        type: 'uint16[6]',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'randomNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint16[30]',
        name: 'reel',
        type: 'uint16[30]',
      },
      {
        internalType: 'uint8',
        name: 'count',
        type: 'uint8',
      },
    ],
    name: 'fillScatters',
    outputs: [
      {
        internalType: 'uint16[30]',
        name: '',
        type: 'uint16[30]',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'freeSpin',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'escrow',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payback',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'payout',
            type: 'uint128',
          },
          {
            internalType: 'uint32',
            name: 'delay',
            type: 'uint32',
          },
          {
            internalType: 'uint8',
            name: 'iterate',
            type: 'uint8',
          },
          {
            internalType: 'enum ControllerUtils.Signal',
            name: 'signal',
            type: 'uint8',
          },
        ],
        internalType: 'struct ControllerUtils.Response',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'string',
                    name: 'key',
                    type: 'string',
                  },
                  {
                    internalType: 'bytes',
                    name: 'value',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct EventUtils.BytesKeyValue[]',
                name: 'items',
                type: 'tuple[]',
              },
            ],
            internalType: 'struct EventUtils.BytesItems',
            name: 'list',
            type: 'tuple',
          },
        ],
        internalType: 'struct EventUtils.Log',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'freeSpinWeights',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'a',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'b',
        type: 'uint256',
      },
    ],
    name: 'generateRandomNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'a',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'b',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'c',
        type: 'uint256',
      },
    ],
    name: 'generateRandomNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'wager',
        type: 'uint128',
      },
    ],
    name: 'getDoubleChanceCost',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenAmount_',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDoubleChanceReelFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDoubleChanceWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'wager',
        type: 'uint128',
      },
    ],
    name: 'getFreeSpinTokenAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getInitialFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMultiplierWeights',
    outputs: [
      {
        internalType: 'uint16[15]',
        name: '',
        type: 'uint16[15]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNormalReelFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNormalSpinWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPayoutEightOrMore',
    outputs: [
      {
        internalType: 'uint16[10]',
        name: '',
        type: 'uint16[10]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPayoutTenOrMore',
    outputs: [
      {
        internalType: 'uint16[10]',
        name: '',
        type: 'uint16[10]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPayoutTwelveOrMore',
    outputs: [
      {
        internalType: 'uint16[10]',
        name: '',
        type: 'uint16[10]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'getPlayerStatus',
    outputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'freeSpinCount',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'wager',
            type: 'uint128',
          },
          {
            internalType: 'uint32',
            name: 'bufferedFreeSpinWinnings',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'multiplier',
            type: 'uint32',
          },
          {
            internalType: 'enum IPrincessWINR.SpinType',
            name: 'spinType',
            type: 'uint8',
          },
          {
            internalType: 'enum IPrincessWINR.State',
            name: 'state',
            type: 'uint8',
          },
        ],
        internalType: 'struct IPrincessWINR.Game',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'symbol',
        type: 'uint16',
      },
    ],
    name: 'getSymbolName',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getType',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVersion',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IPrincessWINR.SpinType',
        name: 'spinType',
        type: 'uint8',
      },
    ],
    name: 'getWeights',
    outputs: [
      {
        internalType: 'uint16[12][6]',
        name: '',
        type: 'uint16[12][6]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'initialFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxWagerMultiplier',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'normalReelFreeSpinWeights',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'normalSpinWeights',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'randomNumber',
        type: 'uint256',
      },
      {
        internalType: 'uint16[12][6]',
        name: 'weights',
        type: 'uint16[12][6]',
      },
      {
        internalType: 'uint16[30]',
        name: 'reel',
        type: 'uint16[30]',
      },
      {
        internalType: 'uint16[6]',
        name: 'remaining',
        type: 'uint16[6]',
      },
      {
        internalType: 'uint32',
        name: 'multiplier',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'payoutMultiplier',
        type: 'uint32',
      },
      {
        internalType: 'uint8',
        name: 'turn',
        type: 'uint8',
      },
    ],
    name: 'processReel',
    outputs: [
      {
        internalType: 'uint16[30]',
        name: '',
        type: 'uint16[30]',
      },
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'refund',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'scatter',
        type: 'uint16',
      },
    ],
    name: 'returnScatterMultiplier',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'roleStore',
    outputs: [
      {
        internalType: 'contract RoleStore',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16[30]',
        name: 'grid',
        type: 'uint16[30]',
      },
      {
        internalType: 'uint16[14]',
        name: 'symbolCounts',
        type: 'uint16[14]',
      },
    ],
    name: 'seekAndDestroy',
    outputs: [
      {
        internalType: 'uint16[30]',
        name: '',
        type: 'uint16[30]',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'divisor',
        type: 'uint8',
      },
    ],
    name: 'setDoubleChanceDivisor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint16[12]',
        name: 'weights',
        type: 'uint16[12]',
      },
    ],
    name: 'setDoubleChanceReelFreeSpinWeights',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint16[12]',
        name: 'weights',
        type: 'uint16[12]',
      },
    ],
    name: 'setDoubleChanceWeights',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint16[12]',
        name: 'weights',
        type: 'uint16[12]',
      },
    ],
    name: 'setFreeSpinWeights',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint16[12]',
        name: 'weights',
        type: 'uint16[12]',
      },
    ],
    name: 'setInitialFreeSpinWeights',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: '_maxWagerMultiplier',
        type: 'uint128',
      },
    ],
    name: 'setMaxWagerMultiplier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16[15]',
        name: '_multiplierWeights',
        type: 'uint16[15]',
      },
    ],
    name: 'setMultiplierWeights',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint16[12]',
        name: 'weights',
        type: 'uint16[12]',
      },
    ],
    name: 'setNormalReelFreeSpinWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint16[12]',
        name: 'weights',
        type: 'uint16[12]',
      },
    ],
    name: 'setNormalSpinWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16[10]',
        name: 'payouts',
        type: 'uint16[10]',
      },
    ],
    name: 'setPayoutEightOrMore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16[10]',
        name: 'payouts',
        type: 'uint16[10]',
      },
    ],
    name: 'setPayoutTenOrMore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16[10]',
        name: 'payouts',
        type: 'uint16[10]',
      },
    ],
    name: 'setPayoutTwelveOrMore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
