import React from "react";

import { useGameSkip } from "../../../game-provider";
import { useCoinFlipGameStore } from "..";
import { CoinFlipGameResult } from "../types";

export type CoinFlipGameProps = React.ComponentProps<"div"> & {
  gameResults: CoinFlipGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: CoinFlipGameResult[]) => void;
  onAnimationSkipped?: (result: CoinFlipGameResult[]) => void;
};

export const CoinFlipGame = ({ gameResults, children }: CoinFlipGameProps) => {
  const { updateCoinFlipGameResults, updateGameStatus } = useCoinFlipGameStore([
    "updateCoinFlipGameResults",
    "updateGameStatus",
  ]);

  const { updateSkipAnimation } = useGameSkip();

  React.useEffect(() => {
    if (gameResults.length) {
      updateSkipAnimation(false);
      updateCoinFlipGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
