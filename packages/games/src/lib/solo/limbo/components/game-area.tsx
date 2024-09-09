import React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '../../../utils/style';
import useLimboGameStore from '../store';
import { LimboForm, LimboFormField, LimboGameResult } from '../types';

export interface GameAreaProps {
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: LimboGameResult[]) => void;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  processStrategy: (result: LimboGameResult[]) => void;
  onSubmitGameForm: (data: LimboFormField) => void;
  isAutoBetMode: boolean;
  children: React.ReactNode;
}

const GameArea: React.FC<GameAreaProps> = ({
  onAnimationCompleted,
  onAnimationStep,
  processStrategy,
  onAutoBetModeChange,
  onSubmitGameForm,
  isAutoBetMode,
  children,
}) => {
  const isAutoBetModeRef = React.useRef<boolean>();
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const form = useFormContext() as LimboForm;
  const betCount = form.watch('betCount');

  const { addLastBet, limboGameResults, updateGameStatus, updateCurrentAnimationCount, lastBets } =
    useLimboGameStore([
      'addLastBet',
      'removeLastBet',
      'updateLastBets',
      'limboGameResults',
      'updateGameStatus',
      'updateLimboGameResults',
      'updateCurrentAnimationCount',
      'lastBets',
    ]);

  React.useEffect(() => {
    if (limboGameResults.length === 0) return;

    const turn = (i = 0) => {
      const resultNumber = Number(limboGameResults[i]?.number) || 0;
      const payout = limboGameResults[i]?.payout || 0;
      const payoutInUsd = limboGameResults[i]?.payoutInUsd || 0;
      processStrategy(limboGameResults);

      const curr = i + 1;

      onAnimationStep && onAnimationStep(i);

      updateCurrentAnimationCount(curr);

      addLastBet({
        number: resultNumber,
        payout,
        payoutInUsd,
      });

      if (limboGameResults.length === curr) {
        onAnimationCompleted && onAnimationCompleted(limboGameResults);
        updateCurrentAnimationCount(0);
        updateGameStatus('ENDED');
        if (isAutoBetModeRef.current) {
          const newBetCount = betCount - 1;

          betCount !== 0 && form.setValue('betCount', betCount - 1);

          if (betCount >= 0 && newBetCount != 0) {
            timeoutRef.current = setTimeout(() => onSubmitGameForm(form.getValues()), 300);
          } else {
            onAutoBetModeChange(false);
          }
        }
      }
    };
    turn();
  }, [limboGameResults, form.getValues]);

  React.useEffect(() => {
    isAutoBetModeRef.current = isAutoBetMode;
    if (!isAutoBetMode) clearTimeout(timeoutRef.current);
  }, [isAutoBetMode]);

  return (
    <div
      className={cn(
        'wr-relative wr-h-full wr-w-full wr-flex wr-justify-between wr-flex-col wr-transition-all wr-duration-200',
        {
          'wr-pt-5 lg:wr-pt-0': lastBets.length,
        }
      )}
    >
      {children}
    </div>
  );
};

export default GameArea;
