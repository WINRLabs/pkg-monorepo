"use client";
import { useGameControllerGetMultiplayerGameHistory } from "@winrlabs/api";
import {
  GameType,
  MultiplayerGameStatus,
  toDecimals,
  useCrashGameStore,
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

import { useListenMultiplayerGameEvent } from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { GAME_HUB_GAMES, prepareGameTransaction } from "../utils";

type TemplateOptions = {
  scene?: {
    loader?: string;
    logo?: string;
  };
};

interface CrashTemplateProps {
  options?: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onAnimationCompleted?: (result: []) => void;
  gameUrl?: string;
}

const CrashGame = (props: CrashTemplateProps) => {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
  } = useContractConfigContext();
  const currentAccount = useCurrentAccount();
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

  const { getPrice } = usePriceFeed();

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues?.wager || 0,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken,
      lastPrice: getPrice(selectedToken.address),
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
  }, [formValues?.multiplier, formValues?.wager]);

  console.log("CRASH", gameEvent);
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
        "0x0000000000000000000000000000000000000005",
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
    } catch (error) {
      console.log("handleClaimTx error", error);
    }

    try {
      console.log(encodedParams.encodedTxData);
      await handleTx.mutateAsync();
      setIsGamblerParticipant(true);
    } catch (e: any) {
      console.log("handleTx error", e);
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

    if (participants?.length > 0 && isGameActive) {
      participants?.forEach((p) => {
        addParticipant({
          avatar: "",
          name: p.player,
          multiplier: fromHex(p.choice, {
            to: "number",
          }) as unknown as number,
          bet: Number(formatUnits(p.wager, 18)),
        });
      });
    }

    if (bet && bet?.converted?.wager && player) {
      addParticipant({
        avatar: "",
        name: player,
        multiplier: bet.choice as unknown as number,
        bet: bet.converted.wager,
      });
    }
  }, [gameEvent, currentAccount.address]);

  const onComplete = (multiplier: number) => {
    const isWon = multiplier <= gameEvent.result / 100;

    refetchBalances();

    if (isWon) {
      console.log("WON");
    }
  };

  useEffect(() => {
    if (betHistory && betHistory?.length > 0) {
      updateState({
        lastBets: betHistory.map((data) => Number(data.result) / 100),
      });
    }
  }, [betHistory]);

  return (
    <div>
      <CrashTemplate
        {...props}
        options={{
          scene: {
            logo: "/crash/game-logo.svg",
          },
        }}
        onComplete={onComplete}
        onSubmitGameForm={onGameSubmit}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        gameUrl={props.gameUrl}
      />
    </div>
  );
};

export default CrashGame;
