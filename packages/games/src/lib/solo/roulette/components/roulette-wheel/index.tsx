"use client";

import React from "react";

import { CDN_URL } from "../../../../constants";
import { genNumberArray } from "../../../../utils/number";
import { cn } from "../../../../utils/style";
import { rouletteWheelNumbers } from "../../constants";
import { RouletteWheelColor } from "../../types";

interface RouletteWheelProps {
  isPrepared: boolean;
  isAnimating: boolean;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isPrepared,
  isAnimating,
}) => {
  const diameter = 720;

  const dpi = diameter / 180;

  const unitWidth = 1 / dpi;

  const totalWidthOfCircle = diameter * 2;

  const portionHeight = (diameter * 2) / rouletteWheelNumbers.length;

  return (
    <div
      className={cn(
        "wr-relative wr-flex wr-h-[235px] wr-w-[235px] wr-items-center wr-justify-center wr-opacity-100",
        {
          "wr-origin-center wr-animate-roulette-rotation max-lg:wr-opacity-0":
            !isPrepared,
          "wr-animate-playing-roulette-rotation wr-delay-300": isAnimating,
        }
      )}
    >
      <div className="wr-h-full wr-w-full">
        <img
          className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[3] wr-max-h-[175px] wr-max-w-[175px] -wr-translate-x-1/2 -wr-translate-y-1/2"
          width={175}
          height={175}
          src={`${CDN_URL}/roulette/turret.svg`}
          alt="JustBet Roulette"
        />
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-20 wr-h-[102%] wr-w-[102%] -wr-translate-x-1/2 -wr-translate-y-1/2 wr-rounded-full  wr-border-[4px] wr-border-zinc-800 wr-bg-transparent" />

        {genNumberArray(totalWidthOfCircle).map((idx) => {
          const portionIdx = idx / portionHeight - ((idx / portionHeight) % 1);

          const color = rouletteWheelNumbers[portionIdx]
            ?.color as RouletteWheelColor;

          return (
            <Unit
              key={idx}
              color={color}
              width={unitWidth}
              rotation={idx / dpi}
            />
          );
        })}
      </div>
    </div>
  );
};

interface RouletteUnitProps {
  color: RouletteWheelColor;
  width: number;
  rotation: number;
}

const Unit: React.FC<RouletteUnitProps> = ({ color, width, rotation }) => {
  const [number, setNumber] = React.useState<number | null>(null);

  const [index, setIndex] = React.useState<number>(1);

  const renderNumber = (rotation: number) => {
    for (let i = 0; i < rouletteWheelNumbers.length; i++) {
      if (rotation === rouletteWheelNumbers[i]?.degree) {
        setNumber(rouletteWheelNumbers[i]?.number as number);

        setIndex(2);
      }
    }
  };

  React.useEffect(() => {
    renderNumber(rotation);
  }, [rotation]);

  return (
    <div
      className={cn(
        "wr-absolute wr-left-1/2 wr-h-1/2 wr-w-[1px] wr-origin-bottom",
        {
          "wr-bg-green-500": color === RouletteWheelColor.GREEN,
          "wr-bg-zinc-800": color === RouletteWheelColor.GREY,
          "wr-bg-red-600": color === RouletteWheelColor.RED,
        }
      )}
      style={{
        width: `${width}px`,
        transform: `translateX(-${width / 2}px) rotate(${rotation}deg)`,
        zIndex: index,
      }}
    >
      <div
        className={cn(
          "wr-absolute wr-left-0 wr-top-0 wr-h-[40px] wr-w-[1px] before:wr-z-[1] before:wr-block before:wr-h-[22px] before:wr-content-[''] after:wr-z-[1] after:wr-block after:wr-h-[14px] after:wr-content-['']",
          {
            "wr-bg-zinc-800 before:wr-bg-zinc-800 after:wr-bg-zinc-800":
              color === RouletteWheelColor.GREY,
            "wr-bg-green-500 before:wr-bg-green-500 after:wr-bg-green-500":
              color === RouletteWheelColor.GREEN,
            "wr-bg-red-600 before:wr-bg-red-600 after:wr-bg-red-600":
              color === RouletteWheelColor.RED,
          }
        )}
      />
      <span className="wr-absolute wr-left-1/2 wr-top-[12px] wr-z-10 wr-w-5 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-rotate-180 wr-text-center wr-text-[10px] wr-font-bold">
        {number}
      </span>
    </div>
  );
};
