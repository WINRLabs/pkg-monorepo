'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import useRangeGameStore from '../store';
import { DiceForm, DiceFormFields, DiceGameResult } from '../types';

export type RangeGameProps = React.ComponentProps<'div'> & {
  gameResults?: DiceGameResult[];

  onSubmitGameForm: (f: DiceFormFields) => void;
  /**
   * Runs on each animation step
   */
  onAnimationStep?: (step: number) => void;
  /**
   * Runs when the animation is completed
   */
  onAnimationCompleted?: (result: DiceGameResult[]) => void;
};

export const RangeGame = ({
  onAnimationStep = () => {},
  onAnimationCompleted = () => {},
  onSubmitGameForm,
  onAutoBetModeChange,
  processStrategy,
  gameResults,
  isAutoBetMode,
  children,
}: RangeGameProps & {
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  processStrategy: (result: DiceGameResult[]) => void;
}) => {
  const sliderEffect = useAudioEffect(SoundEffects.SPIN_TICK_1X);
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const form = useFormContext() as DiceForm;
  const betCount = form.watch('betCount');
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const isAutoBetModeRef = React.useRef<boolean>();

  const {
    diceGameResults,
    updateCurrentAnimationCount,
    currentAnimationCount,
    updateDiceGameResults,
    addLastBet,
    updateLastBets,
    updateGameStatus,
  } = useRangeGameStore([
    'updateDiceGameResults',
    'diceGameResults',
    'updateCurrentAnimationCount',
    'currentAnimationCount',
    'updateRollValue',
    'rollValue',
    'addLastBet',
    'updateLastBets',
    'updateGameStatus',
  ]);

  React.useEffect(() => {
    if (gameResults) {
      updateDiceGameResults(gameResults);
    }
  }, [gameResults]);

  const animCallback = async (curr = 0) => {
    const isAnimationFinished = curr + 1 === diceGameResults.length;

    const currResult = diceGameResults[curr] as DiceGameResult;
    if (currResult.payout > 0) winEffect.play();

    sliderEffect.play();
    updateCurrentAnimationCount(curr);
    onAnimationStep(curr);

    if (isAnimationFinished) {
      onAnimationCompleted(diceGameResults);
      timeoutRef.current = setTimeout(() => {
        if (isAutoBetModeRef.current) {
          const newBetCount = betCount - 1;

          betCount !== 0 && form.setValue('betCount', betCount - 1);

          if (betCount >= 0 && newBetCount != 0) {
            onSubmitGameForm(form.getValues());
          } else {
            console.log('auto bet finished!');
            onAutoBetModeChange(false);
          }
        }
      }, 250);
    }
  };

  React.useEffect(() => {
    if (diceGameResults.length === 0) return;
    updateGameStatus('ENDED');
    processStrategy(diceGameResults);
    let curr = currentAnimationCount;

    const stepTrigger = () => {
      const isGameEnded = curr === diceGameResults.length;

      if (isGameEnded) {
        updateGameStatus('ENDED');
      }

      animCallback(curr);
      diceGameResults[curr] && addLastBet(diceGameResults[curr] as DiceGameResult);
      updateCurrentAnimationCount(curr);
      curr += 1;
    };

    stepTrigger();
  }, [diceGameResults]);

  React.useEffect(() => {
    isAutoBetModeRef.current = isAutoBetMode;
    if (!isAutoBetMode) clearTimeout(timeoutRef.current);
  }, [isAutoBetMode]);

  React.useEffect(() => {
    return () => {
      updateGameStatus('IDLE');
      updateDiceGameResults([]);
      updateLastBets([]);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return <>{children}</>;
};
