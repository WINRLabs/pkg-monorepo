"use client";

import {
  CoinFlipGameResult,
  useWheelGameStore,
  WheelColor,
  WheelFormFields,
  WheelTemplate,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useTokenAllowance,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";
import { GAME_HUB_GAMES, prepareGameTransaction } from "../utils";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { useListenMultiplayerGameEvent } from "../hooks";

const selectedTokenAddress = (process.env.NEXT_PUBLIC_WETH_ADDRESS ||
  "0x0") as `0x${string}`;

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;

  onAnimationCompleted?: (result: CoinFlipGameResult[]) => void;
}

export default function WheelTemplateWithWeb3(props: TemplateWithWeb3Props) {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
  } = useContractConfigContext();
  const { updateState } = useWheelGameStore(["updateState"]);

  const [formValues, setFormValues] = useState<WheelFormFields>({
    color: WheelColor.IDLE,
    wager: 1,
  });

  const gameEvent = useListenMultiplayerGameEvent(GAME_HUB_GAMES.wheel);

  const currentAccount = useCurrentAccount();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress,
    showDefaultToasts: false,
  });

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedTokenAddress,
      lastPrice: 1,
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "color", type: "uint8" },
      ],
      [wagerInWei, formValues.color as unknown as number]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.wheel as Address,
        tokenAddress,
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
  }, [formValues.color, formValues.wager]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.wheel,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "claim",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const encodedClaimParams = useMemo(() => {
    // const { tokenAddress } = prepareGameTransaction({
    //   wager: formValues.wager,
    //   stopGain: 0,
    //   stopLoss: 0,
    //   selectedCurrency: selectedTokenAddress,
    //   lastPrice: 1,
    // });

    const encodedChoice = encodeAbiParameters([], []);

    const encodedParams = encodeAbiParameters(
      [
        { name: "address", type: "address" },
        {
          name: "data",
          type: "address",
        },
        {
          name: "bytes",
          type: "bytes",
        },
      ],
      [
        currentAccount.address || "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        encodedChoice,
      ]
    );

    const encodedClaimData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.wheel as Address,
        selectedTokenAddress,
        uiOperatorAddress as Address,
        "claim",
        encodedParams,
      ],
    });

    return {
      encodedClaimData,
      encodedClaimTxData: encodedClaimData,
      currentAccount,
    };
  }, [formValues.color, formValues.wager]);

  const handleClaimTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.wheel,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "claim",
        encodedClaimParams.encodedClaimData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedClaimParams.encodedClaimTxData,
  });

  const onGameSubmit = async () => {
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await handleClaimTx.mutateAsync();
    } catch (error) {}

    try {
      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
    }
  };

  React.useEffect(() => {
    if (!gameEvent) return;

    const gameProgram = gameEvent.program.find((p) => p.type == "Game");

    updateState({
      finishTime: gameProgram?.data.joinningStart,
      startTime: gameProgram?.data.joinningFinish,
    });

    const session = gameEvent.context.find((c) => c.type == "Session");

    if (session) {
      updateState({
        status: session.data.status,
      });
    }

    // const random = gameEvent.context.find((c) => c.type == "Randoms");

    // updateState({
    //   winnerAngle: random?.data ? random.data[0] : 0,
    // });
  }, [gameEvent]);

  return (
    <WheelTemplate
      {...props}
      onSubmitGameForm={onGameSubmit}
      onFormChange={(val) => {
        setFormValues(val);
      }}
    />
  );
}
