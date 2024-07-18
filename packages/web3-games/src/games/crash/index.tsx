import { HorseRaceStatus, useHorseRaceGameStore } from "@winrlabs/games";
import { CrashFormFields, CrashTemplate } from "@winrlabs/games/src";
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useTokenAllowance,
  useTokenStore,
} from "@winrlabs/web3";
import { useEffect, useMemo, useState } from "react";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  parseUnits,
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
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  buildedGameUrl: string;
  onAnimationCompleted?: (result: []) => void;
}

const CrashGame = (props: CrashTemplateProps) => {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
  } = useContractConfigContext();

  const selectedToken = useTokenStore((s) => s.selectedToken);
  const selectedTokenAddress = selectedToken.address;

  const [formValues, setFormValues] = useState<CrashFormFields>({
    multiplier: 1,
    wager: 1,
  });

  const { updateState } = useHorseRaceGameStore(["updateState"]);

  const gameEvent = useListenMultiplayerGameEvent(GAME_HUB_GAMES.crash);

  console.log("gameEvent", gameEvent);

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
      wager: formValues?.wager || 0,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: "0x0000000000000000000000000000000000000002",
      lastPrice: 1,
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "multiplier", type: "uint256" },
      ],
      [wagerInWei, parseUnits(formValues.multiplier.toString(), 18)]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.crash as Address,
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
  }, [formValues?.multiplier, formValues?.wager]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.horseRace,
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
        gameAddresses.horseRace as Address,
        "0x0000000000000000000000000000000000000002",
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
        gameAddresses.horseRace,
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

  useEffect(() => {
    if (!gameEvent) return;

    console.log("gameEvent:", gameEvent);

    const currentTime = new Date().getTime() / 1000;

    const { cooldownFinish, joiningFinish, joiningStart, randoms, result } =
      gameEvent;

    const isGameFinished =
      currentTime >= joiningFinish && joiningFinish > 0 && randoms;
    const shouldWait =
      currentTime <= joiningFinish && currentTime >= joiningStart;

    if (shouldWait) {
      updateState({
        startTime: joiningFinish,
        finishTime: cooldownFinish,
        status: HorseRaceStatus.Started,
      });
    }
    if (isGameFinished) {
      updateState({
        status: HorseRaceStatus.Finished,
        winnerHorse: result,
      });
    }

    // if (bet && bet?.converted.wager && player) {
    //   const _participantHorse =
    //     horseRaceParticipantMapWithStore[bet?.choice as unknown as Horse];

    //   const names = selectedHorse[_participantHorse].map((item) => item.name);

    //   if (!names.includes(player)) {
    //     setSelectedHorse(_participantHorse, {
    //       bet: bet?.converted.wager,
    //       name: player,
    //     });
    //   }
    // }

    // if (participants?.length > 0 && isGameActive) {
    //   participants?.forEach((p) => {
    //     const _participantHorse =
    //       horseRaceParticipantMapWithStore[
    //         fromHex(p.choice, {
    //           to: "number",
    //         }) as unknown as Horse
    //       ];

    //     const names = selectedHorse[_participantHorse].map((item) => item.name);

    //     if (!names.includes(p.player)) {
    //       setSelectedHorse(_participantHorse, {
    //         bet: Number(formatUnits(p.wager, 18)) as number,
    //         name: p.player as string,
    //       });
    //     }
    //   });
    // }
  }, [gameEvent, currentAccount.address]);

  return (
    <div>
      <CrashTemplate
        {...props}
        currentAccount={currentAccount.address as `0x${string}`}
        buildedGameUrl={props.buildedGameUrl}
        onSubmitGameForm={onGameSubmit}
        onFormChange={(val) => {
          setFormValues(val);
        }}
      />
    </div>
  );
};

export default CrashGame;
