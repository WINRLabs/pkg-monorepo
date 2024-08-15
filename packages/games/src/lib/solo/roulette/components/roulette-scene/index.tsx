import React from 'react';
import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../../constants';
import { useGameSkip } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { useWinAnimation } from '../../../../hooks/use-win-animation';
import { wait } from '../../../../utils/promise';
import { cn } from '../../../../utils/style';
import { rouletteWheelNumbers } from '../../constants';
import useRouletteGameStore from '../../store';
import { RouletteForm, RouletteGameResult } from '../../types';
import { RouletteWheel } from '../roulette-wheel';

const ANIMATION_TIMEOUT = 5000;

export const RouletteScene: React.FC<{
  isPrepared: boolean;
  setIsPrepared: (p: boolean) => void;

  onAnimationCompleted?: (result: RouletteGameResult[]) => void;
  onAnimationStep?: (step: number) => void;
  onAnimationSkipped?: (result: RouletteGameResult[]) => void;
}> = ({
  isPrepared,
  setIsPrepared,
  onAnimationCompleted = () => {},
  onAnimationStep = () => {},
  onAnimationSkipped = () => {},
}) => {
  const {
    addLastBet,
    updateLastBets,
    updateRouletteGameResults,
    updateGameStatus,

    rouletteGameResults: rouletteResult,
  } = useRouletteGameStore([
    'addLastBet',
    'updateLastBets',
    'updateRouletteGameResults',
    'updateGameStatus',
    'rouletteGameResults',
  ]);

  const { showWinAnimation } = useWinAnimation();
  const form = useFormContext() as RouletteForm;

  const selectedNumbers = form.watch('selectedNumbers');
  const wager = form.watch('wager');
  const betCount = form.watch('betCount');

  const [degree, setDegree] = React.useState<number>(0);

  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  const reference = 360 / 37;

  const ballAnimation: any = React.useMemo(
    () => ({
      '--finishTransform': `rotate(${360 * 2 + degree + 3}deg)`,
    }),
    [degree]
  );

  const ballEffect = useAudioEffect(SoundEffects.ROULETTE);
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const { isAnimationSkipped } = useGameSkip();

  const skipRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const totalWager = React.useMemo(() => {
    const totalChipCount = selectedNumbers.reduce((acc, cur) => acc + cur, 0);
    return totalChipCount * wager * betCount;
  }, [selectedNumbers, wager, betCount]);

  React.useEffect(() => {
    if (rouletteResult && rouletteResult.length) {
      console.log('animation started');

      const turn = async (i = 0) => {
        const order = i + 1;

        const idxValue = rouletteWheelNumbers.findIndex(
          (d) => d.number === rouletteResult[i]?.outcome
        );

        console.log(idxValue, 'idxValue');

        setDegree(idxValue * reference + 2);

        setIsAnimating(true);

        if (!skipRef.current) {
          ballEffect.play();

          await wait(ANIMATION_TIMEOUT);

          onAnimationStep(order);

          rouletteResult[order - 1]?.won && winEffect.play();
        }

        addLastBet(rouletteResult[order - 1] as RouletteGameResult);

        setIsAnimating(false);

        if (skipRef.current) {
          setIsAnimating(false);

          setIsPrepared(false);
          onSkip();

          return;
        } else if (rouletteResult.length === order) {
          setIsPrepared(false);
          updateRouletteGameResults([]);
          onAnimationCompleted(rouletteResult);

          const { payout, multiplier } = calculatePayout();
          showWinAnimation({
            payout,
            multiplier,
          });

          updateGameStatus('ENDED');

          return;
        } else {
          timeoutRef.current = setTimeout(() => turn(order), 100);
        }
      };

      turn(0);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      updateGameStatus('IDLE');
      updateLastBets([]);
      updateRouletteGameResults([]);
    };
  }, [rouletteResult]);

  const calculatePayout = (): {
    multiplier: number;
    payout: number;
  } => {
    let totalPayout = 0;
    rouletteResult.forEach((v) => (totalPayout += v.payoutInUsd));

    console.log(totalPayout, 'totalpay', totalWager, 'totalw', totalPayout / totalWager);
    return {
      multiplier: totalPayout / totalWager,
      payout: totalPayout,
    };
  };

  const onSkip = () => {
    updateLastBets(rouletteResult as RouletteGameResult[]);
    updateRouletteGameResults([]);
    onAnimationSkipped(rouletteResult as RouletteGameResult[]);
    setTimeout(() => updateGameStatus('ENDED'), 50);
  };

  React.useEffect(() => {
    skipRef.current = isAnimationSkipped;

    console.log(isAnimationSkipped, 'is');
  }, [isAnimationSkipped]);

  return (
    <div
      className={cn(
        'wr-relative wr-origin-top wr-transition-all wr-duration-500 wr-scale-[1.3] lg:wr-top-[5px]',
        {
          'max-md:wr-top-1/2 max-md:-wr-translate-y-1/2 max-md:wr-scale-110 wr-z-[1]': isPrepared,
        }
      )}
    >
      <RouletteWheel isPrepared={isPrepared} isAnimating={isAnimating} />

      <div
        style={ballAnimation}
        className={cn(
          'wr-absolute wr-left-1/2 wr-top-1/2 wr-z-20 wr-h-[300px] wr-w-[300px] -wr-translate-x-1/2 -wr-translate-y-1/2',
          {
            'wr-animate-roulette-ball-spin wr-delay-300': isAnimating,
          }
        )}
      >
        <img
          width={25}
          height={25}
          src={`${CDN_URL}/roulette/ball.svg`}
          alt="JustBet Roulette Ball"
          className={cn(
            'wr-relative wr-top-[0px] wr-mx-auto wr-my-0 wr-max-h-[25px] wr-max-w-[25px] wr-opacity-0 wr-transition-all',
            {
              'wr-origin-center wr-animate-roulette-scroll-bottom-ball': isAnimating,
            }
          )}
        />
      </div>
    </div>
  );
};
