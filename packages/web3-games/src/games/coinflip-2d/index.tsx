"use client";

import {
  BetHistoryTemplate,
  CoinFlipFormFields,
  CoinFlipGameResult,
  CoinFlipTemplate,
  CoinSide,
  GameType,
  useLiveResultStore,
} from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleGameTx,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  parseUnits,
} from "viem";

import { useBetHistory, usePlayerGameStatus } from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { useListenGameEvent } from "../hooks/use-listen-game-event";
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
  SingleStepSettledEvent,
} from "../utils";
import SuperJSON from "superjson";

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
  onAnimationCompleted?: (result: CoinFlipGameResult[]) => void;
  onAnimationSkipped?: (result: CoinFlipGameResult[]) => void;
}

interface CoinFlipStep {
  win: boolean;
  outcome: number;
  payout: bigint;
}

export default function CoinFlipGame(props: TemplateWithWeb3Props) {
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
    gameAddress: gameAddresses.coinFlip,
    gameType: GameType.COINFLIP,
    wagmiConfig,
  });

  const {
    addResult,
    updateGame,
    skipAll,
    clear: clearLiveResults,
  } = useLiveResultStore(["addResult", "clear", "updateGame", "skipAll"]);

  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState<CoinFlipFormFields>({
    betCount: 1,
    coinSide: CoinSide.HEADS,
    stopGain: 0,
    stopLoss: 0,
    wager: props.minWager || 1,
  });

  const gameEvent = useListenGameEvent();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));

  const { priceFeed } = usePriceFeed();

  const [coinFlipResult, setCoinFlipResult] = useState<CoinFlipStep[]>();
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

  const coinFlipSteps = useMemo(() => {
    if (!coinFlipResult) return [];

    return coinFlipResult.map((s) => {
      const payout =
        Number(formatUnits(s.payout, selectedToken.decimals)) *
        priceFeed[selectedToken.priceKey];
      return {
        coinSide: s.outcome,
        payout: payout,
        payoutInUsd: payout,
      };
    });
  }, [coinFlipResult]);

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
      [Number(formValues.coinSide)]
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
        gameAddresses.coinFlip as Address,
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
    formValues.coinSide,
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
        gameAddresses.coinFlip,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "bet",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
    encodedGameData: encodedParams.encodedGameData,
  });

  const onGameSubmit = async () => {
    clearLiveResults();
    setIsLoading(true); // Set loading state to true

    try {
      const tx = await handleTx.mutateAsync();

      if (tx?.event) {
        const decodedData = SuperJSON.parse(tx.event) as any;

        const gameSteps = decodedData.program[0]?.data.steps as CoinFlipStep[];

        setCoinFlipResult(gameSteps);

        setIsLoading(false);
      }
      console.log(tx, "TX");

      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            console.log("error", e);
          },
        });

        if (!handledAllowance) return;
      }
    } catch (e: any) {
      console.log("error", e);
      refetchPlayerGameStatus();
      setIsLoading(false); // Set loading state to false
    }
  };

  // React.useEffect(() => {
  //   const finalResult = gameEvent;

  //   if (finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled) {
  //     setCoinFlipResult(finalResult);
  //     updateGame({
  //       wager: formValues.wager || 0,
  //       betCount: formValues.betCount || 0,
  //     });
  //     setIsLoading(false);
  //   }
  // }, [gameEvent]);

  const {
    betHistory,
    isHistoryLoading,
    mapHistoryTokens,
    setHistoryFilter,
    refetchHistory,
  } = useBetHistory({
    gameType: GameType.COINFLIP,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  const onGameCompleted = (result: CoinFlipGameResult[]) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();
  };

  const onAnimationStep = React.useCallback(
    (step: number) => {
      props.onAnimationStep && props.onAnimationStep(step);

      const currentStepResult = coinFlipSteps[step - 1];

      if (!currentStepResult) return;

      addResult({
        won: !!currentStepResult.payout,
        payout: currentStepResult.payout,
      });
    },
    [coinFlipSteps]
  );

  const onAnimationSkipped = React.useCallback(
    (result: CoinFlipGameResult[]) => {
      skipAll(
        result.map((value) => ({
          won: value.payout > 0,
          payout: value.payoutInUsd,
        }))
      );
    },
    [coinFlipResult]
  );

  return (
    <>
      <CoinFlipTemplate
        {...props}
        isGettingResult={isLoading}
        onSubmitGameForm={onGameSubmit}
        gameResults={coinFlipSteps || []}
        onAnimationCompleted={onGameCompleted}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        onAnimationStep={onAnimationStep}
        onAnimationSkipped={onAnimationSkipped}
      />
      {!props.hideBetHistory && (
        <BetHistoryTemplate
          betHistory={betHistory}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
}
