"use client";

import React, { useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";

import { useEqualizeUnitySound } from "../../../hooks/use-unity-sound";
import { useBonanzaGameStore } from "../store";
import { Bonanza_Unity_Methods } from "../types";

interface UseUnityBonanzaParams {
  buildedGameUrl: string;
  buildedGameUrlMobile: string;
}

export const useUnityBonanza = ({
  buildedGameUrl,
  buildedGameUrlMobile,
}: UseUnityBonanzaParams) => {
  const { gameUrl, setGameUrl, prevWidth, setPrevWidth } =
    useBonanzaGameStore();

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      if (
        (prevWidth <= 768 && currentWidth > 768) ||
        (prevWidth > 768 && currentWidth <= 768)
      ) {
        window.location.reload(); // Reload the page to ensure the game is loaded correctly

        // Update the URL based on the new width
        if (currentWidth > 768) {
          setGameUrl(buildedGameUrl);
        } else {
          setGameUrl(buildedGameUrlMobile);
        }
      }

      // Update the previous width state
      setPrevWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [prevWidth]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.innerWidth < 768
        ? setGameUrl(buildedGameUrl)
        : setGameUrl(buildedGameUrlMobile);
    }
  }, []);

  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: `${buildedGameUrl}/WinrBonanza.loader.js`,
    dataUrl: `${buildedGameUrl}/WinrBonanza.data.unityweb`,
    frameworkUrl: `${buildedGameUrl}/WinrBonanza.framework.js.unityweb`,
    codeUrl: `${buildedGameUrl}/WinrBonanza.wasm.unityweb`,
  });

  useEqualizeUnitySound({
    sendMessage,
  });

  const handleSetBalance = React.useCallback(
    (balance: string) => {
      if (!sendMessage) return;

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `${Bonanza_Unity_Methods.SET_CREDIT_VALUE}|${balance}`
      );
    },
    [sendMessage]
  );

  const handleSpinStatus = React.useCallback(
    (status: "active" | "inactive") => {
      if (!sendMessage) return;

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `${Bonanza_Unity_Methods.SET_SPIN_STATUS}|${status === "active"}`
      );
    },
    [sendMessage]
  );

  const handleSendGrid = React.useCallback(
    (grid: number[][]) => {
      if (!sendMessage) return;

      const _grid = JSON.stringify(grid).replace(/,/g, ", ");

      console.log(_grid, "replaced grid");

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `${Bonanza_Unity_Methods.SEND_GRID}|${_grid}`
      );
    },
    [sendMessage]
  );

  const handleUpdateWinText = React.useCallback(
    (win: string) => {
      if (!sendMessage) return;

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `${Bonanza_Unity_Methods.UPDATE_WIN_TEXT}|${win}`
      );
    },
    [sendMessage]
  );

  const handleFreespinAmount = React.useCallback(
    (amount: number) => {
      if (!sendMessage) return;

      sendMessage(
        "WebGLHandler",
        "ReceiveMessage",
        `${Bonanza_Unity_Methods.SET_FREESPIN_AMOUNT}|${amount}`
      );
    },
    [sendMessage]
  );

  const hideFreeSpinText = React.useCallback(() => {
    if (!sendMessage) return;

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      `${Bonanza_Unity_Methods.HIDE_FREE_SPIN_COUNT}`
    );
  }, [sendMessage]);

  const handleUnlockUi = React.useCallback(() => {
    if (!sendMessage) return;

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      Bonanza_Unity_Methods.UNLOCK_UI
    );
  }, [sendMessage]);

  const handleEnterFreespin = React.useCallback(() => {
    if (!sendMessage) return;

    console.log("ENTER WITH SCATTER");

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      Bonanza_Unity_Methods.ENTER_FREE_SPIN
    );
  }, [sendMessage]);

  const handleEnterFreespinWithoutScatter = React.useCallback(() => {
    if (!sendMessage) return;

    console.log("ENTER WITHOUT SCATTER");

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      "M3_EnterFreeSpinWithoutScatter"
    );
  }, [sendMessage]);

  const handleExitFreespin = React.useCallback(() => {
    if (!sendMessage) return;

    sendMessage(
      "WebGLHandler",
      "ReceiveMessage",
      Bonanza_Unity_Methods.EXIT_FREE_SPIN
    );
  }, [sendMessage]);

  const handleLogin = () => {
    if (!sendMessage) return;

    sendMessage("WebGLHandler", "ReceiveMessage", Bonanza_Unity_Methods.LOGIN);
  };

  return {
    detachAndUnloadImmediate,
    isLoaded,
    loadingProgression,
    sendMessage,
    unityProvider,
    handleLogin,
    handleSetBalance,
    handleUpdateWinText,
    handleUnlockUi,
    handleSendGrid,
    handleEnterFreespin,
    handleEnterFreespinWithoutScatter,
    handleExitFreespin,
    handleSpinStatus,
    handleFreespinAmount,
    hideFreeSpinText,
    addEventListener,
    removeEventListener,
  };
};
