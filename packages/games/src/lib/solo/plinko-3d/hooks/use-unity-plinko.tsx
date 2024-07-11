"use client";

import React from "react";
import { useUnityContext } from "react-unity-webgl";

import { useEqualizeUnitySound } from "../../../hooks/use-unity-sound";

const GenerateTable = "P_GenerateTable";

function arrayToString(input: number[][]): string {
  // Map each inner array to a string and join the resulting array of strings with ', '
  return input?.map((arr) => `[${arr.join(",")}]`).join(", ");
}

export const useUnityPlinko = ({
  buildedGameUrl,
}: {
  buildedGameUrl: string;
}) => {
  const BUILDED_GAME_URL = `${buildedGameUrl}/builded-games/plinko`;

  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${BUILDED_GAME_URL}/Plinko.loader.js`,
    dataUrl: `${BUILDED_GAME_URL}/Plinko.data.unityweb`,
    frameworkUrl: `${BUILDED_GAME_URL}/Plinko.framework.js.unityweb`,
    codeUrl: `${BUILDED_GAME_URL}/Plinko.wasm.unityweb`,
  });

  useEqualizeUnitySound({
    sendMessage,
  });

  React.useEffect(() => {
    if (!isLoaded) return;

    handlePlinkoSize(10);
  }, [isLoaded]);

  const handlePlinkoSize = React.useCallback(
    (size: number) => {
      if (!sendMessage) return;

      if (size < 6 || size > 12) return;

      sendMessage("WebGLHandler", "ReceiveMessage", `${GenerateTable}|${size}`);
    },
    [sendMessage]
  );

  const handleSpawnBalls = React.useCallback(
    (results: number[][]) => {
      if (!sendMessage) return;

      if (!results) return;

      if (!results?.length) return;

      const parsedResults = arrayToString(results);

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `P_SpawnBall|${parsedResults}`
      );
    },
    [sendMessage]
  );

  return {
    detachAndUnloadImmediate,
    isLoaded,
    loadingProgression,
    sendMessage,
    unityProvider,
    handlePlinkoSize,
    handleSpawnBalls,
  };
};
