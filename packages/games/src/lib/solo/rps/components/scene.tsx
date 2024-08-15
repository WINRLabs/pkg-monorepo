import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../constants';
import { useGameSkip } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { FormControl, FormField, FormItem } from '../../../ui/form';
import { cn } from '../../../utils/style';
import { ALL_RPS_CHOICES } from '../constant';
import useRpsGameStore from '../store';
import { GameAreaProps, RockPaperScissors, RPSForm, RPSGameResult } from '../types';
import { RPSChoiceRadio } from './bet-controller';

const Scene: React.FC<GameAreaProps> = ({
  onAnimationCompleted,
  onAnimationStep,
  onAnimationSkipped = () => {},
}) => {
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);
  const playingEffect = useAudioEffect(SoundEffects.LIMBO_SPIN_1);
  const digitalClickEffect = useAudioEffect(SoundEffects.LIMBO_TICK);

  const form = useFormContext() as RPSForm;

  const rpsChoice = form.watch('rpsChoice');

  const skipRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const [winnerAnimation, setWinnerAnimation] = React.useState(false);

  const [winner, setWinner] = React.useState<RPSGameResult | undefined>(undefined);

  const {
    rpsGameResults,
    gameStatus,
    updateLastBets,
    updateRpsGameResults,
    updateGameStatus,
    addLastBet,
  } = useRpsGameStore([
    'rpsGameResults',
    'gameStatus',
    'updateLastBets',
    'updateRpsGameResults',
    'updateGameStatus',
    'addLastBet',
  ]);

  const { isAnimationSkipped } = useGameSkip();

  React.useEffect(() => {
    if (rpsGameResults.length === 0) return;

    const turn = (i = 0) => {
      setWinnerAnimation(false);
      updateGameStatus('ENDED');

      const rps = rpsGameResults[i]?.rps || RockPaperScissors['ROCK'];
      const payout = rpsGameResults[i]?.payout || 0;
      const payoutInUsd = rpsGameResults[i]?.payoutInUsd || 0;

      playingEffect.play();

      timeoutRef.current = setTimeout(() => {
        if (skipRef.current) {
          clearTimeout(timeoutRef.current);
          return;
        }

        const curr = i + 1;

        setWinner({
          rps,
          payout,
          payoutInUsd,
        });

        onAnimationStep && onAnimationStep(curr);

        addLastBet({
          rps,
          payout,
          payoutInUsd,
        });

        if (payout > form.getValues('wager')) {
          winEffect.play();
        }
        if (rpsGameResults.length === curr) {
          updateRpsGameResults([]);
          onAnimationCompleted && onAnimationCompleted(rpsGameResults);
          // setTimeout(() => {
          //   setWinnerAnimation(false);
          //   updateGameStatus('ENDED');
          // }, 750);
        } else {
          setTimeout(() => turn(curr), 500);
        }
        setWinnerAnimation(true);
      }, 500);
      setWinnerAnimation(false);
    };
    turn();

    return () => {
      clearTimeout(timeoutRef.current);
      updateGameStatus('IDLE');
      updateLastBets([]);
      updateRpsGameResults([]);
    };
  }, [rpsGameResults]);

  const onSkip = () => {
    updateLastBets(rpsGameResults);
    updateRpsGameResults([]);
    onAnimationSkipped(rpsGameResults);
    setTimeout(() => {
      setWinnerAnimation(false);
      updateGameStatus('ENDED');
    }, 50);
  };

  React.useEffect(() => {
    console.log(gameStatus, rpsGameResults);
  }, [gameStatus, rpsGameResults]);

  React.useEffect(() => {
    skipRef.current = isAnimationSkipped;

    if (isAnimationSkipped) {
      onSkip();
    }
  }, [isAnimationSkipped]);

  return (
    <div className="wr-relative wr-flex wr-h-full wr-w-full  ">
      <div className="wr-relative wr-basis-1/2 ">
        <div
          className={cn(
            'wr-absolute -wr-top-0 wr-h-full wr-w-[200%] -wr-translate-x-1/2  -wr-skew-x-[30deg] wr-transform wr-transition-all  wr-duration-300  wr-ease-linear ',
            { 'wr-opacity-100 ': winnerAnimation },
            { 'wr-opacity-0': !winnerAnimation }
          )}
        >
          <div
            className={cn('wr-h-full wr-w-full', {
              'wr-bg-rps-win  ': winner?.payout || 0 <= 0,
              'wr-border-red-600 wr-bg-rps-lost': winner?.payout || 0 > 0,
              'wr-border-red-600 wr-bg-rps-lost wr-opacity-40':
                rpsChoice.toString() === winner?.rps.toString() && winner?.payout > 0,
            })}
          />
        </div>
        <div
          className={cn(
            'wr-absolute wr-left-1/2 md:!wr-top-[124px] wr-top-[70px] wr-hidden wr-transform wr-bg-rps-win-text wr-bg-clip-text wr-font-druk wr-text-[41px] wr-font-bold wr-leading-[45px] wr-text-transparent wr-duration-300 max-md:-wr-translate-x-1/2 max-md:wr-text-2xl',
            { 'wr-inline-block': winner?.payout === 0 },
            {
              'wr-hidden': !winnerAnimation || rpsChoice.toString() === winner?.rps.toString(),
            }
          )}
        >
          WIN
        </div>

        <div
          className={cn(
            'wr-absolute wr-left-1/2 md:!wr-top-[124px] wr-top-[70px] wr-hidden wr-transform wr-bg-gradient-to-b wr-from-yellow-300 wr-to-yellow-700 wr-bg-clip-text wr-font-druk   wr-text-[41px] wr-font-bold wr-leading-[45px] wr-text-transparent wr-duration-300 max-md:-wr-translate-x-1/2 max-md:wr-text-2xl',
            {
              'wr-inline-block': rpsChoice.toString() === winner?.rps.toString(),
            },
            {
              'wr-hidden': !winnerAnimation,
            }
          )}
        >
          Draw
        </div>
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-w-full  -wr-translate-x-1/2 -wr-translate-y-1/2  wr-transform">
          <div
            className={cn('wr-relative wr-opacity-0', {
              'wr-opacity-100': winnerAnimation,
            })}
          >
            <img
              src={`${CDN_URL}/rps/rock.png`}
              width={294}
              height={116}
              alt="rock"
              className={cn('wr-absolute  -wr-translate-y-1/2  wr-opacity-0', {
                'wr-opacity-100': winner?.rps.toString() === RockPaperScissors.ROCK,
              })}
            />
            <img
              src={`${CDN_URL}/rps/paper.png`}
              width={294}
              height={116}
              alt="paper"
              className={cn('wr-absolute  -wr-translate-y-1/2  wr-opacity-0', {
                'wr-opacity-100': winner?.rps.toString() === RockPaperScissors.PAPER,
              })}
            />
            <img
              src={`${CDN_URL}/rps/scissors.png`}
              width={294}
              height={116}
              alt="scissors"
              className={cn('wr-absolute  -wr-translate-y-1/2  wr-opacity-0', {
                'wr-opacity-100': winner?.rps.toString() === RockPaperScissors.SCISSORS,
              })}
            />
          </div>
        </div>
      </div>
      <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-10 -wr-translate-x-1/2 -wr-translate-y-1/2  wr-transform max-md:wr-hidden">
        <img src={`${CDN_URL}/rps/VS.svg`} width={105} height={38.5} alt="VS" />
      </div>
      <div className="wr-relative wr-basis-1/2">
        <div
          className={cn(
            'wr-absolute -wr-top-0 wr-left-full wr-h-full wr-w-[200%] -wr-translate-x-1/2  -wr-skew-x-[30deg] wr-transform wr-transition-all  wr-duration-300  wr-ease-linear ',
            { 'wr-opacity-100 ': winnerAnimation },
            { 'wr-opacity-0': !winnerAnimation }
          )}
        >
          <div
            className={cn('wr-h-full wr-w-full', {
              'wr-border-red-600 wr-bg-rps-lost': winner?.payout || 0 <= 0,
              'wr-bg-rps-win': winner?.payout || 0 > 0,
              'wr-border-red-600 wr-bg-rps-lost wr-opacity-40':
                rpsChoice.toString() === winner?.rps.toString() && winner?.payout > 0,
            })}
          />
        </div>
        {/* <div
          className={cn(
            'wr-absolute wr-left-0 wr-top-0   wr-h-full wr-w-[200%] -wr-skew-x-[30deg] wr-bg-rps-default ',
            { 'wr-hidden': winnerAnimation }
          )}
        />
        <div
          className={cn(
            'wr-absolute wr-left-0 wr-top-[100%] wr-h-full wr-w-[200%] -wr-skew-x-[30deg] wr-transform wr-bg-rps-default   wr-transition-all wr-duration-500 wr-ease-linear',
            { 'wr-opacity-100': winnerAnimation },
            { 'wr-opacity-0': !winnerAnimation }
          )}
        >
          <div
            className={cn('wr-h-full wr-w-full wr-transition-all wr-ease-linear', {
              'wr-border-red-600 wr-bg-rps-lost': winner?.payout || 0 <= 0,
              'wr-bg-rps-win ': winner?.payout || 0 > 0,
              'wr-bg-yellow-500 wr-opacity-40': rpsChoice.toString() === winner?.rps.toString(),
            })}
          />
        </div> */}
        <div
          className={cn(
            'wr-relative wr-left-1/2 md:!wr-top-[124px] wr-top-[70px] wr-hidden wr-transform wr-bg-rps-win-text  wr-bg-clip-text wr-font-druk wr-text-[41px] wr-font-bold wr-leading-[45px] wr-text-transparent max-md:-wr-translate-x-1/2 max-md:wr-text-2xl',
            { 'wr-inline-block': winner?.payout || 0 > 0 },
            {
              'wr-hidden': !winnerAnimation || rpsChoice.toString() === winner?.rps.toString(),
            }
          )}
        >
          WIN
        </div>
        <div
          className={cn(
            'wr-absolute wr-left-1/2 md:!wr-top-[124px] wr-top-[70px] wr-hidden wr-transform wr-bg-gradient-to-b wr-from-yellow-300 wr-to-yellow-700   wr-bg-clip-text wr-font-druk wr-text-[41px] wr-font-bold wr-leading-[45px] wr-text-transparent max-md:-wr-translate-x-1/2 max-md:wr-text-2xl',
            {
              'wr-inline-block': rpsChoice.toString() === winner?.rps.toString(),
            },
            {
              'wr-hidden': !winnerAnimation,
            }
          )}
        >
          Draw
        </div>
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-w-full  -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform">
          <div className="-wr-scale-x-100 wr-text-center ">
            <div className={cn('wr-relative ')}>
              <div
                className={cn(
                  'wr-absolute -wr-translate-y-1/2 wr-transform wr-opacity-0  wr-transition-all  wr-ease-linear ',
                  {
                    'wr-opacity-100 ': rpsChoice === RockPaperScissors.PAPER,
                  }
                )}
              >
                <img src={`${CDN_URL}/rps/paper.png`} width={294} height={116} alt="paper" />
              </div>
              <div
                className={cn(
                  'wr-absolute -wr-translate-y-1/2 wr-transform wr-opacity-0  wr-transition-all  wr-ease-linear',
                  {
                    'wr-opacity-100': rpsChoice === RockPaperScissors.SCISSORS,
                  }
                )}
              >
                <img src={`${CDN_URL}/rps/scissors.png`} width={294} height={116} alt="scissors" />
              </div>
              <div
                className={cn(
                  'wr-absolute -wr-translate-y-1/2 wr-transform wr-opacity-0  wr-transition-all  wr-ease-linear',
                  {
                    'wr-opacity-100': rpsChoice === RockPaperScissors.ROCK,
                  }
                )}
              >
                <img src={`${CDN_URL}/rps/rock.png`} width={294} height={116} alt="rock" />
              </div>
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="rpsChoice"
          render={({ field }) => (
            <FormItem className="wr-absolute wr-bottom-[calc(75px_-_8px)] wr-left-1/2 wr-mx-auto wr-mb-0 wr-w-full wr-max-w-[164px] -wr-translate-x-1/2 max-md:wr-hidden ">
              <FormControl>
                <RadioGroupPrimitive.Root
                  {...field}
                  onValueChange={(e) => {
                    field.onChange(e);
                    digitalClickEffect.play();
                  }}
                >
                  {ALL_RPS_CHOICES.map((item) => (
                    <FormItem className="wr-mb-2 wr-cursor-pointer" key={item}>
                      <FormControl>
                        <RPSChoiceRadio choice={item} disabled={gameStatus === 'PLAYING'} />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroupPrimitive.Root>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Scene;
