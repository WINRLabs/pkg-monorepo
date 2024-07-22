import * as Progress from "@radix-ui/react-progress";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Unity, useUnityContext } from "react-unity-webgl";

import { useDevicePixelRatio } from "../../../hooks/use-device-pixel-ratio";
import { useListenUnityEvent } from "../../../hooks/use-listen-unity-event";
import { useEqualizeUnitySound } from "../../../hooks/use-unity-sound";
import { toFormatted } from "../../../utils/web3";
import { MultiplayerGameStatus } from "../../core/type";
import useCrashGameStore from "../store";
import { CrashForm } from "../types";

const UnityFinalizedEvent = "HR_GameEnd";

const BUILDED_GAME_URL = `https://jbassets.fra1.digitaloceanspaces.com/builded-games/crash`;

export const CrashScene = ({ onComplete }: { onComplete?: () => void }) => {
  const devicePixelRatio = useDevicePixelRatio();

  // const { address: currentAccount } = useCurrentAccount();
  const form = useFormContext() as CrashForm;
  const multiplier = form.watch("multiplier");

  const {
    status,
    participants,
    joiningFinish,
    updateState,
    resetParticipants,
    finalMultiplier,
    isGamblerParticipant,
  } = useCrashGameStore([
    "status",
    "participants",
    "joiningFinish",
    "updateState",
    "resetParticipants",
    "resetState",
    "finalMultiplier",
    "isGamblerParticipant",
  ]);

  const percentageRef = React.useRef(0);

  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${BUILDED_GAME_URL}/SpaceCat.loader.js`,
    dataUrl: `${BUILDED_GAME_URL}/SpaceCat.data.unityweb`,
    frameworkUrl: `${BUILDED_GAME_URL}/SpaceCat.framework.js.unityweb`,
    codeUrl: `${BUILDED_GAME_URL}/SpaceCat.wasm.unityweb`,
  });

  useEqualizeUnitySound({
    sendMessage,
  });

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  const { unityEvent } = useListenUnityEvent();

  // const timeLeftToStart = useCountdown(joiningFinish);

  // React.useEffect(() => {
  //   if (timeLeftToStart <= 0 && status === MultiplayerGameStatus.None) {
  //     updateState({
  //       status: MultiplayerGameStatus.Wait,
  //     });
  //   }
  // }, [timeLeftToStart, status]);

  React.useEffect(() => {
    if (isLoaded && status === MultiplayerGameStatus.Wait) {
      // prepare rocket
      sendMessage("WebGLHandler", "ReceiveMessage", "M_PrepareRocket");
    }

    if (isLoaded && status === MultiplayerGameStatus.Finish) {
      isGamblerParticipant &&
        sendMessage("WebGLHandler", "ReceiveMessage", `M_Win|${multiplier}`);

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        // `M_StartGame|${finalMultiplier}`
        `M_StartGame|${2}`
      );
    }
  }, [status, finalMultiplier, isLoaded]);

  React.useEffect(() => {
    if (unityEvent.name === "M_GameEnd") {
      onComplete && onComplete();

      setTimeout(() => {
        resetParticipants();
        sendMessage("WebGLHandler", "ReceiveMessage", "ResetGame");
      }, 1500);
    }
  }, [unityEvent]);

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  return (
    <>
      {percentageRef.current !== 100 && (
        <div className="wr-absolute wr-left-0 wr-top-0 wr-z-[100] wr-flex wr-h-[600px] wr-w-full wr-flex-col wr-items-center wr-justify-center wr-gap-4 md:wr-h-full">
          <img
            src={"/crash/loader.png"}
            alt="loader"
            className="wr-absolute wr-left-0 wr-top-0 wr-h-full wr-w-full wr-rounded-md"
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
              className="wr-h-full wr-w-full wr-bg-gradient-to-t wr-from-unity-horse-race-blue-400 wr-to-unity-horse-race-blue-600"
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
            Crash
          </span>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        devicePixelRatio={devicePixelRatio}
        className="wr-h-[600px] wr-w-full wr-rounded-md wr-bg-zinc-900 md:wr-h-full"
      />
    </>
  );
};
