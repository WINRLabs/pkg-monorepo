"use client";

import {
  BaccaratFormFields,
  BaccaratGameResult,
  BaccaratGameSettledResult,
  BaccaratTemplate,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenStore,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";

import { useContractConfigContext } from "../hooks/use-contract-config";
import { useListenGameEvent } from "../hooks/use-listen-game-event";
import {
  BaccaratSettledEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
} from "../utils";

interface TemplateWithWeb3Props {
  minWager?: number;
  maxWager?: number;

  onAnimationCompleted?: (result: BaccaratGameSettledResult) => void;
}

export default function BaccaratTemplateWithWeb3(props: TemplateWithWeb3Props) {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
  } = useContractConfigContext();

  const [formValues, setFormValues] = useState<BaccaratFormFields>({
    wager: props?.minWager || 1,
    playerWager: 0,
    bankerWager: 0,
    tieWager: 0,
  });

  const gameEvent = useListenGameEvent();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { getPrice } = usePriceFeed();

  const [baccaratResults, setBaccaratResults] =
    useState<BaccaratGameResult | null>(null);
  const [baccaratSettledResult, setBaccaratSettledResult] =
    React.useState<BaccaratGameSettledResult | null>(null);

  const currentAccount = useCurrentAccount();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei, stopGainInWei, stopLossInWei } =
      prepareGameTransaction({
        wager: formValues.wager,
        stopGain: 0,
        stopLoss: 0,
        selectedCurrency: selectedToken.address,
        lastPrice: getPrice(selectedToken.address),
      });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: "tieWins",
          type: "uint16",
        },
        {
          name: "bankWins",
          type: "uint16",
        },
        {
          name: "playerWins",
          type: "uint16",
        },
      ],
      [formValues.tieWager, formValues.bankerWager, formValues.playerWager]
    );

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "stopGain", type: "uint128" },
        { name: "stopLoss", type: "uint128" },
        { name: "count", type: "uint8" },
        { name: "data", type: "bytes" },
      ],
      [
        wagerInWei,
        stopGainInWei as bigint,
        stopLossInWei as bigint,
        1,
        encodedChoice,
      ]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.baccarat as Address,
        "0x0000000000000000000000000000000000000001",
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
    formValues.bankerWager,
    formValues.playerWager,
    formValues.tieWager,
    formValues.wager,
    selectedToken.address,
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.baccarat,
        "0x0000000000000000000000000000000000000001",
        uiOperatorAddress as Address,
        "bet",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const onGameSubmit = async () => {
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

  React.useEffect(() => {
    if (gameEvent?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled) {
      console.log(gameEvent, "settled");
      const { hands, win, converted } = gameEvent.program[0]
        .data as BaccaratSettledEvent;

      setBaccaratResults({
        playerHand: hands.player,
        bankerHand: hands.banker,
      });

      setBaccaratSettledResult({
        won: win,
        payout: converted.payout,
        wager: 0,
      });
    }
  }, [gameEvent]);

  return (
    <BaccaratTemplate
      {...props}
      onSubmitGameForm={onGameSubmit}
      baccaratResults={baccaratResults}
      baccaratSettledResults={baccaratSettledResult}
      onFormChange={(val) => {
        setFormValues(val);
      }}
    />
  );
}
