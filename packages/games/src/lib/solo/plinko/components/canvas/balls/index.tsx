import React, { useEffect, useRef } from 'react';

import { useGameSkip } from '../../../../../game-provider';
import { cn } from '../../../../../utils/style';
import styles from './balls.module.css';

const initialStyle = {
  transform: `translate(0px, -12px)`,
  transitionDuration: '0ms',
  transitionTimingFunction: 'ease-in',
};

interface PlinkoBallProps {
  order: number;
  path: number[];
  isSkipped: boolean;
  onAnimationEnd: (order: number, isSkipped?: boolean) => void;
  betCount: number;
}

const Ball: React.FC<PlinkoBallProps> = ({ path, order, isSkipped, onAnimationEnd, betCount }) => {
  const [jump, setJump] = React.useState(false);
  const [style, setStyle] = React.useState(initialStyle);
  const skipRef = React.useRef<boolean>(isSkipped);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    skipRef.current = isSkipped;
  }, [isSkipped]);

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (path.length > 0) {
      let x = 0;
      let delay = order * 400;

      const initialX = isMobile ? 15 : 25;
      const initialY = isMobile ? 25 : 30;

      if (betCount === 1) {
        delay = 1;
      }

      for (let i = 0; i < path.length + 2; i++) {
        if (i === 0) {
          const t = setTimeout(() => {
            setStyle({
              transform: `translate(0px, 0px)`,
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-in',
            });
            setJump(true);
          }, delay);

          if (skipRef.current) {
            clearTimeout(t);

            return;
          }
        } else {
          timeoutRef.current = setTimeout(
            () => {
              if (path[i - 1] === 0) {
                x -= initialX;
              } else if (path[i - 1] !== 0) {
                x += initialX;
              }

              setStyle({
                transform: `translate(${x}px, ${i * initialY}px)`,
                transitionDuration: '200ms',
                transitionTimingFunction: 'ease-in',
              });

              if (i - 1 === path.length && !skipRef.current) {
                onAnimationEnd(order);

                clearTimeout(timeoutRef.current);

                // clearInterval(ballInterval);
              }

              const isPathEnded = i === path.length;

              if (isPathEnded) {
                const t = setTimeout(() => {
                  setStyle(initialStyle);
                  setJump(false);
                }, 350);

                if (skipRef.current) {
                  clearTimeout(t);
                }
              }

              if (skipRef.current) {
                // clearInterval(ballInterval);
              }
            },
            delay + i * 200
          );
        }
      }
    }
  }, [path]);

  return (
    <div
      className={styles.ballMover}
      style={{
        ...style,
        visibility: jump ? 'visible' : 'hidden',
      }}
    >
      <div className={cn(styles.ball, jump && styles.jump)} />
    </div>
  );
};

interface PlinkoBallsProps {
  count: number;
  paths?: number[][];
  onAnimationEnd: (order: number, isSkipped?: boolean) => void;
}

export const Balls: React.FC<PlinkoBallsProps> = ({ count, paths, onAnimationEnd }) => {
  const calls = useRef<number[]>([]);

  useEffect(() => {
    calls.current = [];
  }, [paths]);

  return (
    <div
      className={cn({
        'wr-hidden': paths?.length === 0,
      })}
    >
      {paths &&
        paths.map((path, i) => (
          <Ball
            betCount={count}
            key={i}
            order={i}
            path={path as number[]}
            isSkipped={false}
            onAnimationEnd={(order, skipped) => {
              if (calls.current.includes(order)) return;
              calls.current.push(order);
              onAnimationEnd(order, skipped);
            }}
          />
        ))}
    </div>
  );
};
