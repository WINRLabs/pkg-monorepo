"use client";
import { useGameControllerGetMultiplayerGameHistory } from "@winrlabs/api";
import {
  BetHistoryTemplate,
  GameType,
  MultiplayerGameStatus,
  toDecimals,
  useConfigureMultiplayerLiveResultStore,
  useCrashGameStore,
  useLiveResultStore,
} from "@winrlabs/games";
import { CrashFormFields, CrashTemplate } from "@winrlabs/games";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
} from "@winrlabs/web3";
import { useEffect, useMemo, useState } from "react";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  fromHex,
} from "viem";

import {
  useBetHistory,
  useListenMultiplayerGameEvent,
  usePlayerGameStatus,
} from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { GAME_HUB_GAMES, prepareGameTransaction } from "../utils";

type TemplateOptions = {
  scene?: {
    loader?: string;
    logo?: string;
  };
};

interface CrashTemplateProps {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  onAnimationCompleted?: (result: []) => void;
  gameUrl?: string;
}

const CrashGame = (props: CrashTemplateProps) => {
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
    gameAddress: gameAddresses.crash,
    gameType: GameType.MOON,
    wagmiConfig,
  });

  const currentAccount = useCurrentAccount();
  const allTokens = useTokenStore((s) => s.tokens);
  const selectedToken = useTokenStore((s) => s.selectedToken);
  const selectedTokenAddress = selectedToken.address;
  const { data: betHistory, refetch: refetchBetHistory } =
    useGameControllerGetMultiplayerGameHistory({
      queryParams: {
        game: GameType.MOON,
        // TODO: swagger does not include the pagination params. ask be to fix it.
        // @ts-ignore
        limit: 7,
      },
    });
  const { refetch: refetchBalances } = useTokenBalances({
    account: currentAccount.address || "0x0000000",
    balancesToRead: [selectedTokenAddress],
  });

  useConfigureMultiplayerLiveResultStore();
  const {
    addResult,
    updateGame,
    clear: clearLiveResults,
  } = useLiveResultStore(["addResult", "clear", "updateGame", "skipAll"]);

  const [formValues, setFormValues] = useState<CrashFormFields>({
    multiplier: 1,
    wager: 1,
  });

  const { updateState, addParticipant, setIsGamblerParticipant } =
    useCrashGameStore([
      "updateState",
      "addParticipant",
      "setIsGamblerParticipant",
    ]);

  const gameEvent = useListenMultiplayerGameEvent(GAME_HUB_GAMES.crash);

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress,
    showDefaultToasts: false,
  });

  const { priceFeed } = usePriceFeed();

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues?.wager || 0,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "multiplier", type: "uint16" },
      ],
      [wagerInWei, toDecimals(formValues.multiplier * 100)]
    );

    const encodedData = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.crash as Address,
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
    formValues.multiplier,
    formValues.wager,
    priceFeed[selectedToken.priceKey],
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.crash,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        "bet",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      forceRefetch: true,
    },
    encodedTxData: encodedParams.encodedTxData,
  });

  const encodedClaimParams = useMemo(() => {
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
        gameAddresses.crash as Address,
        selectedToken.bankrollIndex,
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
  }, [formValues.multiplier, formValues.wager]);

  const handleClaimTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.crash,
        selectedToken.bankrollIndex,
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
      await handleClaimTx.mutateAsync();
    } catch (error) {
      console.log("handleClaimTx error", error);
    }

    try {
      if (isPlayerHalted) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleTx.mutateAsync();
      setIsGamblerParticipant(true);
    } catch (e: any) {
      console.log("handleTx error", e);
      refetchPlayerGameStatus();
    }
  };

  useEffect(() => {
    if (!gameEvent) return;
    const currentTime = new Date().getTime() / 1000;

    const {
      joiningFinish,
      joiningStart,
      randoms,
      cooldownFinish,
      bet,
      player,
      participants,
      result,
      session,
      isGameActive,
    } = gameEvent;

    const isGameFinished =
      currentTime >= joiningFinish && joiningFinish > 0 && randoms;
    const shouldWait =
      currentTime <= joiningFinish && currentTime >= joiningStart;

    let status: MultiplayerGameStatus = MultiplayerGameStatus.None;

    if (shouldWait) {
      updateState({
        status: MultiplayerGameStatus.Wait,
      });
    } else if (isGameFinished) {
      status = MultiplayerGameStatus.Finish;
    }

    updateState({
      status,
      joiningFinish,
      joiningStart,
      cooldownFinish,
      finalMultiplier: result / 100,
    });

    updateGame({
      wager: formValues.wager || 0,
    });

    const token = allTokens.find(
      (t) => t.bankrollIndex === session.bankrollIndex
    );
    const tokenDecimal = token?.decimals || 0;

    if (participants?.length > 0 && isGameActive) {
      participants?.forEach((p) => {
        addParticipant({
          avatar: "",
          name: p.player,
          multiplier: fromHex(p.choice, {
            to: "number",
          }) as unknown as number,
          bet: Number(formatUnits(p.wager, tokenDecimal)),
        });
      });
    }

    if (bet && bet?.converted?.wager && player) {
      addParticipant({
        avatar: "",
        name: player,
        multiplier: bet.choice as unknown as number,
        bet: Number(formatUnits(bet.wager, tokenDecimal)),
      });
    }
  }, [gameEvent, currentAccount.address]);

  const onComplete = (multiplier: number) => {
    const userMultiplier = formValues.multiplier;
    const isWon = userMultiplier <= multiplier;

    refetchBalances();
    refetchBetHistory();
    refetchHistory();
    refetchPlayerGameStatus();

    addResult({
      won: isWon,
      payout: isWon ? formValues.wager * userMultiplier : 0,
    });
  };

  useEffect(() => {
    if (betHistory && betHistory?.length > 0) {
      updateState({
        lastBets: betHistory.map((data) => Number(data.result) / 100),
      });
    }
  }, [betHistory]);

  const {
    betHistory: allBetHistory,
    isHistoryLoading,
    mapHistoryTokens,
    setHistoryFilter,
    refetchHistory,
  } = useBetHistory({
    gameType: GameType.MOON,
    options: {
      enabled: !props.hideBetHistory,
    },
  });

  return (
    <>
      <CrashTemplate
        {...props}
        onComplete={onComplete}
        onSubmitGameForm={onGameSubmit}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        gameUrl={props.gameUrl}
      />
      {!props.hideBetHistory && (
        <BetHistoryTemplate
          betHistory={allBetHistory || []}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
};

export default CrashGame;
