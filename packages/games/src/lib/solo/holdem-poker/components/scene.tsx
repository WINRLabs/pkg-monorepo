"use client";

import * as Progress from "@radix-ui/react-progress";
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

import { CDN_URL } from "../../../constants";
import { toDecimals, toFormatted } from "../../../utils/web3";
import { HOLDEM_POKER_GAME_STATUS, HoldemPokerGameProps } from "../types";
import { cn } from "../../../utils/style";
import { useEqualizeUnitySound } from "../../../hooks/use-unity-sound";
import { useListenUnityEvent } from "../../../hooks/use-listen-unity-event";
import {
  UnityCallEvent,
  UnityDealEvent,
  UnityFoldEvent,
  UnityNextGameAvailable,
  UnityPlayerHandWin,
  UnitySlotBetValue,
  UnityWaitForResult,
} from "../constants";
import { useDebounce } from "use-debounce";
import { WagerBetController } from "./bet-controller";

type HoldemPokerSceneProps = HoldemPokerGameProps & {
  buildedGameUrl: string;
};

const UNITY_LOADER_DELAY = 2500;

export const HoldemPokerScene = ({
  handleDeal,
  handleFinalize,
  handleFinalizeFold,
  onRefresh,
  onFormChange,
  isInitialDataFetched,
  activeGameData,
  buildedGameUrl,
  isLoggedIn,
  minWager,
  maxWager,
}: HoldemPokerSceneProps) => {
  const [ante, setAnte] = React.useState<number>(0);
  const [aaBonus, setAaBonus] = React.useState<number>(0);
  const [wager, setWager] = React.useState<number>(minWager || 1);

  const [status, setStatus] = React.useState<HOLDEM_POKER_GAME_STATUS>(
    HOLDEM_POKER_GAME_STATUS.OnIdle
  );

  const percentageRef = React.useRef(0);

  const BUILDED_GAME_URL = `${buildedGameUrl}/builded-games/holdem-poker`;

  const {
    sendMessage,
    loadingProgression,
    isLoaded: isUnityLoaded,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${BUILDED_GAME_URL}/HoldemPokerV2.loader.js`,
    dataUrl: `${BUILDED_GAME_URL}/HoldemPokerV2.data.unityweb`,
    frameworkUrl: `${BUILDED_GAME_URL}/HoldemPokerV2.framework.js.unityweb`,
    codeUrl: `${BUILDED_GAME_URL}/HoldemPokerV2.wasm.unityweb`,
  });

  const { unityEvent } = useListenUnityEvent();

  useEqualizeUnitySound({
    sendMessage,
  });

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  React.useEffect(() => {
    console.log(unityEvent, "unity event");

    if (unityEvent.name === UnityDealEvent) {
      console.log("Deal event");

      handleDealEvent();
    }

    if (unityEvent.name === UnityFoldEvent) handleFinalizeFoldEvent();

    if (unityEvent.name === UnityCallEvent) handleFinalizeEvent();

    if (unityEvent.name === UnityPlayerHandWin) {
      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `HP_SetResult|${toDecimals(
          activeGameData.payoutAmount + activeGameData.paybackAmount,
          2
        )}`
      );
    }

    if (unityEvent.name === UnityWaitForResult)
      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `HP_SetWinResult|${toDecimals(activeGameData.result, 2)}`
      );

    if (unityEvent.name === UnityNextGameAvailable) {
      onRefresh();

      sendMessage("WebGLHandler", "ReceiveMessage", "HP_HideResult");
    }

    if (unityEvent.name == UnitySlotBetValue) {
      const param = JSON.parse(unityEvent.strParam);

      handleUnityChipEvent(param);
    }
  }, [unityEvent]);

  const handleUnityChipEvent = (param: number[]) => {
    const id = param[0];
    const value = param[1] || 0;

    if (id == 0) setAnte(value);
    else setAaBonus(value);
  };

  const handleDealEvent = async () => {
    await handleDeal();

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      `ChangeState|${HOLDEM_POKER_GAME_STATUS.OnIdle}`
    );

    onRefresh();
  };

  const handleFinalizeEvent = async () => {
    await handleFinalize();

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      `ChangeState|${HOLDEM_POKER_GAME_STATUS.OnPlay}`
    );

    onRefresh();
  };

  const handleFinalizeFoldEvent = async () => {
    await handleFinalizeFold();

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      `ChangeState|${HOLDEM_POKER_GAME_STATUS.OnPlay}`
    );

    onRefresh();
  };

  React.useEffect(() => {
    console.log(
      isInitialDataFetched,
      activeGameData?.cards?.length,
      isUnityLoaded
    );

    if (
      isInitialDataFetched &&
      activeGameData?.cards?.length &&
      isUnityLoaded
    ) {
      const { cards, aaBonusChipAmount, anteChipAmount } = activeGameData;

      console.log(cards, "cards");

      setTimeout(
        () => {
          console.log(" sending data to unity ", activeGameData);

          sendMessage(
            "WebGLHandler",
            "ReceiveMessage",
            `HP_SendData|[${cards.join(
              ","
            )}/${anteChipAmount}/${aaBonusChipAmount}/0]`
          );

          sendMessage(
            "WebGLHandler",
            "ReceiveMessage",
            `HP_InitData|[${cards.join(
              ","
            )}/${anteChipAmount}/${aaBonusChipAmount}/0]`
          );

          sendMessage(
            "WebGLHandler",
            "ReceiveMessage",
            `HP_SetPlayerHandPokerState|${activeGameData.player.combination}`
          );

          sendMessage(
            "WebGLHandler",
            "ReceiveMessage",
            `ChangeState|${HOLDEM_POKER_GAME_STATUS.OnPlay}`
          );
        },

        UNITY_LOADER_DELAY
      );
    }
  }, [isInitialDataFetched, isUnityLoaded]);

  React.useEffect(() => {
    if (isUnityLoaded && isLoggedIn)
      setTimeout(
        () => sendMessage("WebGLHandler", "ReceiveMessage", "HP_Login"),
        UNITY_LOADER_DELAY
      );
  }, [isUnityLoaded, isLoggedIn]);

  React.useEffect(() => {
    if (activeGameData?.cards?.length) {
      const { cards, anteChipAmount, aaBonusChipAmount } = activeGameData;

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `HP_SendData|[${cards.join(
          ","
        )}/${anteChipAmount}/${aaBonusChipAmount}/0]`
      );

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `HP_SetPlayerHandPokerState|${activeGameData.player.combination}`
      );

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `HP_SetDealerHandPokerState|${activeGameData.dealer.combination}`
      );

      if (activeGameData.player.cards.length)
        sendMessage(
          "WebGLHandler",
          "ReceiveMessage",
          `HP_SetPlayerCardsData|${activeGameData.player.cards.join(",")}`
        );

      if (activeGameData.dealer.cards.length)
        sendMessage(
          "WebGLHandler",
          "ReceiveMessage",
          `HP_SetDealerCardsData|${activeGameData.dealer.cards.join(",")}`
        );
    }
  }, [activeGameData?.cards]);

  React.useEffect(() => {
    sendMessage("WebGLHandler", "ReceiveMessage", `HP_SetWager|${wager}`);
  }, [wager]);

  const formFields = React.useMemo(
    () => ({ ante, aaBonus, wager }),
    [ante, aaBonus, wager]
  );

  const debouncedFormFields = useDebounce(formFields, 400);

  React.useEffect(() => {
    onFormChange && onFormChange(debouncedFormFields[0]);
  }, [debouncedFormFields[0]]);

  return (
    <>
      {percentageRef.current !== 100 && (
        <div className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-flex wr-h-full wr-w-full wr-flex-col wr-items-center wr-justify-center wr-gap-4">
          <img
            src={`${CDN_URL}/holdem-poker/loader.png`}
            className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-h-full wr-w-full wr-rounded-md wr-object-cover"
          />
          <span
            style={{
              textShadow: "0 0 5px black, 0 0 5px black",
            }}
            className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
          >
            {toFormatted(percentageRef.current, 2)} %
          </span>
          <Progress.Root
            className="wr-radius-[1000px] wr-relative wr-z-50 wr-h-[25px] wr-w-[320px] wr-overflow-hidden wr-rounded-md wr-bg-black"
            style={{
              transform: "translateZ(0)",
            }}
            value={percentageRef.current}
          >
            <Progress.Indicator
              className="wr-h-full wr-w-full wr-bg-gradient-to-t wr-from-unity-coinflip-purple-700 wr-to-unity-coinflip-purple-400"
              style={{
                transform: `translateX(-${100 - percentageRef.current}%)`,
                transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
          </Progress.Root>
          <span
            style={{
              textShadow: "0 0 5px black, 0 0 5px black",
            }}
            className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
          >
            Holdem Poker
          </span>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        devicePixelRatio={1}
        className={cn("wr-h-full wr-w-full wr-rounded-md wr-bg-zinc-900")}
      />
      <WagerBetController
        className="wr-absolute wr-bottom-2 wr-right-2"
        wager={wager}
        setWager={setWager}
        minWager={minWager || 1}
        maxWager={maxWager || 2000}
        status={status}
      />
    </>
  );
};
