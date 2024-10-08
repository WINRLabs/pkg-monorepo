import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../../constants';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { useWinAnimation } from '../../../../hooks/use-win-animation';
import { FormControl, FormField, FormItem } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { Tower } from '../..';
import { initialTowerCells } from '../../constants';
import useTowerGameStore from '../../store';
import { TowerForm, TowerFormField, TowerGameResult } from '../../types';
import styles from './scene.module.css';

export type TowerSceneProps = {
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: TowerGameResult[]) => void;
  onSubmitGameForm: (f: TowerFormField) => void;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  processStrategy: (result: TowerGameResult[]) => void;
};

export const TowerScene: React.FC<TowerSceneProps> = ({
  onAnimationStep,
  onAnimationCompleted,
  isAutoBetMode,
  processStrategy,
  onAutoBetModeChange,
  onSubmitGameForm,
}) => {
  const form = useFormContext() as TowerForm;

  const pickEffect = useAudioEffect(SoundEffects.LIMBO_TICK);
  const outComeEffect = useAudioEffect(SoundEffects.WIN_CLAIM_SOUND);
  const betCount = form.watch('betCount');

  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const isAutoBetModeRef = React.useRef<boolean>();

  const { showWinAnimation, closeWinAnimation } = useWinAnimation();

  const [currentNumbers, setCurrentNumbers] = React.useState<number[][]>([]);

  const { towerGameResults, gameStatus, updateTowerGameResults, updateGameStatus } =
    useTowerGameStore([
      'towerGameResults',
      'updateTowerGameResults',
      'updateGameStatus',
      'gameStatus',
    ]);

  React.useEffect(() => {
    if (towerGameResults.length == 0) return;

    const turn = (i = 0) => {
      closeWinAnimation();
      const curr = i + 1;
      setCurrentNumbers([]);

      onAnimationStep && onAnimationStep(curr);

      const isWon = towerGameResults?.[i]?.settled.won;

      const results = towerGameResults?.[i]?.resultNumbers as unknown as number[][];

      setCurrentNumbers(results || []);

      if (isWon) {
        outComeEffect.play();
      }

      if (towerGameResults.length === curr) {
        updateTowerGameResults([]);
        onAnimationCompleted && onAnimationCompleted(towerGameResults);

        const { payout, multiplier } = calculatePayout();
        showWinAnimation({
          payout,
          multiplier,
        });

        processStrategy(towerGameResults);

        timeoutRef.current = setTimeout(() => {
          // setCurrentNumbers([]);
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
        }, 250);
      }
    };

    turn();
  }, [towerGameResults, form.getValues]);

  React.useEffect(() => {
    isAutoBetModeRef.current = isAutoBetMode;
    if (!isAutoBetMode) clearTimeout(timeoutRef.current);
  }, [isAutoBetMode]);

  const calculatePayout = (): {
    multiplier: number;
    payout: number;
  } => {
    let totalPayout = 0;
    towerGameResults.forEach((v) => (totalPayout += v.settled.payoutsInUsd));
    const totalWager = towerGameResults.length * form.watch('wager');

    return {
      multiplier: totalPayout / totalWager,
      payout: totalPayout,
    };
  };

  React.useEffect(() => {
    if (towerGameResults.length == 0 && gameStatus == 'ENDED') {
      setCurrentNumbers([]);
    }
  }, [towerGameResults]);

  const renderCell = (cell: number, win: boolean, loss: boolean) => {
    if (win) {
      return (
        <div
          className={cn(
            styles['wr-tower-flip-animation'],
            ' wr-grid wr-animate-tower-gem-flip  wr-grid-cols-3  '
          )}
        >
          <div className={cn(styles['wr-rotateY-180'], ' wr-relative  wr-col-start-2 wr-w-full ')}>
            <img
              src={`${CDN_URL}/tower/blue-gem-1.png`}
              alt="win"
              className="wr-left-0 wr-top-0 wr-h-full wr-w-full  wr-object-cover"
            />
          </div>
        </div>
      );
    } else if (loss) {
      return (
        <div
          className={cn(
            styles['wr-tower-flip-animation'],
            'wr-grid wr-animate-tower-gem-flip wr-grid-cols-3'
          )}
        >
          <div className={cn(styles['wr-rotateY-180'], 'wr-relative wr-col-start-2 wr-w-full ')}>
            <img
              src={`${CDN_URL}/tower/black-gem.png`}
              alt="loss"
              className="wr-left-0 wr-top-0 wr-h-full wr-w-full  wr-object-cover"
            />
          </div>
        </div>
      );
    } else {
      return cell;
    }
  };

  return (
    <>
      <FormField
        name="selections"
        control={form.control}
        render={({ field }) => (
          <FormItem className="wr-mb-0 wr-w-full">
            <FormField
              control={form.control}
              name="selections"
              render={({ field }) => {
                return (
                  <FormItem className="wr-grid wr-h-full wr-w-full wr-grid-cols-5 wr-grid-rows-5 wr-items-center wr-justify-center lg:!wr-gap-2 wr-gap-1 max-lg:!wr-mb-3">
                    {initialTowerCells.map((cell, idx) => {
                      return (
                        <FormItem key={idx} className="wr-mb-0 wr-w-full ">
                          <FormControl>
                            <CheckboxPrimitive.Root
                              checked={field.value.includes(cell)}
                              onCheckedChange={(checked) => {
                                pickEffect.play();
                                updateTowerGameResults([]);
                                setCurrentNumbers([]);

                                if (!checked) {
                                  form.setValue(
                                    'selections',
                                    field.value.filter((item) => item !== cell)
                                  );
                                }

                                if (form.watch('selections').length >= 10) {
                                  return;
                                }

                                if (checked) {
                                  form.setValue('selections', field.value.concat(cell));
                                }
                              }}
                              className="wr-h-[34px] wr-w-full wr-rounded-lg wr-bg-tower-cell-bg wr-bg-[size:200%]  wr-bg-no-repeat wr-transition-all wr-duration-300 hover:wr-scale-105 sm:wr-h-[70px]"
                              style={{
                                backgroundPosition: field.value.includes(cell) ? '100% 90%' : 'top',
                              }}
                            >
                              <div className="wr-font-semibold">
                                {renderCell(
                                  cell,
                                  currentNumbers.includes(cell) && field.value.includes(cell),
                                  currentNumbers.includes(cell) && !field.value.includes(cell)
                                )}
                              </div>
                            </CheckboxPrimitive.Root>
                          </FormControl>
                        </FormItem>
                      );
                    })}
                  </FormItem>
                );
              }}
            />
          </FormItem>
        )}
      />
    </>
  );
};
