export default [
  {
    inputs: [],
    name: 'NotOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'OutOfBound',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'amount',
            type: 'uint8',
          },
        ],
        internalType: 'struct Bet.Props',
        name: 'item',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
          {
            internalType: 'uint8',
            name: 'option',
            type: 'uint8',
          },
        ],
        internalType: 'struct Action.Props',
        name: 'action',
        type: 'tuple',
      },
    ],
    name: 'addBetCondition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
        ],
        internalType: 'struct Profit.Props',
        name: 'item',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
          {
            internalType: 'uint8',
            name: 'option',
            type: 'uint8',
          },
        ],
        internalType: 'struct Action.Props',
        name: 'action',
        type: 'tuple',
      },
    ],
    name: 'addProfitCondition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'strategyId',
        type: 'uint64',
      },
    ],
    name: 'get',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32[]',
            name: 'itemIds',
            type: 'uint32[]',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'strategyId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'removed',
            type: 'bool',
          },
        ],
        internalType: 'struct Strategy.Props',
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
        internalType: 'uint64',
        name: 'strategyId',
        type: 'uint64',
      },
    ],
    name: 'getItems',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint8',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'type_',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'amount',
                type: 'uint8',
              },
            ],
            internalType: 'struct Bet.Props',
            name: 'bet',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint8',
                name: 'type_',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'term',
                type: 'uint8',
              },
              {
                internalType: 'uint96',
                name: 'amount',
                type: 'uint96',
              },
            ],
            internalType: 'struct Profit.Props',
            name: 'profit',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint96',
                name: 'amount',
                type: 'uint96',
              },
              {
                internalType: 'uint8',
                name: 'option',
                type: 'uint8',
              },
            ],
            internalType: 'struct Action.Props',
            name: 'action',
            type: 'tuple',
          },
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
        ],
        internalType: 'struct Strategy.Item[]',
        name: '',
        type: 'tuple[]',
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
    ],
    name: 'items',
    outputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'amount',
            type: 'uint8',
          },
        ],
        internalType: 'struct Bet.Props',
        name: 'bet',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
        ],
        internalType: 'struct Profit.Props',
        name: 'profit',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
          {
            internalType: 'uint8',
            name: 'option',
            type: 'uint8',
          },
        ],
        internalType: 'struct Action.Props',
        name: 'action',
        type: 'tuple',
      },
      {
        internalType: 'uint8',
        name: 'type_',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'list',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32[]',
            name: 'itemIds',
            type: 'uint32[]',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'strategyId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'removed',
            type: 'bool',
          },
        ],
        internalType: 'struct Strategy.Props[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'relatedIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'index',
        type: 'uint64',
      },
    ],
    name: 'remove',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
    ],
    name: 'removeStrategy',
    outputs: [],
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
    ],
    name: 'strategies',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'removed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'itemId',
        type: 'uint64',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'amount',
            type: 'uint8',
          },
        ],
        internalType: 'struct Bet.Props',
        name: 'item',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
          {
            internalType: 'uint8',
            name: 'option',
            type: 'uint8',
          },
        ],
        internalType: 'struct Action.Props',
        name: 'action',
        type: 'tuple',
      },
    ],
    name: 'updateBetCondition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'itemId',
        type: 'uint64',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'type_',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'term',
            type: 'uint8',
          },
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
        ],
        internalType: 'struct Profit.Props',
        name: 'item',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint96',
            name: 'amount',
            type: 'uint96',
          },
          {
            internalType: 'uint8',
            name: 'option',
            type: 'uint8',
          },
        ],
        internalType: 'struct Action.Props',
        name: 'action',
        type: 'tuple',
      },
    ],
    name: 'updateProfitCondition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
