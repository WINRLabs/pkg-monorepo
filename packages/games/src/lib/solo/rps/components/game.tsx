import React from "react";

import { useGameSkip } from "../../../game-provider";
import useRpsGameStore from "../store";
import { RPSGameResult } from "../types";

export type RpsGameProps = React.ComponentProps<"div"> & {
  gameResults: RPSGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: RPSGameResult[]) => void;
  onAnimationSkipped?: (result: RPSGameResult[]) => void;
};

export const RpsGame = ({ gameResults, children }: RpsGameProps) => {
  const { updateRpsGameResults, updateGameStatus } = useRpsGameStore([
    "updateRpsGameResults",
    "updateGameStatus",
  ]);

  const { updateSkipAnimation } = useGameSkip();

  React.useEffect(() => {
    if (gameResults.length) {
      updateSkipAnimation(false);
      updateRpsGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
