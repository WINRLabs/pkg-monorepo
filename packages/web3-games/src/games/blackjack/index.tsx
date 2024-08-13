"use client";

import {
  ActiveGameHands,
  BetHistoryTemplate,
  BlackjackCard,
  BlackjackFormFields,
  BlackjackGameStatus,
  BlackjackHandStatus,
  BlackjackTemplate,
  GameStruct,
  GameType,
} from "@winrlabs/games";
import {
  blackjackReaderAbi,
  controllerAbi,
  useBalanceStore,
  useCurrentAccount,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import React from "react";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
} from "viem";
import { useReadContract } from "wagmi";

import {
  useBetHistory,
  useListenGameEvent,
  usePlayerGameStatus,
} from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { DecodedEvent, prepareGameTransaction } from "../utils";
import {
  BJ_EVENT_TYPES,
  BlackjackContractHand,
  BlackjackDealerCardsEvent,
  BlackjackPlayerCardsEvent,
  BlackjackPlayerHandEvent,
  BlackjackResultEvent,
  BlackjackSettledEvent,
  BlackjackStandOffEvent,
} from "./types";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  onGameCompleted?: (payout: number) => void;
}

const defaultActiveGameHands = {
  dealer: {
    cards: null,
    hand: null,
  },
  firstHand: {
    cards: null,
    hand: null,
  },
  secondHand: {
    cards: null,
    hand: null,
  },
  thirdHand: {
    cards: null,
    hand: null,
  },
  splittedFirstHand: {
    cards: null,
    hand: null,
  },
  splittedSecondHand: {
    cards: null,
    hand: null,
  },
  splittedThirdHand: {
    cards: null,
    hand: null,
  },
};

const defaultGameData = {
  activeHandIndex: 0,
  canInsure: false,
  status: BlackjackGameStatus.NONE,
  payout: 0,
};

