import React from 'react';

import { useGameSkip } from '../../../game-provider';
import { cn } from '../../../utils/style';
import useLimboGameStore from '../store';
import { LimboGameResult } from '../types';

export interface GameAreaProps {
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: LimboGameResult[]) => void;
  onAnimationSkipped?: (result: LimboGameResult[]) => void;
  children: React.ReactNode;
}

const GameArea: React.FC<GameAreaProps> = ({
  onAnimationCompleted,
  onAnimationStep,
  onAnimationSkipped = () => {},
  children,
}) => {
  const skipRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const { isAnimationSkipped } = useGameSkip();

  const {
    addLastBet,
    updateLastBets,
    limboGameResults,
    updateGameStatus,
    updateLimboGameResults,
    updateCurrentAnimationCount,
    lastBets,
  } = useLimboGameStore([
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

      if (skipRef.current) {
        return;
      }

      const curr = i + 1;

      onAnimationStep && onAnimationStep(i);

      updateCurrentAnimationCount(curr);

      addLastBet({
        number: resultNumber,
        payout,
        payoutInUsd,
      });

      if (skipRef.current) {
        onSkip();
      } else if (limboGameResults.length === curr) {
        onAnimationCompleted && onAnimationCompleted(limboGameResults);
        updateCurrentAnimationCount(0);
        updateGameStatus('ENDED');

        if (limboGameResults.length > 1) {
          updateLimboGameResults([]);
        }
      } else {
        timeoutRef.current = setTimeout(() => turn(curr), 750);
      }
    };
    turn();

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [limboGameResults]);

  const onSkip = () => {
    updateLastBets(limboGameResults);
    onAnimationSkipped(limboGameResults);
    setTimeout(() => {
      updateCurrentAnimationCount(0);
      updateLimboGameResults([]);
      updateGameStatus('ENDED');
    }, 50);
  };

  React.useEffect(() => {
    skipRef.current = isAnimationSkipped;

    if (isAnimationSkipped) {
      onSkip();
    }
  }, [isAnimationSkipped]);

  React.useEffect(() => {
    return () => {
      onSkip();
    };
  }, []);

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
