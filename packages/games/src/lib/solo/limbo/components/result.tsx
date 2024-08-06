import { useState } from "react";

import NumberTicker from "../../../common/number-ticker";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import { cn } from "../../../utils/style";
import useLimboGameStore from "../store";

const Result = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);
  const spinEffect = useAudioEffect(SoundEffects.LIMBO_SPIN_1);

  const { limboGameResults, currentAnimationCount } = useLimboGameStore([
    "limboGameResults",
    "currentAnimationCount",
    "gameStatus",
  ]);

  const currentResult = limboGameResults[currentAnimationCount];

  const won = currentResult && currentResult?.payout > 0;

  return (
    <div className="wr-w-full wr-h-full wr-flex wr-justify-center wr-items-center wr-text-[200px] wr-text-white wr-font-bold">
      <div
        className={cn({
          "wr-text-lime-600": won && currentResult && isAnimated,
          "wr-text-red-600": !won && currentResult && isAnimated,
        })}
      >
        {currentResult?.number ? (
          <>
            <NumberTicker
              value={currentResult?.number}
              onAnimationComplete={() => {
                setIsAnimated(true);
                if (currentResult?.payout > 0) {
                  winEffect.play();
                }
              }}
              onAnimationStart={() => {
                setIsAnimated(false);
                spinEffect.play();
              }}
            />
            <span>x</span>
          </>
        ) : (
          <span>1.00x</span>
        )}
      </div>
    </div>
  );
};

export default Result;
