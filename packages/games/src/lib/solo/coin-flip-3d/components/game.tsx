import React from "react";

import useCoinFlipGameStore from "../store";
import { CoinFlip3dGameResult } from "../types";

export type CoinFlip3dGameProps = React.ComponentProps<"div"> & {
  devicePixelRatio?: number;
  gameResults: CoinFlip3dGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: CoinFlip3dGameResult[]) => void;
};

export const CoinFlipGame = ({
  gameResults,
  children,
}: CoinFlip3dGameProps) => {
  const { updateCoinFlip3dGameResults, updateGameStatus } =
    useCoinFlipGameStore(["updateCoinFlip3dGameResults", "updateGameStatus"]);

  React.useEffect(() => {
    if (gameResults.length) {
      updateCoinFlip3dGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
