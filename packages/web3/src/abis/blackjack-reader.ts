export default [
  {
    inputs: [
      {
        internalType: "contract RoleStore",
        name: "_roleStore",
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
        internalType: "address",
        name: "_player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_gameIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_betAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chipAmount",
        type: "uint256",
      },
    ],
    name: "_initHand",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
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
    name: "activePlayerMapping",
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
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "addActiveHandsInGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "handIndex_",
        type: "uint32",
      },
    ],
    name: "addHandIndexesGame",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "cards",
    outputs: [
      {
        internalType: "uint8",
        name: "amountCards",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "totalCount",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "isSoftHand",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "canSplit",
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
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "drawnCards",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameIndex",
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
    name: "gameResults",
    outputs: [
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
    ],
    stateMutability: "view",
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
        internalType: "uint128",
        name: "wagerAmount",
        type: "uint128",
      },
      {
        internalType: "uint64",
        name: "activeHandIndex",
        type: "uint64",
      },
      {
        internalType: "uint32",
        name: "amountHands",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "canInsure",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "awaitingRandomness",
        type: "bool",
      },
      {
        internalType: "enum IBlackJack.GameStatus",
        name: "status",
        type: "uint8",
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
    name: "getActiveHandsInGame",
    outputs: [
      {
        internalType: "bool[5]",
        name: "",
        type: "bool[5]",
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
    name: "getActivePlayerMapping",
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
        name: "_handIndex",
        type: "uint256",
      },
    ],
    name: "getCards",
    outputs: [
      {
        components: [
          {
            internalType: "uint8[8]",
            name: "cards",
            type: "uint8[8]",
          },
          {
            internalType: "uint8",
            name: "amountCards",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "totalCount",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isSoftHand",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "canSplit",
            type: "bool",
          },
        ],
        internalType: "struct IBlackJack.Cards",
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
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getDealerHand",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "player",
                type: "address",
              },
              {
                internalType: "uint96",
                name: "gameIndex",
                type: "uint96",
              },
              {
                internalType: "uint16",
                name: "chipsAmount",
                type: "uint16",
              },
              {
                internalType: "uint96",
                name: "betAmount",
                type: "uint96",
              },
              {
                internalType: "enum IBlackJack.HandStatus",
                name: "status",
                type: "uint8",
              },
              {
                internalType: "bool",
                name: "isInsured",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "isDouble",
                type: "bool",
              },
            ],
            internalType: "struct IBlackJack.Hand",
            name: "hand",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint8[8]",
                name: "cards",
                type: "uint8[8]",
              },
              {
                internalType: "uint8",
                name: "amountCards",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "totalCount",
                type: "uint8",
              },
              {
                internalType: "bool",
                name: "isSoftHand",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "canSplit",
                type: "bool",
              },
            ],
            internalType: "struct IBlackJack.Cards",
            name: "cards",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "splitHandIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "handIndex",
            type: "uint256",
          },
        ],
        internalType: "struct IBlackJackStore.HandData",
        name: "dealerCards",
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
        name: "_handIndex",
        type: "uint256",
      },
    ],
    name: "getDrawnCards",
    outputs: [
      {
        internalType: "uint8[13]",
        name: "",
        type: "uint8[13]",
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
    name: "getDrawnCardsOfPlayerGame",
    outputs: [
      {
        internalType: "uint8[13]",
        name: "",
        type: "uint8[13]",
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
            internalType: "uint128",
            name: "wagerAmount",
            type: "uint128",
          },
          {
            internalType: "uint64",
            name: "activeHandIndex",
            type: "uint64",
          },
          {
            internalType: "uint32",
            name: "amountHands",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "canInsure",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "awaitingRandomness",
            type: "bool",
          },
          {
            internalType: "enum IBlackJack.GameStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct IBlackJack.Game",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameIndex",
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
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "getGameResult",
    outputs: [
      {
        components: [
          {
            internalType: "enum IBlackJack.HandResult[5]",
            name: "hands",
            type: "uint8[5]",
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
        ],
        internalType: "struct GameResultUtilsBJ.Params",
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
        name: "_handIndex",
        type: "uint256",
      },
    ],
    name: "getHand",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "gameIndex",
            type: "uint96",
          },
          {
            internalType: "uint16",
            name: "chipsAmount",
            type: "uint16",
          },
          {
            internalType: "uint96",
            name: "betAmount",
            type: "uint96",
          },
          {
            internalType: "enum IBlackJack.HandStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isInsured",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDouble",
            type: "bool",
          },
        ],
        internalType: "struct IBlackJack.Hand",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHandIndex",
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
        name: "player",
        type: "address",
      },
    ],
    name: "getHandIndexesGame",
    outputs: [
      {
        internalType: "uint32[5]",
        name: "",
        type: "uint32[5]",
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
            components: [
              {
                internalType: "uint128",
                name: "wagerAmount",
                type: "uint128",
              },
              {
                internalType: "uint64",
                name: "activeHandIndex",
                type: "uint64",
              },
              {
                internalType: "uint32",
                name: "amountHands",
                type: "uint32",
              },
              {
                internalType: "bool",
                name: "canInsure",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "awaitingRandomness",
                type: "bool",
              },
              {
                internalType: "enum IBlackJack.GameStatus",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IBlackJack.Game",
            name: "game",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "player",
                    type: "address",
                  },
                  {
                    internalType: "uint96",
                    name: "gameIndex",
                    type: "uint96",
                  },
                  {
                    internalType: "uint16",
                    name: "chipsAmount",
                    type: "uint16",
                  },
                  {
                    internalType: "uint96",
                    name: "betAmount",
                    type: "uint96",
                  },
                  {
                    internalType: "enum IBlackJack.HandStatus",
                    name: "status",
                    type: "uint8",
                  },
                  {
                    internalType: "bool",
                    name: "isInsured",
                    type: "bool",
                  },
                  {
                    internalType: "bool",
                    name: "isDouble",
                    type: "bool",
                  },
                ],
                internalType: "struct IBlackJack.Hand",
                name: "hand",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint8[8]",
                    name: "cards",
                    type: "uint8[8]",
                  },
                  {
                    internalType: "uint8",
                    name: "amountCards",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "totalCount",
                    type: "uint8",
                  },
                  {
                    internalType: "bool",
                    name: "isSoftHand",
                    type: "bool",
                  },
                  {
                    internalType: "bool",
                    name: "canSplit",
                    type: "bool",
                  },
                ],
                internalType: "struct IBlackJack.Cards",
                name: "cards",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "splitHandIndex",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "handIndex",
                type: "uint256",
              },
            ],
            internalType: "struct IBlackJackStore.HandData[]",
            name: "hands",
            type: "tuple[]",
          },
        ],
        internalType: "struct IBlackJackStore.GameData",
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
        name: "_handIndex",
        type: "uint256",
      },
    ],
    name: "getSplitCouple",
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
    inputs: [],
    name: "handIndex",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "handIndexesGame",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hands",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "gameIndex",
        type: "uint96",
      },
      {
        internalType: "uint16",
        name: "chipsAmount",
        type: "uint16",
      },
      {
        internalType: "uint96",
        name: "betAmount",
        type: "uint96",
      },
      {
        internalType: "enum IBlackJack.HandStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "isInsured",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isDouble",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increaseGameIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "increaseHandIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_handIndex",
        type: "uint256",
      },
    ],
    name: "returnHand",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "gameIndex",
            type: "uint96",
          },
          {
            internalType: "uint16",
            name: "chipsAmount",
            type: "uint16",
          },
          {
            internalType: "uint96",
            name: "betAmount",
            type: "uint96",
          },
          {
            internalType: "enum IBlackJack.HandStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isInsured",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDouble",
            type: "bool",
          },
        ],
        internalType: "struct IBlackJack.Hand",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8[8]",
            name: "cards",
            type: "uint8[8]",
          },
          {
            internalType: "uint8",
            name: "amountCards",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "totalCount",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isSoftHand",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "canSplit",
            type: "bool",
          },
        ],
        internalType: "struct IBlackJack.Cards",
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
        internalType: "address",
        name: "_player",
        type: "address",
      },
    ],
    name: "returnHandIndexesInGame",
    outputs: [
      {
        internalType: "uint32[5]",
        name: "",
        type: "uint32[5]",
      },
      {
        internalType: "bool[5]",
        name: "",
        type: "bool[5]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_handIndex",
        type: "uint256",
      },
    ],
    name: "returnSplitCouple",
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
        name: "player",
        type: "address",
      },
      {
        internalType: "bool[5]",
        name: "activeHands",
        type: "bool[5]",
      },
    ],
    name: "setActiveHandsInGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "setActivePlayerMapping",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_handIndex",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint8[8]",
            name: "cards",
            type: "uint8[8]",
          },
          {
            internalType: "uint8",
            name: "amountCards",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "totalCount",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isSoftHand",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "canSplit",
            type: "bool",
          },
        ],
        internalType: "struct IBlackJack.Cards",
        name: "handCards",
        type: "tuple",
      },
    ],
    name: "setCards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_handIndex",
        type: "uint256",
      },
      {
        internalType: "uint8[13]",
        name: "drawCards",
        type: "uint8[13]",
      },
    ],
    name: "setDrawnCards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "wagerAmount",
            type: "uint128",
          },
          {
            internalType: "uint64",
            name: "activeHandIndex",
            type: "uint64",
          },
          {
            internalType: "uint32",
            name: "amountHands",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "canInsure",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "awaitingRandomness",
            type: "bool",
          },
          {
            internalType: "enum IBlackJack.GameStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct IBlackJack.Game",
        name: "game",
        type: "tuple",
      },
    ],
    name: "setGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "enum IBlackJack.HandResult[5]",
            name: "hands",
            type: "uint8[5]",
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
        ],
        internalType: "struct GameResultUtilsBJ.Params",
        name: "result",
        type: "tuple",
      },
    ],
    name: "setGameResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_handIndex",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "gameIndex",
            type: "uint96",
          },
          {
            internalType: "uint16",
            name: "chipsAmount",
            type: "uint16",
          },
          {
            internalType: "uint96",
            name: "betAmount",
            type: "uint96",
          },
          {
            internalType: "enum IBlackJack.HandStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isInsured",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDouble",
            type: "bool",
          },
        ],
        internalType: "struct IBlackJack.Hand",
        name: "hand",
        type: "tuple",
      },
    ],
    name: "setHand",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint32[5]",
        name: "indexes",
        type: "uint32[5]",
      },
    ],
    name: "setHandIndexesGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_handIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newHandIndex",
        type: "uint256",
      },
    ],
    name: "setSplitCouple",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "splitCouple",
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
] as const;
