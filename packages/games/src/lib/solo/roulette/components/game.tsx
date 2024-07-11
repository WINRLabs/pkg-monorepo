import React from "react";

import { useGameSkip } from "../../../game-provider";
import useRouletteGameStore from "../store";
import { RouletteGameProps } from "../types";

export const RouletteGame = ({
  gameResults,
  children,
}: RouletteGameProps & {
  children: React.ReactNode;
}) => {
  const { updateGameStatus, updateRouletteGameResults } = useRouletteGameStore([
    "updateRouletteGameResults",
    "updateGameStatus",
  ]);

  const { updateSkipAnimation, isAnimationSkipped } = useGameSkip();

  React.useEffect(() => {
    if (gameResults.length && !isAnimationSkipped) {
      updateRouletteGameResults(gameResults);
      updateGameStatus("PLAYING");
    }
  }, [gameResults, isAnimationSkipped]);

  React.useEffect(() => {
    if (gameResults.length) updateSkipAnimation(false);
  }, [gameResults]);

  return <>{children}</>;
};
