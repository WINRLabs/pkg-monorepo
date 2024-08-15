import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useGameSkip } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { FormField, FormItem, FormMessage } from '../../../ui/form';
import { cn } from '../../../utils/style';
import { ALL_DICES } from '../constant';
import useRollGameStore from '../store';
import { RollForm, RollGameResult } from '../types';
import Dice from './dice';

export interface GameAreaProps {
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: RollGameResult[]) => void;
  onAnimationSkipped?: (result: RollGameResult[]) => void;
}

export const GameArea: React.FC<GameAreaProps> = ({
  onAnimationCompleted,
  onAnimationStep,
  onAnimationSkipped = () => {},
}) => {
  const form = useFormContext() as RollForm;

  const selectedDices = form.watch('dices');

  const skipRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const { isAnimationSkipped } = useGameSkip();

  const flipEffect = useAudioEffect(SoundEffects.ROLLING_DICE);

  const winEffect = useAudioEffect(SoundEffects.WIN);

  const [loading, setLoading] = React.useState(false);

  const {
    gameStatus,
    rollGameResults,
    updateRollGameResults,
    updateGameStatus,
    addLastBet,
    updateLastBets,
    lastBets,
    updateCurrentAnimationCount,
    currentAnimationCount,
  } = useRollGameStore([
    'gameStatus',
    'rollGameResults',
    'updateRollGameResults',
    'updateGameStatus',
    'addLastBet',
    'updateLastBets',
    'lastBets',
    'updateCurrentAnimationCount',
    'currentAnimationCount',
  ]);

  React.useEffect(() => {
    if (rollGameResults.length === 0) return;

    const turn = (i = 0) => {
      updateCurrentAnimationCount(0);

      const dice = Number(rollGameResults[i]?.dice) || 0;
      const payout = rollGameResults[i]?.payout || 0;
      const payoutInUsd = rollGameResults[i]?.payoutInUsd || 0;

      flipEffect.play();

      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        if (skipRef.current) {
          clearTimeout(timeoutRef.current);
          return;
        }
        const curr = i + 1;

        onAnimationStep && onAnimationStep(i);

        updateCurrentAnimationCount(curr);

        addLastBet({
          dice: dice,
          payout,
          payoutInUsd,
        });

        if (payout > 0) {
          winEffect.play();
        }

        if (skipRef.current) {
          onSkip();
        } else if (rollGameResults.length === curr) {
          updateRollGameResults([]);
          onAnimationCompleted && onAnimationCompleted(rollGameResults);
          setTimeout(() => {
            updateGameStatus('ENDED');
          }, 200);
        } else {
          setTimeout(() => turn(curr), 150);
        }

        setLoading(false);
      }, 500);
    };
    turn();

    return () => {
      updateGameStatus('IDLE');
      updateRollGameResults([]);
      updateLastBets([]);
      clearTimeout(timeoutRef.current);
    };
  }, [rollGameResults]);

  const onSkip = () => {
    updateLastBets(rollGameResults);
    onAnimationSkipped(rollGameResults);
    setTimeout(() => {
      updateRollGameResults([]);
      updateCurrentAnimationCount(0);
      updateGameStatus('ENDED');
    }, 50);
  };

  React.useEffect(() => {
    skipRef.current = isAnimationSkipped;

    if (isAnimationSkipped) {
      onSkip();
    }
  }, [isAnimationSkipped]);

  return (
    <div className="wr-w-full lg:wr-max-w-[422px] wr-max-w-[240px] wr-relative wr-top-1/2 -wr-translate-y-[55%] lg:-wr-translate-y-1/2">
      <FormField
        control={form.control}
        name="dices"
        render={() => (
          <FormItem
            className={cn(
              'wr-grid-row-2 wr-relative wr-grid wr-grid-cols-3 wr-items-center wr-gap-4 wr-transition-all wr-ease-in-out',
              {
                'wr-animate-dice-shake': loading,
              }
            )}
          >
            {ALL_DICES.map((item) => (
              <Dice
                key={item}
                item={item}
                winner={
                  currentAnimationCount === 0 ? undefined : lastBets[lastBets.length - 1]?.dice
                }
                isBetting={gameStatus === 'PLAYING' ? true : false}
                isDisabled={form.formState.isLoading || form.formState.isSubmitting}
              />
            ))}
          </FormItem>
        )}
      />
    </div>
  );
};
