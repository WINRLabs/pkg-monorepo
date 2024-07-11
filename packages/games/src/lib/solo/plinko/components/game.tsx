import React from "react";

import { useGameSkip } from "../../../game-provider";
import usePlinkoGameStore, { PlinkoLastBet } from "../store";
import { PlinkoGameResult } from "../types";

export type PlinkoGameProps = React.ComponentProps<"div"> & {
  gameResults: PlinkoGameResult[];
  onAnimationStep?: (step: number, multiplier: number) => void;
  onAnimationCompleted?: (result: PlinkoLastBet[]) => void;
  onAnimationSkipped?: (result: PlinkoLastBet[]) => void;
};

export const PlinkoGame = ({ gameResults, children }: PlinkoGameProps) => {
  const { updatePlinkoGameResults, updateGameStatus, gameStatus } =
    usePlinkoGameStore([
      "updatePlinkoGameResults",
      "updateGameStatus",
      "gameStatus",
    ]);

  const { updateSkipAnimation } = useGameSkip();

  React.useEffect(() => {
    if (gameResults.length) {
      updateSkipAnimation(false);
      updatePlinkoGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
