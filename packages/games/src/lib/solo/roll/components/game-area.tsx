import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useGameSkip } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { FormField, FormItem, FormMessage } from '../../../ui/form';
import { cn } from '../../../utils/style';
import { ALL_DICES } from '../constant';
import useRollGameStore from '../store';
import { RollForm, RollFormFields, RollGameResult } from '../types';
import Dice from './dice';

export interface GameAreaProps {
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: RollGameResult[]) => void;
  onAnimationSkipped?: (result: RollGameResult[]) => void;
  onSubmitGameForm: (f: RollFormFields) => void;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  processStrategy: (result: RollGameResult[]) => void;
  isAutoBetMode: boolean;
}

export const GameArea: React.FC<GameAreaProps> = ({
  onAnimationCompleted,
  onAnimationStep,
  onAnimationSkipped = () => {},
  onSubmitGameForm,
  onAutoBetModeChange,
  processStrategy,
  isAutoBetMode,
}) => {
  const form = useFormContext() as RollForm;

  const selectedDices = form.watch('dices');
  const betCount = form.watch('betCount');

  const endTimeoutRef = React.useRef<NodeJS.Timeout>();
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const isAutoBetModeRef = React.useRef<boolean>();

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
      processStrategy(rollGameResults);

      flipEffect.play();

      setLoading(true);
      timeoutRef.current = setTimeout(() => {
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

        if (rollGameResults.length === curr) {
          updateRollGameResults([]);
          onAnimationCompleted && onAnimationCompleted(rollGameResults);
          endTimeoutRef.current = setTimeout(() => {
            updateGameStatus('ENDED');
            if (isAutoBetModeRef.current) {
              const newBetCount = betCount - 1;

              betCount !== 0 && form.setValue('betCount', betCount - 1);

              if (betCount >= 0 && newBetCount != 0) {
                onSubmitGameForm(form.getValues());
              } else {
                onAutoBetModeChange(false);
              }
            }
          }, 200);
        }
        setLoading(false);
      }, 350);
    };
    turn();
  }, [rollGameResults, form.getValues]);

  React.useEffect(() => {
    return () => {
      updateGameStatus('IDLE');
      updateRollGameResults([]);
      updateLastBets([]);
      clearTimeout(timeoutRef.current);
      clearTimeout(endTimeoutRef.current);
    };
  }, []);

  React.useEffect(() => {
    isAutoBetModeRef.current = isAutoBetMode;
    if (!isAutoBetMode) {
      clearTimeout(timeoutRef.current);
      clearTimeout(endTimeoutRef.current);
    }
  }, [isAutoBetMode]);

  React.useEffect(() => {
    updateCurrentAnimationCount(0);
  }, [selectedDices]);

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
                isDisabled={
                  form.formState.isLoading || form.formState.isSubmitting || isAutoBetMode
                }
              />
            ))}
          </FormItem>
        )}
      />
    </div>
  );
};
