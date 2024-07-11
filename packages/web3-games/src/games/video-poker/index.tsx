"use client";

import {
  VideoPokerFormFields,
  VideoPokerResult,
  VideoPokerStatus,
  VideoPokerTemplate,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenStore,
  videoPokerAbi,
} from "@winrlabs/web3";
import React from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";
import { useReadContract } from "wagmi";

import { useListenGameEvent } from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { prepareGameTransaction } from "../utils";

interface TemplateWithWeb3Props {
  minWager?: number;
  maxWager?: number;
  onAnimationCompleted?: (payout: number) => void;
}

export default function VideoPokerGame(props: TemplateWithWeb3Props) {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
    wagmiConfig,
  } = useContractConfigContext();

  const [formValues, setFormValues] = React.useState<VideoPokerFormFields>({
    wager: props.minWager || 1,
    cardsToSend: [0, 0, 0, 0, 0],
  });
  const [settledCards, setSettledCards] = React.useState<{
    status: VideoPokerStatus;
    cards: number;
    result: VideoPokerResult;
    payout: number;
  }>();

  const gameEvent = useListenGameEvent();
  const currentAccount = useCurrentAccount();
  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { getPrice } = usePriceFeed();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const encodedParams = React.useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken.address,
      lastPrice: getPrice(selectedToken.address),
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: "wager", type: "uint128" }],
      [wagerInWei]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.videoPoker as Address,
        "0x0000000000000000000000000000000000000001",
        uiOperatorAddress as Address,
        "start",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.wager, selectedToken.address]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.videoPoker,
        "0x0000000000000000000000000000000000000001",
        uiOperatorAddress as Address,
        "start",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const encodedFinishParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken.address,
      lastPrice: 1,
    });

    const mappedCards = formValues.cardsToSend
      .map((item) => (item === 0 ? 1 : 0))
      .reverse()
      .join("");

    const _cardsToSend = parseInt(mappedCards, 2);

    const encodedGameData = encodeAbiParameters(
      [{ name: "change", type: "uint32" }],
      [_cardsToSend]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.videoPoker as Address,
        "0x0000000000000000000000000000000000000001",
        uiOperatorAddress as Address,
        "finish",
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.cardsToSend]);

  const handleFinishTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.videoPoker,
        "0x0000000000000000000000000000000000000001",
        uiOperatorAddress as Address,
        "finish",
        encodedFinishParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedFinishParams.encodedTxData,
  });

  const handleStartGame = async () => {
    console.log("SUBMITTING!");
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const handleFinishGame = async () => {
    console.log("FINISHING!");
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await handleFinishTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const gameRead = useReadContract({
    config: wagmiConfig,
    abi: videoPokerAbi,
    address: gameAddresses.videoPoker,
    account: currentAccount.address,
    functionName: "games",
    args: [currentAccount.address as Address],
    query: {
      enabled: !!currentAccount.address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });

  const activeGameData = React.useMemo(
    () => ({
      status: (gameRead.data?.[0] || 0) as unknown as VideoPokerStatus,
      cards: gameRead.data?.[1] || 0,
      hasActiveGame: !!(gameRead.data?.[0] == 2),
    }),
    [gameRead.dataUpdatedAt]
  );

  React.useEffect(() => {
    if (!gameEvent) return;

    if (gameEvent?.program[0]?.type == "Game") {
      const data = gameEvent.program[0].data;

      console.log("event");

      setSettledCards({
        cards: data.game.cards,
        status: data.game.status,
        result: data.detail.win,
        payout: data.detail.payout,
      });
    }
  }, [gameEvent]);

  return (
    <VideoPokerTemplate
      minWager={props.minWager || 1}
      maxWager={props.maxWager || 2000}
      handleStartGame={handleStartGame}
      handleFinishGame={handleFinishGame}
      onFormChange={(val) => setFormValues(val)}
      onAnimationCompleted={props.onAnimationCompleted}
      activeGame={activeGameData}
      settledCards={settledCards}
      isLoading={gameRead.isLoading}
    />
  );
}
