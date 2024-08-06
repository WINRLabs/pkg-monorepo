"use client";

import * as React from "react";

import { useGameSkip } from "../../../game-provider";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import useRangeGameStore from "../store";
import { DiceGameResult } from "../types";

export type RangeGameProps = React.ComponentProps<"div"> & {
  gameResults?: DiceGameResult[];
  /**
   * Runs on each animation step
   */
  onAnimationStep?: (step: number) => void;
  /**
   * Runs when the animation is completed
   */
  onAnimationCompleted?: (result: DiceGameResult[]) => void;
  onAnimationSkipped?: (result: DiceGameResult[]) => void;
};

export const RangeGame = ({
  onAnimationStep = () => {},
  onAnimationCompleted = () => {},
  onAnimationSkipped = () => {},
  gameResults,
  children,
}: RangeGameProps) => {
  const sliderEffect = useAudioEffect(SoundEffects.SPIN_TICK_1X);
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const { isAnimationSkipped, updateSkipAnimation } = useGameSkip();

  const {
    diceGameResults,
    updateCurrentAnimationCount,
    currentAnimationCount,
    updateDiceGameResults,
    addLastBet,
    updateLastBets,
    updateGameStatus,
  } = useRangeGameStore([
    "updateDiceGameResults",
    "diceGameResults",
    "updateCurrentAnimationCount",
    "currentAnimationCount",
    "updateRollValue",
    "rollValue",
    "addLastBet",
    "updateLastBets",
    "updateGameStatus",
  ]);

  React.useEffect(() => {
    if (gameResults) {
      updateDiceGameResults(gameResults);
    }

    if (gameResults?.length) {
      updateSkipAnimation(false);
    }
  }, [gameResults]);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastBetClearRef = React.useRef<NodeJS.Timeout | null>(null);

  const animCallback = async (curr = 0) => {
    const isAnimationFinished = curr === diceGameResults.length;

    if (isAnimationFinished) {
      setTimeout(() => {
        updateCurrentAnimationCount(0);
        onAnimationCompleted(diceGameResults);
      }, 500);
      updateDiceGameResults([]);

      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      return;
    }

    const currResult = diceGameResults[curr] as DiceGameResult;
    if (currResult.payout > 0) winEffect.play();

    sliderEffect.play();
    updateCurrentAnimationCount(curr);
    onAnimationStep(curr);
  };

  React.useEffect(() => {
    if (diceGameResults.length === 0) return;
    lastBetClearRef.current && clearTimeout(lastBetClearRef.current);
    const isSingleGame = diceGameResults.length == 1;

    if (isSingleGame) {
      updateGameStatus("ENDED");
    }

    if (!isAnimationSkipped) {
      let curr = currentAnimationCount;

      const stepTrigger = () => {
        const isGameEnded = curr === diceGameResults.length;

        if (isGameEnded) {
          updateGameStatus("ENDED");
        }

        animCallback(curr);
        diceGameResults[curr] &&
          addLastBet(diceGameResults[curr] as DiceGameResult);
        updateCurrentAnimationCount(curr);
        curr += 1;
      };

      if (isSingleGame) {
        stepTrigger();
        onAnimationCompleted(diceGameResults);

        lastBetClearRef.current = setTimeout(() => {
          updateDiceGameResults([]);
        }, 500);
      } else {
        intervalRef.current = setInterval(stepTrigger, 650);
      }
    } else {
      onSkip();
    }
  }, [diceGameResults, isAnimationSkipped]);

  const onSkip = () => {
    updateLastBets(diceGameResults);
    clearInterval(intervalRef.current as NodeJS.Timeout);
    setTimeout(() => {
      updateGameStatus("ENDED");
      onAnimationSkipped(diceGameResults);
      updateDiceGameResults([]);
      updateCurrentAnimationCount(0);
    }, 700);
  };

  return <>{children}</>;
};
