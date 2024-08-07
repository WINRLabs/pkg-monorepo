"use client";

import {
  BetHistoryTemplate,
  GameType,
  RockPaperScissors,
  RpsFormFields,
  RPSGameResult,
  RpsTemplate,
  useLiveResultStore,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleGameTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";

import { useBetHistory, usePlayerGameStatus } from "../hooks";
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
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: RPSGameResult[]) => void;
  onAnimationSkipped?: (result: RPSGameResult[]) => void;
}

export default function RpsGame(props: TemplateWithWeb3Props) {
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
    gameAddress: gameAddresses.rps,
    gameType: GameType.RPS,
    wagmiConfig,
  });

  const [formValues, setFormValues] = useState<RpsFormFields>({
    betCount: 1,
    rpsChoice: RockPaperScissors.ROCK,
    stopGain: 0,
    stopLoss: 0,
    wager: props?.minWager || 1,
  });

  const {
    addResult,
    updateGame,
    skipAll,
    clear: clearLiveResults,
  } = useLiveResultStore(["addResult", "clear", "updateGame", "skipAll"]);

  const gameEvent = useListenGameEvent();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [rpsResult, setRpsResult] =
    useState<DecodedEvent<any, SingleStepSettledEvent>>();
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

  const rpsSteps = useMemo(() => {
    if (!rpsResult) return [];

    return rpsResult?.program?.[0]?.data.converted.steps.map((s) => ({
      rps: s.outcome as unknown as RockPaperScissors,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [rpsResult]);

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
      [Number(formValues.rpsChoice)]
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
        gameAddresses.rps as Address,
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
    formValues.rpsChoice,
    formValues.stopGain,
    formValues.stopLoss,
    formValues.wager,
    selectedToken.address,
    priceFeed[selectedToken.priceKey],
  ]);

  const handleTx = useHandleGameTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.rps as Address,
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
    clearLiveResults();

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
      setRpsResult(finalResult);
      updateGame({
        wager: formValues.wager || 0,
        betCount: formValues.betCount || 0,
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
    gameType: GameType.RPS,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  const onGameCompleted = (result: RPSGameResult[]) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();
  };

  const onAnimationStep = React.useCallback(
    (step: number) => {
      props.onAnimationStep && props.onAnimationStep(step);

      const currentStepResult =
        rpsResult?.program?.[0]?.data.converted.steps[step - 1];

      if (!currentStepResult) return;

      addResult({
        won: currentStepResult.win,
        payout: currentStepResult.payout,
      });
    },
    [rpsResult]
  );

  const onAnimationSkipped = React.useCallback(
    (result: RPSGameResult[]) => {
      skipAll(
        result.map((value) => ({
          won: value.payout > 0,
          payout: value.payoutInUsd,
        }))
      );
    },
    [rpsResult]
  );

  return (
    <>
      <RpsTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={rpsSteps || []}
        onAnimationCompleted={onGameCompleted}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        onAnimationStep={onAnimationStep}
        onAnimationSkipped={onAnimationSkipped}
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
