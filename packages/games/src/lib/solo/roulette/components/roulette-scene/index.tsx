import React from "react";

import { CDN_URL } from "../../../../constants";
import { useGameSkip } from "../../../../game-provider";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import { wait } from "../../../../utils/promise";
import { cn } from "../../../../utils/style";
import { rouletteWheelNumbers } from "../../constants";
import useRouletteGameStore from "../../store";
import { RouletteGameResult } from "../../types";
import { RouletteWheel } from "../roulette-wheel";

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
    "addLastBet",
    "updateLastBets",
    "updateRouletteGameResults",
    "updateGameStatus",
    "rouletteGameResults",
  ]);

  const [degree, setDegree] = React.useState<number>(0);

  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  const reference = 360 / 37;

  const ballAnimation: any = React.useMemo(
    () => ({
      "--finishTransform": `rotate(${360 * 2 + degree + 3}deg)`,
    }),
    [degree]
  );

  const ballEffect = useAudioEffect(SoundEffects.ROULETTE);

  const { isAnimationSkipped } = useGameSkip();

  const skipRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (rouletteResult && rouletteResult.length) {
      console.log("animation started");

      const turn = async (i = 0) => {
        const order = i + 1;

        const idxValue = rouletteWheelNumbers.findIndex(
          (d) => d.number === rouletteResult[i]?.outcome
        );

        console.log(idxValue, "idxValue");

        setDegree(idxValue * reference + 2);

        setIsAnimating(true);

        !skipRef.current && ballEffect.play();

        !skipRef.current && (await wait(ANIMATION_TIMEOUT));

        !skipRef.current && onAnimationStep(order);

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
          updateGameStatus("ENDED");

          return;
        } else {
          setTimeout(() => turn(order), 100);
        }
      };

      turn(0);
    }
  }, [rouletteResult]);

  const onSkip = () => {
    updateLastBets(rouletteResult as RouletteGameResult[]);
    updateRouletteGameResults([]);
    onAnimationSkipped(rouletteResult as RouletteGameResult[]);
    setTimeout(() => updateGameStatus("ENDED"), 50);
  };

  React.useEffect(() => {
    skipRef.current = isAnimationSkipped;

    console.log(isAnimationSkipped, "is");
  }, [isAnimationSkipped]);

  return (
    <div
      className={cn(
        "wr-relative wr-origin-top wr-transition-all wr-duration-500 wr-top",
        {
          "wr-scale-100": !isPrepared,
          "wr-scale-[2] max-md:wr-top-1/2 max-md:-wr-translate-y-1/2 max-lg:wr-top-20 max-lg:wr-scale-110 wr-z-[1]":
            isPrepared,
        }
      )}
    >
      <RouletteWheel isPrepared={isPrepared} isAnimating={isAnimating} />

      <div
        style={ballAnimation}
        className={cn(
          "wr-absolute wr-left-1/2 wr-top-1/2 wr-z-20 wr-h-[300px] wr-w-[300px] -wr-translate-x-1/2 -wr-translate-y-1/2",
          {
            "wr-animate-roulette-ball-spin wr-delay-300": isAnimating,
          }
        )}
      >
        <img
          width={25}
          height={25}
          src={`${CDN_URL}/roulette/ball.svg`}
          alt="JustBet Roulette Ball"
          className={cn(
            "wr-relative wr-top-[0px] wr-mx-auto wr-my-0 wr-max-h-[25px] wr-max-w-[25px] wr-opacity-0 wr-transition-all",
            {
              "wr-origin-center wr-animate-roulette-scroll-bottom-ball":
                isAnimating,
            }
          )}
        />
      </div>
    </div>
  );
};
