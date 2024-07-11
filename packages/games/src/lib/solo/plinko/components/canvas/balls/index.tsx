import React from "react";

import { useGameSkip } from "../../../../../game-provider";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../../hooks/use-audio-effect";
import useMediaQuery from "../../../../../hooks/use-media-query";
import { genNumberArray } from "../../../../../utils/number";
import { cn } from "../../../../../utils/style";
import { usePlinkoGameStore } from "../../..";
import styles from "./balls.module.css";

const initialStyle = {
  transform: `translate(0px, -12px)`,
  transitionDuration: "0ms",
  transitionTimingFunction: "ease-in",
};

interface PlinkoBallProps {
  order: number;
  path: number[];
  isSkipped: boolean;
  onAnimationEnd: (order: number, isSkipped?: boolean) => void;
}

const Ball: React.FC<PlinkoBallProps> = ({
  path,
  order,
  isSkipped,
  onAnimationEnd,
}) => {
  const [jump, setJump] = React.useState(false);
  const [style, setStyle] = React.useState(initialStyle);
  const skipRef = React.useRef<boolean>(isSkipped);
  const isMobile = useMediaQuery("(max-width:768px)");
  const mobileRef = React.useRef<boolean>(isMobile);
  const ballEffect = useAudioEffect(SoundEffects.BALL_BUMP);
  const { gameStatus } = usePlinkoGameStore(["gameStatus"]);

  React.useEffect(() => {
    skipRef.current = isSkipped;
  }, [isSkipped]);

  React.useEffect(() => {
    mobileRef.current = isMobile;
  }, [isMobile]);

  React.useEffect(() => {
    if (path.length > 0) {
      let x = 0;
      let delay = order * 500;

      const initialX = mobileRef.current ? 10 : 25;
      const initialY = mobileRef.current ? 20 : 30;

      const ballInterval = setInterval(() => ballEffect.play(), 400);

      for (let i = 0; i < path.length + 2; i++) {
        console.log(i, "i");
        if (i === 0) {
          const t = setTimeout(() => {
            setStyle({
              transform: `translate(0px, 0px)`,
              transitionDuration: "400ms",
              transitionTimingFunction: "ease-in",
            });
            setJump(true);
          }, delay);

          if (skipRef.current) {
            clearTimeout(t);

            return;
          }
        } else {
          const t = setTimeout(
            () => {
              if (path[i - 1] === 0) {
                x -= initialX;
              } else if (path[i - 1] !== 0) {
                x += initialX;
              }

              setStyle({
                transform: `translate(${x}px, ${i * initialY}px)`,
                transitionDuration: "400ms",
                transitionTimingFunction: "ease-in",
              });

              if (i - 1 === path.length && !skipRef.current) {
                onAnimationEnd(order);

                clearTimeout(t);

                clearInterval(ballInterval);
              }

              // if (skipRef.current) {
              //   onAnimationEnd(order, true);
              // }

              if (i === path.length) {
                const t = setTimeout(() => {
                  setStyle(initialStyle);
                  setJump(false);
                }, 600);

                if (skipRef.current) {
                  clearTimeout(t);
                }
              }

              if (skipRef.current) {
                clearInterval(ballInterval);
              }
            },
            delay + i * 400
          );
        }
      }
    }
  }, [path]);

  return (
    <div className={styles.ballMover} style={style}>
      <div className={cn(styles.ball, jump && styles.jump)} />
    </div>
  );
};

interface PlinkoBallsProps {
  count: number;
  paths?: number[][];
  onAnimationEnd: (order: number, isSkipped?: boolean) => void;
}

export const Balls: React.FC<PlinkoBallsProps> = ({
  count,
  paths,
  onAnimationEnd,
}) => {
  const { isAnimationSkipped } = useGameSkip();

  const skipRef = React.useRef<boolean>(false);
  const balls = React.useMemo(() => {
    if (skipRef.current) {
      return [];
    } else {
      return genNumberArray(count);
    }
  }, [count, skipRef.current]);

  React.useEffect(() => {
    if (isAnimationSkipped) {
      onAnimationEnd(0, true);
    }
  }, [isAnimationSkipped]);

  React.useEffect(() => {
    skipRef.current = isAnimationSkipped;
  }, [isAnimationSkipped]);

  return (
    <>
      {balls.map((i) => (
        <Ball
          key={i}
          order={i}
          path={(paths && paths[i] ? paths[i] : []) as number[]}
          isSkipped={isAnimationSkipped}
          onAnimationEnd={onAnimationEnd}
        />
      ))}
    </>
  );
};
