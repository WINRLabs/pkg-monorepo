import React from "react";

import usePlinko3dGameStore from "../store";
import { Plinko3dGameResult } from "../types";

export type Plinko3dGameProps = React.ComponentProps<"div"> & {
  devicePixelRatio?: number;
  gameResults: Plinko3dGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: Plinko3dGameResult[]) => void;
};

export const Plinko3dGame = ({ gameResults, children }: Plinko3dGameProps) => {
  const { updatePlinkoGameResults, updateGameStatus } = usePlinko3dGameStore([
    "updatePlinkoGameResults",
    "updateGameStatus",
  ]);

  React.useEffect(() => {
    if (gameResults.length) {
      updatePlinkoGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults]);

  return <>{children}</>;
};
