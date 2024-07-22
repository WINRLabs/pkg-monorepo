"use client";

import {
  ActiveGameHands,
  BlackjackCard,
  BlackjackFormFields,
  BlackjackGameStatus,
  BlackjackHandStatus,
  BlackjackTemplate,
  GameStruct,
} from "@winrlabs/games";
import {
  blackjackReaderAbi,
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import React from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";
import { useReadContract } from "wagmi";

import { useContractConfigContext } from "../hooks/use-contract-config";
import { DecodedEvent, prepareGameTransaction } from "../utils";
import { BJ_EVENT_TYPES, BlackjackContractHand } from "./types";
import { useListenGameEvent } from "../hooks";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onGameCompleted?: () => void;
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

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));

  const gameEvent = useListenGameEvent();

  const { priceFeed, getPrice } = usePriceFeed();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<BlackjackFormFields>({
    wager: props.minWager || 1,
    handIndex: 0,
    firstHandWager: 0,
    secondHandWager: 0,
    thirdHandWager: 0,
  });

  const [activeGameData, setActiveGameData] =
    React.useState<GameStruct>(defaultGameData);

  const [activeGameHands, setActiveGameHands] = React.useState<ActiveGameHands>(
    defaultActiveGameHands
  );

  const [initialDataFetched, setInitialDataFetched] =
    React.useState<boolean>(false);

  const [isRpcRefetched, setIsRpcRefetched] = React.useState<boolean>(false);

  const resetGame = () => {
    setActiveGameData(defaultGameData);

    setActiveGameHands(defaultActiveGameHands);

    setIsRpcRefetched(false);
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
      lastPrice: getPrice(selectedToken.address),
    });

    const { firstHandWager, secondHandWager, thirdHandWager } = formValues;

    const betAmounts: any = [0, 0, 0];

    if (firstHandWager > 0) betAmounts[0] = firstHandWager;

    if (secondHandWager > 0) betAmounts[1] = secondHandWager;

    if (thirdHandWager > 0) betAmounts[2] = thirdHandWager;

    const amountHands = betAmounts.length;

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
    priceFeed[selectedToken.address],
  ]);

  const encodedHitParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: getPrice(selectedToken.address),
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
      lastPrice: getPrice(selectedToken.address),
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
      lastPrice: getPrice(selectedToken.address),
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
      lastPrice: getPrice(selectedToken.address),
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
      lastPrice: getPrice(selectedToken.address),
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
      await handleBetTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleHit = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      await handleHitTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
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
      await handleDoubleTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
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
      await handleSplitTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
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

    const _hands = hands as unknown as BlackjackContractHand[];

    for (let i = 0; i < _hands.length; i++) {
      const handId = Number(_hands[i]?.handIndex);
      const hand = hands[i] as unknown as BlackjackContractHand;

      if (i == 5) {
        // DEALER HAND
        const _amountCards = hand.cards.cards.filter((n) => n !== 0).length;

        const _totalCount = hand.cards.cards.reduce((acc, cur) => acc + cur, 0);

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
        const _totalCount = hand.cards.cards.reduce((acc, cur) => acc + cur, 0);
        const _canSplit =
          _amountCards === 2 &&
          new BlackjackCard(hand.cards.cards[0] as number).value ===
            new BlackjackCard(hand.cards.cards[1] as number).value &&
          !hand.hand.isInsured;

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
  }, [gameDataRead.data]);

  React.useEffect(() => {
    if (!gameEvent) return;

    handleGameEvent(gameEvent);
  }, [gameEvent]);

  const handleGameEvent = (gameEvent: DecodedEvent<any, any>) => {
    switch (gameEvent.program[0]?.type) {
      case BJ_EVENT_TYPES.Settled: {
        gameDataRead.refetch();
        break;
      }
      case BJ_EVENT_TYPES.HitCard: {
        break;
      }
      case BJ_EVENT_TYPES.StandOff: {
        gameDataRead.refetch();
        break;
      }
    }
  };

  const onRefresh = () => {
    props.onGameCompleted && props.onGameCompleted();
    updateBalances();
  };

  return (
    <BlackjackTemplate
      activeGameData={activeGameData}
      activeGameHands={activeGameHands}
      initialDataFetched={initialDataFetched}
      minWager={props.minWager}
      maxWager={props.maxWager}
      onFormChange={(v) => setFormValues(v)}
      onGameCompleted={onRefresh}
      isControllerDisabled={isLoading}
      onDeal={handleStart}
      onHit={handleHit}
      onDoubleDown={handleDoubleDown}
      onInsure={handleBuyInsurance}
      onSplit={handleSplit}
      onStand={handleStand}
      onReset={resetGame}
      options={{}}
    />
  );
}
