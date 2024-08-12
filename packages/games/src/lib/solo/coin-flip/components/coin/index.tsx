import { Player } from "@lottiefiles/react-lottie-player";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { useGameSkip } from "../../../../game-provider";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import useMediaQuery from "../../../../hooks/use-media-query";
import { useCoinFlipGameStore } from "../..";
import { CoinCanvas, CoinFlipForm, CoinProps } from "../../types";
import Canvas from "./canvas";
import CoinRotate from "./coin-rotate";
import CoinConfetti from "./lottie/coins-confetti.json";
import { cn } from "../../../../utils/style";

export const Coin: React.FC<CoinProps> = ({
  width,
  height,
  onAnimationCompleted,
  onAnimationStep,
  onAnimationSkipped = () => {},
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [coinRotate] = useState<CoinRotate>(new CoinRotate());
  const handleLoad = (canvas: CoinCanvas) => {
    coinRotate.setCanvas(canvas).initialize();
  };

  const flipEffect = useAudioEffect(SoundEffects.LIMBO_SPIN_1);
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const {
    gameStatus,
    coinFlipGameResults,
    lastBets,
    updateCoinFlipGameResults,
    updateGameStatus,
    addLastBet,
    updateLastBets,
  } = useCoinFlipGameStore([
    "gameStatus",
    "coinFlipGameResults",
    "updateCoinFlipGameResults",
    "updateGameStatus",
    "addLastBet",
    "updateLastBets",
    "lastBets",
  ]);

  const form = useFormContext() as CoinFlipForm;

  const coinSide = form.watch("coinSide");

  const lottieRef = React.useRef<any>(null);

  const skipRef = React.useRef<boolean>(false);

  const { isAnimationSkipped } = useGameSkip();

  React.useEffect(() => {
    if (coinFlipGameResults.length == 0) return;

    const turn = (i = 0) => {
      const side = Number(coinFlipGameResults[i]?.coinSide) || 0;
      const payout = coinFlipGameResults[i]?.payout || 0;
      const payoutInUsd = coinFlipGameResults[i]?.payoutInUsd || 0;
      flipEffect.play();

      coinRotate.finish(side, 750).then(() => {
        const curr = i + 1;

        onAnimationStep && onAnimationStep(curr);

        addLastBet({
          coinSide: side,
          payout,
          payoutInUsd,
        });

        if (payout > 0) {
          lottieRef.current.play();
          winEffect.play();
        }

        if (skipRef.current) {
          onSkip();
        } else if (coinFlipGameResults.length === curr) {
          updateCoinFlipGameResults([]);
          onAnimationCompleted && onAnimationCompleted(coinFlipGameResults);

          const delay =
            coinFlipGameResults[coinFlipGameResults.length - 1]?.coinSide ==
            coinSide
              ? 400
              : 0;

          setTimeout(() => updateGameStatus("ENDED"), delay);
        } else {
          setTimeout(() => turn(curr), 350);
        }
      });
    };

    turn();
  }, [coinFlipGameResults]);

  const onSkip = () => {
    updateLastBets(coinFlipGameResults);
    updateCoinFlipGameResults([]);
    onAnimationSkipped(coinFlipGameResults);
    setTimeout(() => updateGameStatus("ENDED"), 50);
  };

  useEffect(() => {
    coinRotate.flipTo(coinSide, 1000);
  }, [coinSide]);

  useEffect(() => {
    skipRef.current = isAnimationSkipped;
  }, [isAnimationSkipped]);

  return (
    <>
      <div
        className={cn(
          "wr-absolute wr-top-1/2 lg:wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 max-md:wr-scale-75 wr-transition-all wr-duration-200",
          {
            "wr-pt-5 lg:wr-pt-0": lastBets.length,
          }
        )}
      >
        <Player
          ref={lottieRef}
          src={CoinConfetti}
          speed={2}
          style={{
            width: isMobile ? "500px" : "700px",
            height: isMobile ? "500px" : "700px",
            opacity: gameStatus == "IDLE" || gameStatus == "ENDED" ? 0 : 1,
          }}
        />
      </div>
      <Canvas width={width} height={height} onLoad={handleLoad} />
    </>
  );
};
