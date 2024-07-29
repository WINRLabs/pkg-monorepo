"use client";

import {
  BaccaratFormFields,
  BaccaratGameResult,
  BaccaratGameSettledResult,
  BaccaratTemplate,
  BetHistoryTemplate,
  GameType,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";

import { useBetHistory } from "../hooks";
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
  hideBetHistory?: boolean;

  onAnimationCompleted?: (result: BaccaratGameSettledResult) => void;
}

export default function BaccaratGame(props: TemplateWithWeb3Props) {
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
  const { priceFeed } = usePriceFeed();

  const [baccaratResults, setBaccaratResults] =
    useState<BaccaratGameResult | null>(null);
  const [baccaratSettledResult, setBaccaratSettledResult] =
    React.useState<BaccaratGameSettledResult | null>(null);

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

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei, stopGainInWei, stopLossInWei } =
      prepareGameTransaction({
        wager: formValues.wager,
        stopGain: 0,
        stopLoss: 0,
        selectedCurrency: selectedToken,
        lastPrice: priceFeed[selectedToken.priceKey],
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
    formValues.bankerWager,
    formValues.playerWager,
    formValues.tieWager,
    formValues.wager,
    selectedToken.address,
    priceFeed[selectedToken.priceKey],
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.baccarat,
        selectedToken.bankrollIndex,
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

  const {
    betHistory,
    isHistoryLoading,
    mapHistoryTokens,
    setHistoryFilter,
    refetchHistory,
  } = useBetHistory({
    gameType: GameType.BACCARAT,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  const onGameCompleted = (result: BaccaratGameSettledResult) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    updateBalances();
  };
  return (
    <>
      <BaccaratTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        baccaratResults={baccaratResults}
        baccaratSettledResults={baccaratSettledResult}
        onAnimationCompleted={onGameCompleted}
        onFormChange={(val) => {
          setFormValues(val);
        }}
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
