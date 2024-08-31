import React from 'react';

import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import {
  CountdownContextState,
  CountdownProvider,
  Minutes,
  Seconds,
} from '../../../../ui/countdown';
import { cn } from '../../../../utils/style';
import { MultiplayerGameStatus } from '../../../core/type';
import { colorMultipliers, WheelUnits } from '../../constants';
import { useWheelGameStore } from '../../store';
import { Wheel } from './wheel';
import styles from './wheel-scene.module.css';

export const WheelScene = ({ onComplete }: { onComplete?: () => void }) => {
  const { winnerAngle, winnerColor, joiningFinish, status, showResult, setShowResult } =
    useWheelGameStore([
      'winnerAngle',
      'winnerColor',
      'joiningFinish',
      'status',
      'showResult',
      'setShowResult',
      'wheelParticipants',
    ]);
  const multiplier = colorMultipliers[winnerColor];
  const countdownEffect = useAudioEffect(SoundEffects.COUNTDOWN);

  const handleTimeLeftChange = (timeLeft: CountdownContextState) =>
    timeLeft.seconds == 3 && countdownEffect.play();

  return (
    <div className={styles.container}>
      <div className={styles.wheelContent}>
        <div className={styles.status}>
          {status === MultiplayerGameStatus.None && (
            <div className="wr-text-xl wr-leading-6 wr-text-zinc-100 wr-font-semibold">
              Bet to Start <br />
              <p className="wr-text-base wr-leading-2 wr-text-zinc-500 wr-mt-1">
                The game will start after someone places a bet
              </p>
            </div>
          )}

          {status == MultiplayerGameStatus.Wait && (
            <section className="wr-text-center">
              <div className="wr-mb-3 wr-text-xl wr-font-semibold wr-leading-5 wr-text-zinc-100">
                Remaining time:
              </div>
              <CountdownProvider
                targetDate={new Date(joiningFinish * 1000)?.toISOString()}
                onTimeLeftChange={handleTimeLeftChange}
              >
                <section className="wr-mt-2 wr-flex wr-items-center wr-justify-center wr-gap-2">
                  <div className="wr-text-[32px] wr-font-bold wr-leading-[32px] wr-text-white">
                    <Minutes />
                  </div>
                  <div className="wr-text-[32px] wr-font-bold wr-leading-[32px] wr-text-white">
                    :
                  </div>
                  <div className="wr-text-[32px] wr-font-bold wr-leading-[32px] wr-text-white">
                    <Seconds />
                  </div>
                </section>
              </CountdownProvider>
            </section>
          )}

          {status === MultiplayerGameStatus.Finish && showResult && (
            <div className={cn(styles.multiplier, styles[`m${multiplier}x`])}>
              <div className="wr-text-[40px]">{multiplier}x</div>
            </div>
          )}
        </div>
        <Wheel
          units={WheelUnits}
          spin={status === MultiplayerGameStatus.Finish}
          degree={status === MultiplayerGameStatus.Finish ? winnerAngle : undefined}
          onComplete={() => {
            setShowResult(true);
            onComplete && onComplete();
          }}
        />
      </div>
    </div>
  );
};
