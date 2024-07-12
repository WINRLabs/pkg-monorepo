"use client";

import {
  ANGLE_SCALE,
  CoinFlipGameResult,
  MultiplayerGameStatus,
  Multiplier,
  participantMapWithStore,
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
  useTokenStore,
} from "@winrlabs/web3";
import React, { useMemo, useState } from "react";
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
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;

  onAnimationCompleted?: (result: CoinFlipGameResult[]) => void;
}

export default function WheelGame(props: TemplateWithWeb3Props) {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
  } = useContractConfigContext();
  const selectedToken = useTokenStore((s) => s.selectedToken);
  const selectedTokenAddress = selectedToken.address;

  const { updateState, setWheelParticipant, setIsGamblerParticipant } =
    useWheelGameStore([
      "updateState",
      "setWheelParticipant",
      "setIsGamblerParticipant",
    ]);

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
      selectedCurrency: "0x0000000000000000000000000000000000000001",
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
        "0x0000000000000000000000000000000000000001",
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

    setIsGamblerParticipant(true);
  };

  React.useEffect(() => {
    if (!gameEvent) return;

    const currentTime = new Date().getTime() / 1000;
    let status: MultiplayerGameStatus = MultiplayerGameStatus.None;

    const {
      cooldownFinish,
      joiningFinish,
      joiningStart,
      randoms,
      result,
      player,
      bet,
      participants,
      isGameActive,
      angle,
    } = gameEvent;

    const isGameFinished =
      currentTime >= joiningFinish && joiningFinish > 0 && randoms;
    const shouldWait =
      currentTime <= joiningFinish && currentTime >= joiningStart;

    if (shouldWait) {
      status = MultiplayerGameStatus.Wait;
    }

    if (isGameFinished) {
      status = MultiplayerGameStatus.Finish;
    }

    updateState({
      status,
      joiningFinish,
      joiningStart,
      cooldownFinish,
      winnerColor: result as unknown as WheelColor,
      winnerAngle: Number(angle) / 100000 / ANGLE_SCALE,
    });

    if (participants?.length > 0 && isGameActive) {
      participants.forEach((p) => {
        if (p.player === currentAccount.address) {
          setIsGamblerParticipant(true);
        }

        setWheelParticipant(
          participantMapWithStore[
            fromHex(p.choice, {
              to: "number",
            }) as unknown as WheelColor
          ],
          {
            player: p.player,
            bet: Number(formatUnits(p.wager, 18)),
          }
        );
      });
    }

    if (bet && bet?.converted?.wager && player) {
      setWheelParticipant(participantMapWithStore[bet.choice] as Multiplier, {
        player: player,
        bet: bet.converted.wager,
      });
    }
  }, [gameEvent, currentAccount.address]);

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
