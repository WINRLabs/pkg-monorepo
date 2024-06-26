import React from "react";
import { useGameSkip } from "../../../game-provider";
import { LimboGameResult } from "../types";
import useLimboGameStore from "../store";

export type LimboGameProps = React.ComponentProps<"div"> & {
  gameResults: LimboGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: LimboGameResult[]) => void;
  onAnimationSkipped?: (result: LimboGameResult[]) => void;
};

export const LimboGame = ({ gameResults, children }: LimboGameProps) => {
  const { updateLimboGameResults, updateGameStatus } = useLimboGameStore([
    "updateLimboGameResults",
    "updateGameStatus",
  ]);

  const { updateSkipAnimation } = useGameSkip();

  React.useEffect(() => {
    if (gameResults.length) {
      updateSkipAnimation(false);
      updateLimboGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
