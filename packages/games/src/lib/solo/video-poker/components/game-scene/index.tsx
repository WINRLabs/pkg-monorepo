'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { cn } from '../../../../utils/style';
import { toFormatted } from '../../../../utils/web3';
import { videoPokerHands, VideoPokerResult } from '../../constants';
import useVideoPokerGameStore from '../../store';
import { VideoPokerForm } from '../../types';
const ResultBox: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'wr-flex wr-h-10 lg:!wr-h-20 wr-items-center wr-justify-between lg:wr-flex-col wr-flex-row lg:!wr-justify-center wr-rounded-lg wr-bg-onyx-400 wr-text-md wr-font-bold wr-leading-[18px] max-md:wr-text-center max-md:wr-text-xs lg:wr-px-0 wr-px-4',
        className
      )}
    >
      {children}
    </div>
  );
};
/*     <div className="mt-1 text-base font-normal leading-5 text-zinc-500">
              100x $101
            </div> */

export const VideoPokerResults = () => {
  // copy video poker result names and remove first item
  const form = useFormContext() as VideoPokerForm;
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const { gameResult, updateState } = useVideoPokerGameStore(['gameResult', 'updateState']);

  const wager = form.watch('wager');

  const hands = videoPokerHands.slice(1);

  React.useEffect(() => {
    if (gameResult !== VideoPokerResult.LOST) winEffect.play();
  }, [gameResult]);

  return (
    <section className="wr-w-full max-lg:wr-absolute max-lg:wr-bottom-0 max-lg:wr-left-0 max-lg:wr-bg-black max-lg:wr-z-20 max-lg:wr-p-4 max-lg:wr-py-2 max-lg:wr-border-zinc-800 ">
      <div className="wr-w-full wr-transition-all wr-duration-500">
        <ResultBox
          className={cn('wr-mb-3', {
            'wr-bg-royal-flush wr-text-yellow-900': gameResult === VideoPokerResult.ROYAL_FLUSH,
          })}
        >
          Royal Flush
          <div
            className={cn('wr-mt-1 wr-text-base wr-font-bold wr-leading-5 wr-text-zinc-500', {
              'wr-text-yellow-700': gameResult === VideoPokerResult.ROYAL_FLUSH,
            })}
          >
            100x <span className="lg:!wr-block wr-hidden">${toFormatted(100 * wager, 2)}</span>
          </div>
        </ResultBox>
        <div className="wr-grid wr-w-full wr-grid-cols-2 lg:!wr-grid-cols-4 wr-grid-rows-2 wr-gap-3 wr-transition-all wr-duration-500">
          {hands.map((hand, idx) => {
            return (
              <ResultBox
                key={idx}
                className={cn({
                  'wr-bg-jacks-or-better':
                    hand.name === 'Jacks or Better' &&
                    gameResult === VideoPokerResult.JACKS_OR_BETTER,
                  'wr-bg-videopoker-result wr-text-lime-900':
                    hand.name !== 'Jacks or Better' && gameResult === hand.value,
                })}
              >
                {hand.name}
                <div
                  className={cn(
                    'wr-mt-1 wr-text-base wr-font-bold wr-leading-5 wr-text-zinc-500 max-md:wr-text-xs wr-flex',
                    {
                      'wr-text-orange-200':
                        hand.name === 'Jacks or Better' &&
                        gameResult === VideoPokerResult.JACKS_OR_BETTER,
                      'wr-text-lime-800':
                        hand.name !== 'Jacks or Better' && gameResult === hand.value,
                    }
                  )}
                >
                  {hand.multiplier}x{' '}
                  <span className=" wr-ml-[10px] lg:!wr-block wr-hidden">
                    ${toFormatted(hand.multiplier * wager, 2)}
                  </span>
                </div>
              </ResultBox>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const VideoPokerScene = () => {
  return <section></section>;
};
