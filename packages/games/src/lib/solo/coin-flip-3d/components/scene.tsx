import * as Progress from '@radix-ui/react-progress';
import React from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { useListenUnityEvent } from '../../../hooks/use-listen-unity-event';
import { useEqualizeUnitySound } from '../../../hooks/use-unity-sound';
import { toFormatted } from '../../../utils/web3';
import { COIN_SIDE } from '../constants';
import useCoinFlipGameStore from '../store';
import { CoinFlip3dGameProps } from './game';

const UnityFlipEndEvent = 'CF_FlipEnd';

const UnitySequenceFlipEndEvent = 'CF_FlipSequenceEnd';

type ExtendedCoinFlipGameProps = CoinFlip3dGameProps & {
  buildedGameUrl: string;
  loader: string;
};

export const CoinFlipScene = ({
  onAnimationStep,
  onAnimationCompleted,
  buildedGameUrl,
  loader,
  devicePixelRatio = 1,
}: ExtendedCoinFlipGameProps) => {
  const percentageRef = React.useRef(0);

  const BUILDED_GAME_URL = `${buildedGameUrl}/builded-games/coin-flip`;

  const { coinFlipGameResults, updateCoinFlip3dGameResults, updateGameStatus, addLastBet } =
    useCoinFlipGameStore([
      'coinFlipGameResults',
      'updateCoinFlip3dGameResults',
      'updateGameStatus',
      'addLastBet',
    ]);

  const {
    sendMessage,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${BUILDED_GAME_URL}/CoinFlipV2.loader.js`,
    dataUrl: `${BUILDED_GAME_URL}/CoinFlipV2.data.unityweb`,
    frameworkUrl: `${BUILDED_GAME_URL}/CoinFlipV2.framework.js.unityweb`,
    codeUrl: `${BUILDED_GAME_URL}/CoinFlipV2.wasm.unityweb`,
  });

  useEqualizeUnitySound({
    sendMessage,
  });

  const { unityEvent } = useListenUnityEvent();

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  React.useEffect(() => {
    if (coinFlipGameResults.length === 0) return;

    const gameResult = coinFlipGameResults;

    const parsedResults = gameResult?.map((item) => item.coinSide).join(',');

    sendMessage('WebGLHandler', 'ReceiveMessage', `CF_Flip|${parsedResults}`);
  }, [coinFlipGameResults]);

  React.useEffect(() => {
    if (coinFlipGameResults.length === 0) return;

    const currentResult = coinFlipGameResults?.[count];

    if (currentResult) {
      if (unityEvent.name === UnityFlipEndEvent) {
        currentResult?.payout > 0 && sendMessage('WebGLHandler', 'ReceiveMessage', 'CF_Win');

        onAnimationStep && onAnimationStep(count);

        const side = (coinFlipGameResults[count]?.coinSide.toString() as COIN_SIDE) || '0';

        const payout = coinFlipGameResults[count]?.payout || 0;

        const payoutInUsd = coinFlipGameResults[count]?.payoutInUsd || 0;

        addLastBet({
          coinSide: side,
          payout,
          payoutInUsd,
        });

        setCount(count + 1);
      }

      if (unityEvent.name === UnitySequenceFlipEndEvent) {
        currentResult?.payout > 0 && sendMessage('WebGLHandler', 'ReceiveMessage', 'CF_Win');
      }
    }

    if (unityEvent.name === UnitySequenceFlipEndEvent) {
      updateCoinFlip3dGameResults([]);

      onAnimationCompleted && onAnimationCompleted(coinFlipGameResults);

      setTimeout(() => {
        setCount(0);

        updateGameStatus('ENDED');
      }, 1000);

      onAnimationStep && onAnimationStep(0);
    }
  }, [unityEvent]);

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
              className="wr-h-full wr-w-full wr-bg-gradient-to-t wr-from-unity-coinflip-purple-700 wr-to-unity-coinflip-purple-400"
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
            Coin Flip
          </span>
        </div>
      )}
      <div className="wr-w-full max-lg:wr-border-b max-lg:wr-border-zinc-800 ">
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={devicePixelRatio}
          className="wr-h-full wr-w-full wr-rounded-t-md wr-bg-zinc-900 max-md:wr-h-[425px] lg:wr-rounded-md"
        />
      </div>
    </>
  );
};
