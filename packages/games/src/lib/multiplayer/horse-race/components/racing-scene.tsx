import React from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { useDevicePixelRatio } from '../../../hooks/use-device-pixel-ratio';
import { useListenUnityEvent } from '../../../hooks/use-listen-unity-event';
import { useEqualizeUnitySound } from '../../../hooks/use-unity-sound';
import { HorseRaceStatus } from '../constants';
import useHorseRaceGameStore from '../store';
import { SceneLoader } from './scene-loader';

const UnityFinalizedEvent = 'HR_GameEnd';

interface Props {
  onComplete?: () => void;
  buildedGameUrl: string;
  loaderImg?: string;
}

export const RacingScene = ({ onComplete, buildedGameUrl, loaderImg }: Props) => {
  const devicePixelRatio = useDevicePixelRatio();

  const BUILDED_GAME_URL = `${buildedGameUrl}/builded-games/horse-racing`;

  const { status, winnerHorse, resetSelectedHorse } = useHorseRaceGameStore([
    'status',
    'winnerHorse',
    'resetSelectedHorse',
  ]);

  const percentageRef = React.useRef(0);

  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: `${BUILDED_GAME_URL}/HorseRacing.loader.js`,
    dataUrl: `${BUILDED_GAME_URL}/HorseRacing.data.unityweb`,
    frameworkUrl: `${BUILDED_GAME_URL}/HorseRacing.framework.js.unityweb`,
    codeUrl: `${BUILDED_GAME_URL}/HorseRacing.wasm.unityweb`,
  });

  useEqualizeUnitySound({
    sendMessage,
  });

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  const { unityEvent } = useListenUnityEvent();

  const startRace = () => sendMessage('WebGLHandler', 'ReceiveMessage', 'StartRace');

  const finishRace = (winningHorse: number) => {
    sendMessage('WebGLHandler', 'ReceiveMessage', `WinnerList|${winningHorse}`);
  };

  React.useEffect(() => {
    if (isLoaded && status === HorseRaceStatus.Race) {
      startRace();
    }

    if (winnerHorse !== undefined && status === HorseRaceStatus.Finished) {
      finishRace(Number(winnerHorse) - 1);
    }
  }, [status, winnerHorse]);

  React.useEffect(() => {
    if (unityEvent.name === UnityFinalizedEvent) {
      onComplete && onComplete();

      setTimeout(() => {
        resetSelectedHorse();

        sendMessage('WebGLHandler', 'ReceiveMessage', 'Reset');
      }, 3000);
    }
  }, [unityEvent]);

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  return (
    <>
      {percentageRef.current !== 100 && (
        <SceneLoader percentage={percentageRef.current} loaderImage={loaderImg || ''} />
      )}
      <Unity
        unityProvider={unityProvider}
        devicePixelRatio={devicePixelRatio}
        className="wr-h-[276px] wr-w-full wr-rounded-md wr-bg-zinc-900 md:wr-h-full"
      />

      {/* <div className="h-full w-full bg-zinc-950">
        <SelectedHorseDetail />
      </div> */}

      {/*    <div className="h-full w-full bg-zinc-950"></div> */}
    </>
  );
};
