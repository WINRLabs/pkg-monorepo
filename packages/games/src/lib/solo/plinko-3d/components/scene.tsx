'use client';

import * as Progress from '@radix-ui/react-progress';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Unity } from 'react-unity-webgl';

import { useListenUnityEvent } from '../../../hooks/use-listen-unity-event';
import { toFormatted } from '../../../utils/web3';
import { Plinko3d } from '..';
import { useUnityPlinko } from '../hooks/use-unity-plinko';
import usePlinko3dGameStore from '../store';
import { Plinko3dForm } from '../types';
import { Plinko3dGameProps } from './game';

const UnityScoreEvent = 'Score';

type PlinkoSceneProps = Plinko3dGameProps & {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  buildedGameUrl: string;
  loader?: string;
};

export const PlinkoScene = ({
  count,
  setCount,
  buildedGameUrl,
  onAnimationStep,
  onAnimationCompleted,
  loader,
  devicePixelRatio = 1,
}: PlinkoSceneProps) => {
  const form = useFormContext() as Plinko3dForm;

  const percentageRef = React.useRef(0);

  const plinkoSize = form.watch('plinkoSize');

  const {
    updateGameStatus,
    addLastBet,
    plinkoGameResults: gameResults,
    updatePlinkoGameResults,
  } = usePlinko3dGameStore([
    'updateGameStatus',
    'addLastBet',
    'plinkoGameResults',
    'updatePlinkoGameResults',
  ]);

  const {
    detachAndUnloadImmediate,
    handlePlinkoSize,
    handleSpawnBalls,
    unityProvider,
    loadingProgression,
  } = useUnityPlinko({ buildedGameUrl });

  const { unityEvent } = useListenUnityEvent();

  React.useEffect(() => {
    if (plinkoSize >= 6 && plinkoSize <= 12) {
      setTimeout(() => {
        handlePlinkoSize(plinkoSize);
      }, 300);
    }
  }, [plinkoSize]);

  React.useEffect(() => {
    if (!gameResults || gameResults.length === 0) return;

    const setGameResult = gameResults.map((result) => result.outcomes);

    handleSpawnBalls(setGameResult);
  }, [gameResults]);

  React.useEffect(() => {
    if (!gameResults || gameResults.length === 0) return;

    onAnimationStep && onAnimationStep(count);

    if (unityEvent.name === UnityScoreEvent) {
      addLastBet({
        isWon: Number(unityEvent.strParam) > 1,
        multiplier: unityEvent.strParam,
      });

      setCount(count + 1);
    }
  }, [unityEvent]);

  React.useEffect(() => {
    if (!gameResults || gameResults.length === 0) return;

    if (count === gameResults?.length) {
      updatePlinkoGameResults([]);

      onAnimationCompleted && onAnimationCompleted(gameResults);

      setTimeout(() => {
        updateGameStatus('ENDED');

        setCount(0);

        onAnimationStep && onAnimationStep(0);
      }, 500);
    }
  }, [count, gameResults]);

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  return (
    <>
      {percentageRef.current !== 100 && (
        <div className="wr-absolute wr-left-0 wr-top-0 wr-z-[100] wr-flex wr-h-full wr-w-full wr-flex-col wr-items-center wr-justify-center wr-gap-4  wr-bg-zinc-900">
          <img
            src={loader}
            alt="loader"
            className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-h-full wr-w-full wr-rounded-md"
          />
          <span
            style={{
              textShadow: '0 0 5px black, 0 0 5px black',
            }}
            className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
          >
            {toFormatted(percentageRef.current, 2)} %
          </span>
          <Progress.Root
            className="wr-radius-[1000px] wr-relative wr-z-50 wr-h-[25px] wr-w-[320px] wr-overflow-hidden wr-rounded-md wr-bg-black"
            style={{
              transform: 'translateZ(0)',
            }}
            value={percentageRef.current}
          >
            <Progress.Indicator
              className="wr-h-full wr-w-full wr-bg-gradient-to-t wr-from-unity-horse-race-blue-400 wr-to-unity-horse-race-blue-600"
              style={{
                transform: `translateX(-${100 - percentageRef.current}%)`,
                transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
              }}
            />
          </Progress.Root>
          <span
            style={{
              textShadow: '0 0 5px black, 0 0 5px black',
            }}
            className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
          >
            Plinko
          </span>
        </div>
      )}
      <div className="wr-w-full max-lg:wr-border-b  max-lg:wr-border-zinc-800 ">
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={devicePixelRatio}
          className="wr-h-full wr-w-full wr-rounded-t-md wr-bg-zinc-900 max-md:wr-h-[360px] lg:wr-rounded-md"
        />
        <Plinko3d.LastBets />
      </div>
    </>
  );
};
