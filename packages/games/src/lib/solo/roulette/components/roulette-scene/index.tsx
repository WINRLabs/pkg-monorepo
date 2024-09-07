import React from 'react';
import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../../constants';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { useWinAnimation } from '../../../../hooks/use-win-animation';
import { wait } from '../../../../utils/promise';
import { cn } from '../../../../utils/style';
import { rouletteWheelNumbers } from '../../constants';
import useRouletteGameStore from '../../store';
import { RouletteForm, RouletteFormFields, RouletteGameResult } from '../../types';
import { RouletteWheel } from '../roulette-wheel';

const ANIMATION_TIMEOUT = 5000;

export const RouletteScene: React.FC<{
  isPrepared: boolean;
  isAutoBetMode: boolean;
  setIsPrepared: (p: boolean) => void;

  onAnimationCompleted?: (result: RouletteGameResult[]) => void;
  onAnimationStep?: (step: number) => void;
  onAnimationSkipped?: (result: RouletteGameResult[]) => void;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  processStrategy: (result: RouletteGameResult[]) => void;
  onSubmitGameForm: (data: RouletteFormFields) => void;
}> = ({
  isPrepared,
  isAutoBetMode,
  onAutoBetModeChange,
  onSubmitGameForm,
  processStrategy,
  setIsPrepared,
  onAnimationCompleted = () => {},
  onAnimationStep = () => {},
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

  const { showWinAnimation, closeWinAnimation } = useWinAnimation();
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

  const isAutoBetModeRef = React.useRef<boolean>();

  const totalWager = React.useMemo(() => {
    const totalChipCount = selectedNumbers.reduce((acc, cur) => acc + cur, 0);
    return totalChipCount * wager;
  }, [selectedNumbers, wager]);

  React.useEffect(() => {
    if (rouletteResult && rouletteResult.length) {
      console.log('animation started');

      const turn = async (i = 0) => {
        closeWinAnimation();
        const order = i + 1;

        const idxValue = rouletteWheelNumbers.findIndex(
          (d) => d.number === rouletteResult[i]?.outcome
        );

        console.log(idxValue, 'idxValue');

        setDegree(idxValue * reference + 2);

        setIsAnimating(true);

        ballEffect.play();

        await wait(ANIMATION_TIMEOUT);

        onAnimationStep(order);

        rouletteResult[order - 1]?.won && winEffect.play();

        addLastBet(rouletteResult[order - 1] as RouletteGameResult);

        setIsAnimating(false);

        if (rouletteResult.length === order) {
          processStrategy(rouletteResult);
          setIsPrepared(false);
          updateRouletteGameResults([]);
          onAnimationCompleted(rouletteResult);

          const { payout, multiplier } = calculatePayout();
          showWinAnimation({
            payout,
            multiplier,
          });

          updateGameStatus('ENDED');

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
          return;
        }
      };

      turn(0);
    }
  }, [rouletteResult, form.getValues]);

  React.useEffect(() => {
    isAutoBetModeRef.current = isAutoBetMode;
  }, [isAutoBetMode]);

  React.useEffect(() => {
    return () => {
      updateGameStatus('IDLE');
      updateLastBets([]);
      updateRouletteGameResults([]);
    };
  }, []);

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
