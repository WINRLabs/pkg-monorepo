"use client";

import {
  BetHistoryTemplate,
  GameType,
  Plinko3dFormFields,
  Plinko3dGameResult,
  Plinko3dTemplate,
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

import { useBetHistory, useGetBadges, usePlayerGameStatus } from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { useListenGameEvent } from "../hooks/use-listen-game-event";
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
  SingleStepSettledEvent,
} from "../utils";

type TemplateOptions = {
  scene?: {
    loader: string;
  };
  betController: {
    logo: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  buildedGameUrl: string;
  minWager?: number;
  maxWager?: number;
  devicePixelRatio?: number;
  hideBetHistory?: boolean;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: Plinko3dGameResult[]) => void;
}

export default function Plinko3DGame(props: TemplateWithWeb3Props) {
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
    gameAddress: gameAddresses.plinko,
    gameType: GameType.PLINKO,
    wagmiConfig,
  });

  const [formValues, setFormValues] = useState<Plinko3dFormFields>({
    betCount: 1,
    stopGain: 0,
    stopLoss: 0,
    wager: props.minWager || 1,
    plinkoSize: 10,
  });

  const gameEvent = useListenGameEvent();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [plinkoResult, setPlinkoResult] =
    useState<DecodedEvent<any, SingleStepSettledEvent<number[]>>>();
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

  const plinkoSteps = useMemo(() => {
    if (!plinkoResult) return [];

    return plinkoResult?.program?.[0]?.data.converted.steps.map((s) => ({
      outcomes: s.outcome.map((n) => (n > 0 ? 1 : 0)),
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [plinkoResult]);

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei, stopGainInWei, stopLossInWei } =
      prepareGameTransaction({
        wager: formValues.wager,
        stopGain: formValues.stopGain,
        stopLoss: formValues.stopLoss,
        selectedCurrency: selectedToken,
        lastPrice: priceFeed[selectedToken.priceKey],
      });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: "data",
          type: "uint8",
        },
      ],
      [Number(formValues.plinkoSize)]
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
        formValues.betCount,
        encodedChoice,
      ]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.plinko as Address,
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
    formValues.betCount,
    formValues.plinkoSize,
    formValues.stopGain,
    formValues.stopLoss,
    formValues.wager,
    selectedToken.address,
    priceFeed[selectedToken.priceKey],
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.plinko as Address,
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

      await handleTx.mutateAsync();
    } catch (e: any) {
      console.log("error", e);
      refetchPlayerGameStatus();
    }
  };

  React.useEffect(() => {
    const finalResult = gameEvent;

    if (finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled) {
      setPlinkoResult(finalResult);
    }
  }, [gameEvent]);

  const {
    betHistory,
    isHistoryLoading,
    mapHistoryTokens,
    setHistoryFilter,
    refetchHistory,
  } = useBetHistory({
    gameType: GameType.PLINKO,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  const { handleGetBadges } = useGetBadges();

  const onGameCompleted = (result: Plinko3dGameResult[]) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const totalWager = formValues.wager * formValues.betCount;
    const totalPayout = result.reduce((acc, cur) => acc + cur.payoutInUsd, 0);
    handleGetBadges({ totalWager, totalPayout });
  };

  return (
    <>
      <div>
        <Plinko3dTemplate
          {...props}
          onSubmitGameForm={onGameSubmit}
          gameResults={plinkoSteps || []}
          onAnimationCompleted={onGameCompleted}
          onFormChange={(val) => {
            setFormValues(val);
          }}
        />
      </div>
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
