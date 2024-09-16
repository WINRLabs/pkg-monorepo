import React, { useEffect, useRef, useState } from 'react';

import { genNumberArray } from '../../../../utils/number';
import { cn } from '../../../../utils/style';
import { WheelColor } from '../../constants';
import { useWheelTheme } from '../../providers/theme';
import WheelRotate from './wheel-rotate';
import styles from './wheel-scene.module.css';

export interface WheelUnitProps {
  width: number;
  rotation: number;
  color: WheelColor;
}

const Unit: React.FC<WheelUnitProps> = ({ color, width, rotation }) => {
  return (
    <div
      className={cn(
        styles.field,
        color === WheelColor.BLUE && styles.blue,
        color === WheelColor.GREEN && styles.green,
        color === WheelColor.GREY && styles.grey,
        color === WheelColor.RED && styles.red
      )}
      style={{
        width: `${width}px`,
        transform: `translateX(-${width / 2}px) rotate(${rotation}deg)`,
      }}
      data-wheel-color={
        color === WheelColor.BLUE
          ? 'blue'
          : color === WheelColor.GREEN
            ? 'green'
            : color === WheelColor.GREY
              ? 'grey'
              : color === WheelColor.RED
                ? 'red'
                : 'idle'
      }
    >
      <div></div>
    </div>
  );
};

export interface WheelContainerProps {
  spin?: boolean;
  degree?: number;
  units: WheelColor[];
  onComplete?: () => void;
}

export const Wheel: React.FC<WheelContainerProps> = ({ units, spin, degree, onComplete }) => {
  const theme = useWheelTheme();
  const diameter = 720;

  const dpi = diameter / 180;

  const unitWidth = 1 / dpi;

  const totalWidthOfCircle = diameter * 2;

  const portionHeight = (diameter * 2) / units.length;

  const circleRef = useRef<HTMLDivElement>(null);

  const [wheelRotate] = useState<WheelRotate>(new WheelRotate());

  useEffect(() => {
    if (circleRef.current !== null) {
      wheelRotate.setWheel(circleRef.current);
    }
  }, [circleRef]);

  useEffect(() => {
    if (wheelRotate.isInitialized) {
      if (spin) {
        wheelRotate.move();
      }

      if (degree !== undefined) {
        setTimeout(() => {
          wheelRotate.goToDegree(degree).then(() => {
            onComplete && onComplete();
          });
        });
      }
    }
  }, [spin, degree, wheelRotate]);

  React.useEffect(() => {
    return () => {
      wheelRotate.stop();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={styles.cursor}
        style={{
          backgroundImage: `url(${theme.cursorBackground})`,
        }}
      />

      <div ref={circleRef} className={styles.circle}>
        <img
          width={278}
          height={278}
          className={styles.circleTurret}
          src={theme.wheelBackground}
          alt="JustBet WINR Chain"
        />

        {genNumberArray(totalWidthOfCircle).map((index) => {
          const portionIndex = index / portionHeight - ((index / portionHeight) % 1);

          const color = units[portionIndex];

          return <Unit key={index} color={color} width={unitWidth} rotation={index / dpi} />;
        })}
      </div>
    </div>
  );
};
