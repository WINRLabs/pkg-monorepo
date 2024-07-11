import React from "react";

import { toDecimals } from "../utils/web3";
import { useAudioContext } from "./use-audio-effect";

export const useEqualizeUnitySound = ({
  sendMessage,
}: {
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: any
  ) => void;
}) => {
  const { volume } = useAudioContext();

  const unityVolume = React.useMemo(() => {
    if (volume === 0) return 0;

    return toDecimals(volume / 100, 2);
  }, [volume]);

  React.useEffect(() => {
    if (!sendMessage) {
      console.log("cant do");

      return;
    } else {
      sendMessage("WebGLHandler", "ReceiveMessage", `SetMusic|${unityVolume}`);

      sendMessage("WebGLHandler", "ReceiveMessage", `SetVolume|${unityVolume}`);
    }
  }, [unityVolume, sendMessage]);
};
