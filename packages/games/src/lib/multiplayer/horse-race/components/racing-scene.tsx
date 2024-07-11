import * as Progress from "@radix-ui/react-progress";
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

import { useDevicePixelRatio } from "../../../hooks/use-device-pixel-ratio";
import { useListenUnityEvent } from "../../../hooks/use-listen-unity-event";
import { useEqualizeUnitySound } from "../../../hooks/use-unity-sound";
import { toFormatted } from "../../../utils/web3";
import { HorseRaceStatus } from "../constants";
import useHorseRaceGameStore from "../store";

const UnityFinalizedEvent = "HR_GameEnd";

interface Props {
  onComplete?: () => void;
  buildedGameUrl: string;
}

export const RacingScene = ({ onComplete, buildedGameUrl }: Props) => {
  const devicePixelRatio = useDevicePixelRatio();

  const BUILDED_GAME_URL = `${buildedGameUrl}/builded-games/horse-racing`;

  const { status, winnerHorse, resetSelectedHorse } = useHorseRaceGameStore([
    "status",
    "winnerHorse",
    "resetSelectedHorse",
  ]);

  const percentageRef = React.useRef(0);

  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${BUILDED_GAME_URL}/HorseRacing.loader.js`,
    dataUrl: `${BUILDED_GAME_URL}/HorseRacing.data.unityweb`,
    frameworkUrl: `${BUILDED_GAME_URL}/HorseRacing.framework.js.unityweb`,
    codeUrl: `${BUILDED_GAME_URL}/HorseRacing.wasm.unityweb`,
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

  const startRace = () =>
    sendMessage("WebGLHandler", "ReceiveMessage", "StartRace");

  const finishRace = (winningHorse: number) => {
    sendMessage("WebGLHandler", "ReceiveMessage", `WinnerList|${winningHorse}`);
  };

  React.useEffect(() => {
    console.log(status, "GameStatus", HorseRaceStatus[status]);

    if (isLoaded && status === HorseRaceStatus.Race) {
      startRace();
    }

    if (winnerHorse !== undefined && status === HorseRaceStatus.Finished) {
      finishRace(Number(winnerHorse) - 1);
    }
  }, [status, winnerHorse]);

  React.useEffect(() => {
    if (unityEvent.name === UnityFinalizedEvent) {
      onComplete && onComplete();

      console.log("finish line!!");

      setTimeout(() => {
        resetSelectedHorse();

        sendMessage("WebGLHandler", "ReceiveMessage", "Reset");
      }, 3000);
    }
  }, [unityEvent]);

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  return (
    <>
      {percentageRef.current !== 100 && (
        <div className="wr-absolute wr-left-0 wr-top-0 wr-z-[100] wr-flex wr-h-[276px] wr-w-full wr-flex-col wr-items-center wr-justify-center wr-gap-4 md:wr-h-full">
          <img
            src={"/images/horse-race/loader.png"}
            alt="loader"
            className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-h-full wr-w-full wr-rounded-md"
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
            Horse Race
          </span>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        devicePixelRatio={devicePixelRatio}
        className="wr-h-[276px] wr-w-full wr-rounded-md wr-bg-zinc-900 md:wr-h-full"
      />

      {/* <div className="h-full w-full bg-zinc-950">
        <SelectedHorseDetail />
      </div> */}

      {/*    <div className="h-full w-full bg-zinc-950"></div> */}
    </>
  );
};
