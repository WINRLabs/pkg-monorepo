import React from "react";

import useKenoGameStore from "../store";
import { KenoGameResult } from "../types";

export type KenoGameProps = React.ComponentProps<"div"> & {
  gameResults: KenoGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: KenoGameResult[]) => void;
  onAnimationSkipped?: (result: KenoGameResult[]) => void;
};

export const KenoGame = ({ gameResults, children }: KenoGameProps) => {
  const { updateKenoGameResults, updateGameStatus } = useKenoGameStore([
    "updateKenoGameResults",
    "updateGameStatus",
  ]);

  React.useEffect(() => {
    if (gameResults.length) {
      updateKenoGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
