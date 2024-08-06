"use client";

import React, { useContext, useEffect, useState } from "react";

import { CDN_URL } from "../constants";

export enum SoundEffects {
  COIN_FLIP_TOSS,
  COIN_FLIP_WIN,
  SLIDER,
  WIN,
  ROLLING_DICE,
  FALLING,
  RPS,
  RANGE_WIN,
  FLIP_CARD,
  THICK,
  BALL_BUMP,
  ROULETTE,
  LIMBO_TICK,
  KENO_OUTCOME_NUMBER,
  WHEEL_STEP,
  BET_BUTTON_CLICK,
  SLIDER_TICK_1X,
  BUTTON_CLICK_DIGITAL,
  SPIN_TICK_1X,
  WIN_COIN_DIGITAL,
  MINES_BOMB,
  LIMBO_SPIN_1,
  PLINKO_BIG,
  PLINKO_MID,
  PLINKO_SMALL,
  CHIP_EFFECT,
}

export interface AudioContextType {
  volume: number;
  onVolumeChange: (v: number) => void;
}

const noop = (): void => {
  // Do nothing
};

const defaultValue: AudioContextType = {
  volume: 1,
  onVolumeChange: noop,
};

const AudioContext = React.createContext<AudioContextType>(defaultValue);

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window == "undefined") return 1;

    const storedVolume = window.localStorage.getItem("volume");

    if (storedVolume === null) {
      const defaultVolume = 1; // Set your desired default volume here

      window.localStorage.setItem("volume", String(defaultVolume));

      return defaultVolume;
    }

    const parsedVolume = Number(storedVolume);

    return isNaN(parsedVolume) ? 1 : parsedVolume;
  });

  const onVolumeChange = (vol: number) => {
    if (typeof window == "undefined") return;

    setVolume(vol);

    window.localStorage.setItem("volume", String(vol));
  };

  return (
    <AudioContext.Provider value={{ volume, onVolumeChange }}>
      {children}
    </AudioContext.Provider>
  );
};

export const effects: Map<SoundEffects, string> = new Map();
// legacy sounds
effects.set(SoundEffects.COIN_FLIP_TOSS, "coin-toss.wav");
effects.set(SoundEffects.COIN_FLIP_WIN, "coin-flip-win.wav");
effects.set(SoundEffects.SLIDER, "slider-effect.mp3");
effects.set(
  SoundEffects.WIN,
  "mixkit-quick-win-video-game-notification-269.wav"
);
effects.set(SoundEffects.ROLLING_DICE, "rolling-dice.mp3");
effects.set(SoundEffects.RPS, "rps.mp3");
effects.set(SoundEffects.RANGE_WIN, "mixkit-magical-coin-win-1936.wav");
effects.set(SoundEffects.FLIP_CARD, "card-open-1.mp3");
effects.set(SoundEffects.THICK, "thick.wav");
effects.set(SoundEffects.FALLING, "bucket.wav");
effects.set(SoundEffects.BALL_BUMP, "ball_bump.mp3");
effects.set(SoundEffects.ROULETTE, "roulette.mp3");
effects.set(SoundEffects.LIMBO_TICK, "limbo-tick.mp3");
effects.set(SoundEffects.KENO_OUTCOME_NUMBER, "outcome-number.wav");
effects.set(SoundEffects.WHEEL_STEP, "limbo-tick.mp3");
effects.set(SoundEffects.BET_BUTTON_CLICK, "bet-button-click.mp3");
effects.set(SoundEffects.SLIDER_TICK_1X, "slider-tick-1x.mp3");
effects.set(SoundEffects.BUTTON_CLICK_DIGITAL, "button-click-digital.mp3");
effects.set(SoundEffects.SPIN_TICK_1X, "spin-tick-1.mp3");
effects.set(SoundEffects.WIN_COIN_DIGITAL, "win-claim-coin-digital.mp3");
effects.set(SoundEffects.MINES_BOMB, "mines-bomb.mp3");
effects.set(SoundEffects.LIMBO_SPIN_1, "limbo-spin-1.mp3");
effects.set(SoundEffects.PLINKO_BIG, "plinko-big.mp3");
effects.set(SoundEffects.PLINKO_MID, "plinko-mid.mp3");
effects.set(SoundEffects.PLINKO_SMALL, "plinko-small.mp3");
effects.set(SoundEffects.CHIP_EFFECT, "coin-chip-add-effect-controller.mp3");

type PlayOptions = {
  playbackRate?: number;
  currentTime?: number;
  loop?: boolean;
  autoplay?: boolean;
};

export const baseCdnUrl = CDN_URL + "/sounds";

export const useAudioEffect = (type: SoundEffects) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();

  const { volume } = useAudioContext();

  useEffect(() => {
    if (typeof window == "undefined") return;

    const currentEffect = effects.get(type);

    if (!currentEffect) return;

    let audio;

    audio = new Audio(`${baseCdnUrl}/${effects.get(type)}`);

    setAudio(audio);
  }, []);

  const setOptions = (options?: PlayOptions) => {
    if (audio) {
      audio.playbackRate = options?.playbackRate || 1;

      audio.currentTime = options?.currentTime || 0;

      audio.loop = typeof options?.loop === "boolean" ? options.loop : false;

      audio.autoplay =
        typeof options?.autoplay === "boolean" ? options.autoplay : false;
    }
  };

  const play = async (options?: PlayOptions): Promise<void> => {
    return new Promise((resolve) => {
      if (audio) {
        setOptions(options);

        audio.play();

        audio.onended = () => {
          resolve();
        };
      } else {
        resolve();
      }
    });
  };

  const pause = () => {
    if (audio) {
      audio.pause();
    }
  };

  useEffect(() => {
    if (audio) audio.volume = volume / 100;

    if (audio && volume === 0) audio.muted = true;

    if (audio && volume > 0) audio.muted = false;
  }, [volume, audio]);

  useEffect(() => {
    return () => {
      pause();
    };
  }, []);

  return {
    play,
    pause,
  };
};