export default function BlackjackTemplateWithWeb3(
  props: TemplateWithWeb3Props
) {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
    wagmiConfig,
  } = useContractConfigContext();

  const {
    isPlayerHalted,
    isReIterable,
    playerLevelUp,
    playerReIterate,
    refetchPlayerGameStatus,
  } = usePlayerGameStatus({
    gameAddress: gameAddresses.blackjack,
    gameType: GameType.BLACKJACK,
    wagmiConfig,
  });

  const { tokens, selectedToken, setSelectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
    tokens: s.tokens,
    setSelectedToken: s.setSelectedToken,
  }));

  const balances = useBalanceStore((state) => state.balances);

  const gameEvent = useListenGameEvent();

  const { priceFeed } = usePriceFeed();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<BlackjackFormFields>({
    wager: props.minWager || 1,
    handIndex: 0,
    firstHandWager: 0,
    secondHandWager: 0,
    thirdHandWager: 0,
  });
  const [activeMove, setActiveMove] = React.useState<
    "Created" | "HitCard" | "StandOff" | "DoubleDown" | "Split" | "Insurance"
  >();

  const [activeGameData, setActiveGameData] =
    React.useState<GameStruct>(defaultGameData);

  const [activeGameHands, setActiveGameHands] = React.useState<ActiveGameHands>(
    defaultActiveGameHands
  );

  const [initialDataFetched, setInitialDataFetched] =
    React.useState<boolean>(false);

  const resetGame = () => {
    setActiveGameData(defaultGameData);
    setActiveGameHands(defaultActiveGameHands);
  };

  // TRANSACTIONS
  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || "0x",
  });
  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const encodedBetParams = React.useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const { firstHandWager, secondHandWager, thirdHandWager } = formValues;

    const betAmounts: any = [];

    if (firstHandWager > 0) betAmounts.push(firstHandWager);

    if (secondHandWager > 0) betAmounts.push(secondHandWager);

    if (thirdHandWager > 0) betAmounts.push(thirdHandWager);

    const amountHands = betAmounts.length;

    for (let i = 0; i < 3; i++) {
      console.log(betAmounts[i], "betamountsi");

      if (!betAmounts[i]) betAmounts.push(0);
    }

    console.log(betAmounts, "betamountys", amountHands);
    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "chipAmounts", type: "uint16[3]" },
        { name: "amountHands", type: "uint8" },
      ],
      [wagerInWei, betAmounts, amountHands]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "bet",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [
    formValues.firstHandWager,
    formValues.secondHandWager,
    formValues.thirdHandWager,
    formValues.wager,
    selectedToken.address,
    priceFeed[selectedToken.priceKey],
  ]);

  const encodedHitParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "handIndex", type: "uint256" }],
      [formValues.handIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "hitAnotherCard",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.handIndex, selectedToken.address]);

  const encodedStandParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "handIndex", type: "uint256" }],
      [formValues.handIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "standOff",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.handIndex, selectedToken.address]);

  const encodedDoubleParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "handIndex", type: "uint256" }],
      [formValues.handIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "doubleDown",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.handIndex, selectedToken.address]);

  const encodedSplitParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "handIndex", type: "uint256" }],
      [formValues.handIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "splitHand",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.handIndex, selectedToken.address]);

  const encodedBuyInsuranceParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "handIndex", type: "uint256" }],
      [formValues.handIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "buyInsurance",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.handIndex, selectedToken.address]);

  const handleBetTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "bet",
        encodedBetParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedBetParams.encodedTxData,
  });

  const handleHitTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "hitAnotherCard",
        encodedHitParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedHitParams.encodedTxData,
  });

  const handleStandTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "standOff",
        encodedStandParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedStandParams.encodedTxData,
  });

  const handleDoubleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "doubleDown",
        encodedDoubleParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedDoubleParams.encodedTxData,
  });

  const handleSplitTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "splitHand",
        encodedSplitParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedSplitParams.encodedTxData,
  });

  const handleBuyInsuranceTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.blackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "buyInsurance",
        encodedBuyInsuranceParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedBuyInsuranceParams.encodedTxData,
  });

  const handleStart = async () => {
    setIsLoading(true); // Set loading state to true
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleBetTx.mutateAsync();
      updateBalances();
    } catch (e: any) {
      console.log("error", e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleHit = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleHitTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleStand = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      await handleStandTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleDoubleDown = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleDoubleTx.mutateAsync();
      updateBalances();
    } catch (e: any) {
      console.log("error", e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleSplit = async () => {
    setIsLoading(true); // Set loading state to true
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleSplitTx.mutateAsync();
      updateBalances();
    } catch (e: any) {
      console.log("error", e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleBuyInsurance = async () => {
    setIsLoading(true); // Set loading state to true
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await handleBuyInsuranceTx.mutateAsync();
      updateBalances();
    } catch (e: any) {
      console.log("error", e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: blackjackReaderAbi,
    address: gameAddresses.blackjackReader,
    functionName: "getPlayerStatus",
    args: [currentAccount.address || "0x0000000"],
    query: {
      enabled: !!currentAccount.address,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
  });

  React.useEffect(() => {
    if (!gameDataRead.data) return;

    const { game, hands } = gameDataRead.data;
    const { activeHandIndex, status, canInsure } = game;

    if (!activeHandIndex) return;

    console.log(gameDataRead.data, "initial");

    setActiveGameData({
      activeHandIndex:
        status === BlackjackGameStatus.FINISHED ? 0 : Number(activeHandIndex),
      canInsure: canInsure,
      status: status,
    });

    setTimeout(() => {
      const _hands = hands as unknown as BlackjackContractHand[];

      for (let i = 0; i < _hands.length; i++) {
        const handId = Number(_hands[i]?.handIndex);
        const hand = hands[i] as unknown as BlackjackContractHand;

        if (i == 5) {
          // DEALER HAND
          const _amountCards = hand.cards.cards.filter((n) => n !== 0).length;

          const _totalCount = hand.cards.cards.reduce(
            (acc, cur) => acc + cur,
            0
          );

          setActiveGameHands((prev) => ({
            ...prev,
            dealer: {
              cards: {
                cards: hand.cards.cards,
                amountCards: _amountCards,
                totalCount: _totalCount,
                isSoftHand: hand.cards.isSoftHand,
                canSplit: false,
              },
              hand: null,
            },
          }));
        } else {
          // PLAYER HANDS
          if (handId == 0) continue;

          const _amountCards = hand.cards.cards.filter((n) => n !== 0).length;
          const _totalCount = hand.cards.cards.reduce(
            (acc, cur) => acc + cur,
            0
          );
          const _canSplit =
            _amountCards === 2 &&
            new BlackjackCard(hand.cards.cards[0] as number).value ===
              new BlackjackCard(hand.cards.cards[1] as number).value &&
            !hand.hand.isInsured &&
            i < 3;

          const handObject = {
            cards: {
              cards: hand.cards.cards,
              amountCards: _amountCards,
              totalCount: _totalCount,
              isSoftHand: hand.cards.isSoftHand,
              canSplit: _canSplit,
            },
            hand: {
              chipsAmount: Number(hand.hand.chipsAmount),
              isInsured: hand.hand.isInsured,
              status: hand.hand.status,
              isDouble: hand.hand.isDouble,
              isSplitted: false,
              splittedHandIndex: Number(hand.splitHandIndex),
            },
            handId,
            isCompleted:
              hand.hand.status !== BlackjackHandStatus.AWAITING_HIT ||
              hand.hand.status !== (BlackjackHandStatus.PLAYING as any),
          };

          if (i === 0)
            setActiveGameHands((prev) => ({
              ...prev,
              firstHand: handObject,
            }));

          if (i === 1)
            setActiveGameHands((prev) => ({
              ...prev,
              secondHand: handObject,
            }));

          if (i === 2)
            setActiveGameHands((prev) => ({
              ...prev,
              thirdHand: handObject,
            }));

          // splitted hands
          if (Number(_hands[0]?.splitHandIndex) === handId)
            setActiveGameHands((prev) => ({
              ...prev,
              splittedFirstHand: handObject,
            }));

          if (Number(_hands[1]?.splitHandIndex) === handId)
            setActiveGameHands((prev) => ({
              ...prev,
              splittedSecondHand: handObject,
            }));

          if (Number(_hands[2]?.splitHandIndex) === handId)
            setActiveGameHands((prev) => ({
              ...prev,
              splittedThirdHand: handObject,
            }));
        }
      }

      setInitialDataFetched(true);

      setTimeout(() => {
        setInitialDataFetched(false);
      }, 1000);
    }, 50);
  }, [gameDataRead.data]);

  React.useEffect(() => {
    if (!gameEvent) return;

    handleGameEvent(gameEvent);
  }, [gameEvent]);

  const handleGameEvent = (gameEvent: DecodedEvent<any, any>) => {
    switch (gameEvent.program[0]?.type) {
      case BJ_EVENT_TYPES.Settled: {
        const status = Number(gameEvent.program[0].data.game.status);

        // handle events by game status
        if (status == BlackjackGameStatus.FINISHED) {
          console.log("game finished");
          handleGameFinalizeEvent(gameEvent);
        }

        console.log(activeMove, "ACTIVE MOVE!");
        // handle events by active move
        if (activeMove == "Created") {
          setTimeout(() => {
            gameDataRead.refetch();
          }, 200);
        } else if (activeMove == "HitCard") {
          console.log("player hit move!");
          handlePlayerEvent(gameEvent);
        } else if (activeMove == "DoubleDown") {
          console.log("player double move!");
          handlePlayerEvent(gameEvent);
        } else if (activeMove == "Split") {
          console.log("player split move!");
          const playerCardsEvent = gameEvent.program[2]
            ?.data as BlackjackPlayerCardsEvent;
          const playerHandEvent = gameEvent.program[3]
            ?.data as BlackjackPlayerHandEvent;
          const splittedPlayerCardsEvent = gameEvent.program[4]
            ?.data as BlackjackPlayerCardsEvent;
          const splittedPlayerHandEvent = gameEvent.program[5]
            ?.data as BlackjackPlayerHandEvent;
          const settledEvent = gameEvent.program[0]
            ?.data as BlackjackSettledEvent;
          handleSplitEventCards(
            playerCardsEvent,
            playerHandEvent,
            settledEvent
          );
          handleSplitEventCards(
            splittedPlayerCardsEvent,
            splittedPlayerHandEvent,
            settledEvent
          );
        }
        break;
      }
      case BJ_EVENT_TYPES.Created:
        setActiveMove("Created");
        break;

      case BJ_EVENT_TYPES.HitCard: {
        setActiveMove("HitCard");
        break;
      }
      case BJ_EVENT_TYPES.StandOff: {
        console.log("player stand move!");
        setActiveMove("StandOff");
        handlePlayerStandEvent(gameEvent);
        break;
      }
      case BJ_EVENT_TYPES.DoubleDown: {
        setActiveMove("DoubleDown");
        break;
      }
      case BJ_EVENT_TYPES.Split: {
        setActiveMove("Split");
        handlePlayerSplitEvent(gameEvent);
        break;
      }
      case BJ_EVENT_TYPES.Insurance: {
        setActiveMove("Insurance");
        handleBuyInsuranceEvent(gameEvent);
      }
      default: {
        return;
      }
    }
  };

  // event handlers
  const handlePlayerEvent = (results: DecodedEvent<any, any>) => {
    const hitCardEvent = results.program[0]?.data as BlackjackSettledEvent;
    const playerCardsEvent = results.program[2]
      ?.data as BlackjackPlayerCardsEvent;
    const playerHandEvent = results.program[3]
      ?.data as BlackjackPlayerHandEvent;

    const handId = Number(playerCardsEvent.handIndex);

    let prevHand: ActiveGameHands["firstHand" | "secondHand" | "thirdHand"] =
      defaultActiveGameHands.firstHand;

    console.log("interested hand id:", handId);

    console.log(activeGameHands, "inner active game hands");

    if (activeGameHands.firstHand.handId === handId)
      prevHand = activeGameHands.firstHand;

    if (activeGameHands.secondHand.handId === handId)
      prevHand = activeGameHands.secondHand;

    if (activeGameHands.thirdHand.handId === handId)
      prevHand = activeGameHands.thirdHand;

    if (activeGameHands.splittedFirstHand.handId === handId)
      prevHand = activeGameHands.splittedFirstHand;

    if (activeGameHands.splittedSecondHand.handId === handId)
      prevHand = activeGameHands.splittedSecondHand;

    if (activeGameHands.splittedThirdHand.handId === handId)
      prevHand = activeGameHands.splittedThirdHand;

    console.log(prevHand, "previous hand", activeGameHands);

    const newHand: ActiveGameHands["firstHand" | "secondHand" | "thirdHand"] = {
      cards: {
        cards: playerCardsEvent.cards.cards,
        amountCards: playerCardsEvent.cards.cards.filter((n) => n !== 0).length,
        totalCount: playerCardsEvent.cards.totalCount,
        isSoftHand: playerCardsEvent.cards.isSoftHand,
        canSplit: prevHand.cards?.canSplit || false,
      },
      hand: {
        chipsAmount: prevHand.hand?.chipsAmount || 0,
        isInsured: playerHandEvent.isInsured,
        status: playerHandEvent.status,
        isDouble: playerHandEvent.isDouble,
        isSplitted: prevHand.hand?.isSplitted || false,
        splittedHandIndex: prevHand.hand?.splittedHandIndex || null,
      },
      handId,
    };

    console.log(newHand, "newHandObject with new fields");

    // set new hand data
    if (activeGameHands.firstHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, firstHand: newHand }));

    if (activeGameHands.secondHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, secondHand: newHand }));

    if (activeGameHands.thirdHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, thirdHand: newHand }));

    if (activeGameHands.firstHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedFirstHand: newHand }));

    if (activeGameHands.secondHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedSecondHand: newHand }));

    if (activeGameHands.thirdHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedThirdHand: newHand }));

    // set new game data
    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(hitCardEvent.game.activeHandIndex),
      status: Number(hitCardEvent.game.status),
    }));
  };

  const handlePlayerStandEvent = (gameEvent: DecodedEvent<any, any>) => {
    const standOffEvent = gameEvent.program[0]?.data as BlackjackStandOffEvent;

    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(standOffEvent.game.activeHandIndex),
    }));
  };

  const handlePlayerSplitEvent = (gameEvent: DecodedEvent<any, any>) => {
    const playerCardsEvent = gameEvent.program[2]
      ?.data as BlackjackPlayerCardsEvent;
    const splittedPlayerCardsEvent = gameEvent.program[4]
      ?.data as BlackjackPlayerCardsEvent;

    const handId = Number(playerCardsEvent.handIndex);
    const splittedHandId = Number(splittedPlayerCardsEvent.handIndex);

    if (handId === activeGameHands.firstHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        firstHand: {
          ...prev.firstHand,
          hand: {
            ...(prev.firstHand.hand as any),
            isSplitted: true,
            splittedHandIndex: splittedHandId,
          },
        },
        splittedFirstHand: {
          ...prev.splittedFirstHand,
          hand: {
            ...(prev.splittedFirstHand as any),
            chipsAmount: prev.firstHand.hand?.chipsAmount || 0,
          },
          cards: {
            ...(prev.splittedFirstHand.cards as any),
            canSplit: false,
          },
          handId: splittedHandId,
        },
      }));
    }

    if (handId === activeGameHands.secondHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        secondHand: {
          ...prev.secondHand,
          hand: {
            ...(prev.secondHand.hand as any),
            isSplitted: true,
            splittedHandIndex: splittedHandId,
          },
        },
        splittedSecondHand: {
          ...prev.splittedSecondHand,
          hand: {
            ...(prev.splittedSecondHand as any),
            chipsAmount: prev.secondHand.hand?.chipsAmount || 0,
          },
          cards: {
            ...(prev.splittedSecondHand.cards as any),
            canSplit: false,
          },
          handId: splittedHandId,
        },
      }));
    }

    if (handId === activeGameHands.thirdHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        thirdHand: {
          ...prev.thirdHand,
          hand: {
            ...(prev.thirdHand.hand as any),
            isSplitted: true,
            splittedHandIndex: splittedHandId,
          },
        },
        splittedThirdHand: {
          ...prev.splittedThirdHand,
          hand: {
            ...(prev.splittedThirdHand as any),
            chipsAmount: prev.thirdHand.hand?.chipsAmount || 0,
          },
          cards: {
            ...(prev.splittedThirdHand.cards as any),
            canSplit: false,
          },
          handId: splittedHandId,
        },
      }));
    }
  };

  const handleSplitEventCards = (
    playerCardsEvent: BlackjackPlayerCardsEvent,
    playerHandEvent: BlackjackPlayerHandEvent,
    settledEvent: BlackjackSettledEvent
  ) => {
    const handId = Number(playerCardsEvent.handIndex);

    let prevHand: ActiveGameHands["firstHand" | "secondHand" | "thirdHand"] =
      defaultActiveGameHands.firstHand;

    console.log("interested hand id:", handId);

    console.log(activeGameHands, "inner active game hands");

    if (activeGameHands.firstHand.handId === handId)
      prevHand = activeGameHands.firstHand;

    if (activeGameHands.secondHand.handId === handId)
      prevHand = activeGameHands.secondHand;

    if (activeGameHands.thirdHand.handId === handId)
      prevHand = activeGameHands.thirdHand;

    if (activeGameHands.splittedFirstHand.handId === handId)
      prevHand = activeGameHands.splittedFirstHand;

    if (activeGameHands.splittedSecondHand.handId === handId)
      prevHand = activeGameHands.splittedSecondHand;

    if (activeGameHands.splittedThirdHand.handId === handId)
      prevHand = activeGameHands.splittedThirdHand;

    console.log(prevHand, "previous hand", activeGameHands);

    const newHand: ActiveGameHands["firstHand" | "secondHand" | "thirdHand"] = {
      cards: {
        cards: playerCardsEvent.cards.cards,
        amountCards: playerCardsEvent.cards.cards.filter((n) => n !== 0).length,
        totalCount: playerCardsEvent.cards.totalCount,
        isSoftHand: playerCardsEvent.cards.isSoftHand,
        canSplit: prevHand.cards?.canSplit || false,
      },
      hand: {
        chipsAmount: prevHand.hand?.chipsAmount || 0,
        isInsured: playerHandEvent.isInsured,
        status: playerHandEvent.status,
        isDouble: playerHandEvent.isDouble,
        isSplitted: prevHand.hand?.isSplitted || false,
        splittedHandIndex: prevHand.hand?.splittedHandIndex || null,
      },
      handId,
    };

    console.log(newHand, "newHandObject with new fields");

    // set new hand data
    if (activeGameHands.firstHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, firstHand: newHand }));

    if (activeGameHands.secondHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, secondHand: newHand }));

    if (activeGameHands.thirdHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, thirdHand: newHand }));

    if (activeGameHands.firstHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedFirstHand: newHand }));

    if (activeGameHands.secondHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedSecondHand: newHand }));

    if (activeGameHands.thirdHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedThirdHand: newHand }));

    // set new game data
    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(settledEvent.game.activeHandIndex),
      status: Number(settledEvent.game.status),
    }));
  };

  const handleBuyInsuranceEvent = (gameEvent: DecodedEvent<any, any>) => {
    const playerHandEvent = gameEvent.program[1]
      ?.data as BlackjackPlayerHandEvent;
    const handId = Number(playerHandEvent.handIndex);

    if (handId === activeGameHands.firstHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        firstHand: {
          ...prev.firstHand,
          cards: {
            ...(prev.firstHand.cards as any),
            canSplit: false,
          },
          hand: {
            ...(prev.firstHand.hand as any),
            isInsured: true,
          },
        },
      }));
    }

    if (handId === activeGameHands.secondHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        secondHand: {
          ...prev.secondHand,
          cards: {
            ...(prev.secondHand.cards as any),
            canSplit: false,
          },
          hand: {
            ...(prev.secondHand.hand as any),
            isInsured: true,
          },
        },
      }));
    }

    if (handId === activeGameHands.thirdHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        thirdHand: {
          ...prev.thirdHand,
          cards: {
            ...(prev.thirdHand.cards as any),
            canSplit: false,
          },
          hand: {
            ...(prev.thirdHand.hand as any),
            isInsured: true,
          },
        },
      }));
    }
  };

  const handleGameFinalizeEvent = (gameEvent: DecodedEvent<any, any>) => {
    const results = gameEvent.program[1]?.data as BlackjackResultEvent;

    const dealerCardsEvent = gameEvent.program.find(
      (e) => e.type == BJ_EVENT_TYPES.DealerCards
    )?.data as BlackjackDealerCardsEvent;
    const gameResults = results.results[0];
    const gamePayout = Number(
      formatUnits(BigInt(results.results[1]), selectedToken.decimals)
    );
    const gamePayoutAsDollar = gamePayout * priceFeed[selectedToken.priceKey];

    setActiveGameHands((prev) => ({
      ...prev,
      dealer: {
        cards: {
          cards: dealerCardsEvent.cards.cards,
          amountCards: dealerCardsEvent.cards.cards.filter((n) => n !== 0)
            .length,
          totalCount: dealerCardsEvent.cards.totalCount,
          isSoftHand: dealerCardsEvent.cards.isSoftHand,
          canSplit: false,
        },
        hand: null,
      },
      firstHand: {
        ...prev.firstHand,
        settledResult: {
          result: gameResults[0],
        },
      },
      secondHand: {
        ...prev.secondHand,
        settledResult: {
          result: gameResults[1],
        },
      },
      thirdHand: {
        ...prev.thirdHand,
        settledResult: {
          result: gameResults[2],
        },
      },
    }));

    for (let i = 3; i < 5; i++) {
      const result = gameResults[i];
      const handId = results.results[3][i];

      if (handId == activeGameHands.splittedFirstHand.handId) {
        setActiveGameHands((prev) => ({
          ...prev,
          splittedFirstHand: {
            ...prev.splittedFirstHand,
            settledResult: {
              result: result,
            },
          },
        }));
      }
      if (handId == activeGameHands.splittedSecondHand.handId) {
        setActiveGameHands((prev) => ({
          ...prev,
          splittedSecondHand: {
            ...prev.splittedSecondHand,
            settledResult: {
              result: result,
            },
          },
        }));
      }
      if (handId == activeGameHands.splittedThirdHand.handId) {
        setActiveGameHands((prev) => ({
          ...prev,
          splittedThirdHand: {
            ...prev.splittedThirdHand,
            settledResult: {
              result: result,
            },
          },
        }));
      }
    }

    setActiveGameData((prev) => ({
      ...prev,
      status: BlackjackGameStatus.FINISHED,
      payout: gamePayoutAsDollar,
    }));
  };

  const {
    betHistory,
    isHistoryLoading,
    mapHistoryTokens,
    setHistoryFilter,
    refetchHistory,
  } = useBetHistory({
    gameType: GameType.BLACKJACK,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  const onGameCompleted = () => {
    props.onGameCompleted && props.onGameCompleted(activeGameData.payout || 0);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();
  };

  return (
    <>
      <BlackjackTemplate
        activeGameData={activeGameData}
        activeGameHands={activeGameHands}
        initialDataFetched={initialDataFetched}
        minWager={props.minWager}
        maxWager={props.maxWager}
        onFormChange={(v) => setFormValues(v)}
        onGameCompleted={onGameCompleted}
        isControllerDisabled={isLoading}
        onDeal={handleStart}
        onHit={handleHit}
        onDoubleDown={handleDoubleDown}
        onInsure={handleBuyInsurance}
        onSplit={handleSplit}
        onStand={handleStand}
        onReset={resetGame}
        options={{}}
        currencyList={tokens}
        selectedCurrency={selectedToken}
        balances={balances}
        onChangeCurrency={(t) => setSelectedToken(t)}
      />
      {!props.hideBetHistory && (
        <BetHistoryTemplate
          betHistory={betHistory || []}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
}
