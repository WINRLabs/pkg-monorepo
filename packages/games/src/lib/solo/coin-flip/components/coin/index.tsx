import { Player } from "@lottiefiles/react-lottie-player";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { useGameSkip } from "../../../../game-provider";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import { useCoinFlipGameStore } from "../..";
import { CoinCanvas, CoinFlipForm, CoinProps } from "../../types";
import Canvas from "./canvas";
import CoinRotate from "./coin-rotate";
import CoinConfetti from "./lottie/coins-confetti.json";

export const Coin: React.FC<CoinProps> = ({
  width,
  height,
  onAnimationCompleted,
  onAnimationStep,
  onAnimationSkipped = () => {},
}) => {
  const [coinRotate] = useState<CoinRotate>(new CoinRotate());
  const handleLoad = (canvas: CoinCanvas) => {
    coinRotate.setCanvas(canvas).initialize();
  };

  const flipEffect = useAudioEffect(SoundEffects.COIN_FLIP_TOSS);
  const winEffect = useAudioEffect(SoundEffects.COIN_FLIP_WIN);

  const {
    gameStatus,
    coinFlipGameResults,
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

      coinRotate.finish(side, 1250).then(() => {
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
              ? 500
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
      <div className="wr-absolute wr-top-[40%] wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 max-md:wr-scale-75">
        <Player
          ref={lottieRef}
          src={CoinConfetti}
          speed={2}
          style={{
            width: "700px",
            height: "700px",
            opacity: gameStatus == "IDLE" || gameStatus == "ENDED" ? 0 : 1,
          }}
        />
      </div>
      <Canvas width={width} height={height} onLoad={handleLoad} />
    </>
  );
};
