import React, {
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import useDimensions from "react-cool-dimensions";
import { useFormContext } from "react-hook-form";

import { cn } from "../../../utils/style";
import useLimboGameStore from "../store";
import { LimboForm } from "../types";

type ScalePoint = {
  value: number;
  topPercent: number;
};

// Define the points for the scale
const scalePoints: ScalePoint[] = [
  { value: 0, topPercent: -410 },
  { value: 1, topPercent: -390 },
  { value: 2, topPercent: -362 },
  { value: 3, topPercent: -334 },
  { value: 4, topPercent: -306 },
  { value: 5, topPercent: -278 },
  { value: 6, topPercent: -250 },
  { value: 7, topPercent: -222 },
  { value: 8, topPercent: -194 },
  { value: 9, topPercent: -166 },
];

const largerScalePoints: ScalePoint[] = [
  { value: 10, topPercent: -138 },
  { value: 15, topPercent: -110 },
  { value: 20, topPercent: -82 },
  { value: 25, topPercent: -70 },
  { value: 30, topPercent: -60 },
  { value: 35, topPercent: -53 },
  { value: 40, topPercent: -40 },
  { value: 45, topPercent: -32 },
  { value: 50, topPercent: -25 },
  { value: 55, topPercent: -18 },
  { value: 60, topPercent: -10 },
  { value: 65, topPercent: 3 },
  { value: 70, topPercent: 15 },
  { value: 80, topPercent: 31 },
  { value: 90, topPercent: 45 },
  { value: 100, topPercent: 60 },
];

const clickScalePoint: ScalePoint[] = [
  { value: 0, topPercent: 100 },
  { value: 1, topPercent: 95 },
  { value: 2, topPercent: 89 },
  { value: 3, topPercent: 84 },
  { value: 4, topPercent: 77 },
  { value: 5, topPercent: 71 },
  { value: 6, topPercent: 65 },
  { value: 7, topPercent: 60 },
  { value: 8, topPercent: 53 },
  { value: 9, topPercent: 48 },
  { value: 10, topPercent: 42 },
  { value: 15, topPercent: 36 },
  { value: 20, topPercent: 30 },
  { value: 35, topPercent: 24 },
  { value: 40, topPercent: 21 },
  { value: 45, topPercent: 20 },
  { value: 50, topPercent: 18 },
  { value: 55, topPercent: 16 },
  { value: 60, topPercent: 13 },
  { value: 65, topPercent: 12 },
  { value: 70, topPercent: 10 },
  { value: 80, topPercent: 6 },
  { value: 90, topPercent: 3 },
  { value: 100, topPercent: 0 },
];

function interpolateValue(percent: number): number | null {
  if (percent < 0 || percent > 100) return null;

  for (let i = 0; i < clickScalePoint.length - 1; i++) {
    const current = clickScalePoint[i];
    const next = clickScalePoint[i + 1];

    if (current && next) {
      if (percent <= current.topPercent && percent >= next.topPercent) {
        // Calculate the interpolation ratio between the two points
        const ratio =
          (current.topPercent - percent) /
          (current.topPercent - next.topPercent);
        // Interpolate the value based on the calculated ratio and return it
        return current.value + ratio * (next.value - current.value);
      }
    }
  }

  // Return null if no matching interval was found
  return null;
}
function interpolate(value: number, points: ScalePoint[]): number {
  // Find the two points between which we need to interpolate
  const lowerPoint = points.reduce((prev, curr) =>
    value >= curr.value ? curr : prev
  );

  const upperPoint = points.reduce((prev, curr) =>
    value <= curr.value ? curr : prev
  );

  // Calculate the position of the value between the two points (0 to 1)
  const rangeValue = upperPoint.value - lowerPoint.value;

  const rangePercent = upperPoint.topPercent - lowerPoint.topPercent;

  const valuePosition = (value - lowerPoint.value) / rangeValue;

  // Interpolate the topPercent for the value
  const interpolatedPercent =
    lowerPoint.topPercent + valuePosition * rangePercent;

  // console.log("interpolatedPercent", interpolatedPercent);

  return interpolatedPercent;
}

const LimboSlider = () => {
  const { gameStatus, lastBets, limboGameResults, currentAnimationCount } =
    useLimboGameStore([
      "gameStatus",
      "lastBets",
      "limboGameResults",
      "currentAnimationCount",
    ]);

  const won = lastBets[lastBets.length - 1]?.payout || 0 > 0 ? true : false;

  const result = lastBets[lastBets.length - 1]?.number || 0;

  const { observe, width } = useDimensions<HTMLDivElement>({
    onResize: ({ observe, unobserve }) => {
      unobserve();

      observe();
    },
  });

  const form = useFormContext() as LimboForm;

  const limboMultiplier = form.watch("limboMultiplier");

  const showNumber =
    gameStatus === "IDLE" ||
    gameStatus === "ENDED" ||
    result === 0 ||
    limboGameResults.length === 0 ||
    currentAnimationCount === 0
      ? limboMultiplier
      : result;

  const divRef = useRef<HTMLDivElement>(null);

  // const sliderRef = useRef<HTMLDivElement>(null);

  const firstSteps = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const secondSteps = [100, 80, 65, 50, 35, 20, 15];

  const [percentage, setPercentage] = useState<number>(0);

  // const [isDragging, setIsDragging] = useState(false);

  const calculatedTopPostion = React.useMemo(() => {
    const topPositionPercent = interpolate(showNumber, scalePoints);

    const topPositionPercentLarger = interpolate(showNumber, largerScalePoints);

    const topPositionPixels = (topPositionPercent / 100) * 85;

    const topPositionPixelsLarger = (topPositionPercentLarger / 100) * 85;

    if (showNumber <= 10) {
      return topPositionPixels;
    } else {
      return topPositionPixelsLarger;
    }
  }, [showNumber]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const divElement = divRef.current;
      const divRect = divElement.getBoundingClientRect();
      const mouseY = event.clientY;
      const divTopY = divRect.top;
      const divHeight = divRect.height;

      const distanceFromTop = mouseY - divTopY;
      const percentageFromTop = distanceFromTop / divHeight;

      const topPositionPercent = interpolateValue(percentageFromTop * 100);

      if (
        Number(topPositionPercent) > 1.1 &&
        Number(topPositionPercent) < 100 &&
        gameStatus !== "PLAYING"
      )
        form.setValue(
          "limboMultiplier",
          Number(topPositionPercent?.toFixed(2))
        );
    }
  };

  // const handleMouseDown = () => {
  //   setIsDragging(true);
  // };

  // const handleMouseUp = () => {
  //   setIsDragging(false);
  // };

  // useEffect(() => {
  //   if (isDragging) {
  //     const topPositionPercent = interpolateValue(percentage);

  //     if (
  //       Number(topPositionPercent) > 1.1 &&
  //       Number(topPositionPercent) < 100 &&
  //       gameStatus !== "PLAYING"
  //     )
  //       form.setValue(
  //         "limboMultiplier",
  //         Number(topPositionPercent?.toFixed(2))
  //       );

  //     window.addEventListener("mouseup", handleMouseUp);
  //   } else {
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   }
  //   return () => {
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [isDragging, percentage]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent): void => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const height = rect.height;
        const calculatedPercentage = (mouseY / height) * 100;
        setPercentage(calculatedPercentage);
      }
    };

    const handleMouseEvent = (e: Event) =>
      handleMouse(e as unknown as MouseEvent);

    document.addEventListener("mousemove", handleMouseEvent);

    return () => {
      document.removeEventListener("mousemove", handleMouseEvent);
    };
  }, []);

  return (
    <div className="wr-h-full ">
      <div
        className="wr-absolute wr-left-0 wr-top-28 wr-h-[calc(100%_-_64px_-_12px_-_48px)] wr-w-full"
        ref={observe}
      >
        <div className="wr-relative wr-h-full wr-w-full wr-select-none">
          <div
            className={cn(
              "wr-absolute wr-flex wr-cursor-pointer wr-h-[400%] wr-w-full wr-flex-col wr-justify-between wr-px-[15px] wr-text-[14px] wr-text-zinc-600 wr-transition-all wr-duration-300 wr-ease-in-out",

              {
                "wr-bg-limbo-win":
                  won && result !== 0 && gameStatus === "PLAYING",
                "wr-bg-limbo-loss":
                  !won && result !== 0 && gameStatus === "PLAYING",
              }
            )}
            style={{
              top: `${calculatedTopPostion}%`,
            }}
            ref={divRef}
            onClick={handleClick}
          >
            {secondSteps.map((step) => (
              <>
                <div key={step} className="wr-flex wr-justify-between">
                  <div className="wr-flex wr-items-center wr-gap-1.5 wr-leading-[2px]">
                    <div className="wr-h-[1px] wr-w-[40px] wr-bg-zinc-800" />
                    {step.toFixed(2)} x
                  </div>
                  <div className="wr-flex wr-items-center wr-gap-1.5 wr-leading-[2px]">
                    {step.toFixed(2)} x
                    <div className="wr-h-[1px] wr-w-[40px] wr-bg-zinc-800" />
                  </div>
                </div>

                <div className="wr-flex wr-justify-between ">
                  <div className=" wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                  <div className=" wr-ml-auto wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                </div>
                <div className="wr-flex wr-justify-between ">
                  <div className=" wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                  <div className=" wr-ml-auto wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                </div>
                <div className="wr-flex wr-justify-between ">
                  <div className=" wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                  <div className=" wr-ml-auto wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                </div>
              </>
            ))}
            {firstSteps.map((step) => (
              <>
                <div key={step} className="wr-flex wr-justify-between">
                  <div className="wr-flex wr-items-center wr-gap-1.5 wr-leading-[2px]">
                    <div className="wr-h-[1px] wr-w-[40px] wr-bg-zinc-800" />
                    {step.toFixed(2)}x
                  </div>
                  <div className=" wr-flex wr-items-center wr-gap-1.5 wr-leading-[2px]">
                    {step.toFixed(2)}x
                    <div className="wr-h-[1px] wr-w-[40px] wr-bg-zinc-800" />
                  </div>
                </div>

                <div className="wr-flex wr-justify-between ">
                  <div className=" wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                  <div className=" wr-ml-auto wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                </div>
                <div className="wr-flex wr-justify-between ">
                  <div className=" wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                  <div className=" wr-ml-auto wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                </div>
                <div className="wr-flex wr-justify-between ">
                  <div className=" wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                  <div className=" wr-ml-auto wr-h-[1px] wr-w-5 wr-bg-zinc-800" />
                </div>
              </>
            ))}
          </div>

          <div
            className="wr-absolute  wr-top-1/2 wr-h-0.5 wr-w-[1020px] -wr-translate-y-1/2 wr-border wr-border-zinc-700  wr-shadow-[0_1px_5px] focus:wr-shadow-[0_2px_10px] focus:wr-outline-none focus:wr-ring-0"
            style={{ width: `${width}px` }}
            // ref={sliderRef}
            // onMouseDown={handleMouseDown}
            // tabIndex={-1}
          >
            <div className="wr-h-[70px] wr-bg-limbo-track"></div>

            <span className="wr-absolute  -wr-top-12  wr-left-1/2 wr-h-[64px] -wr-translate-x-1/2 wr-transform wr-border-none wr-text-[64px] wr-font-bold">
              {showNumber.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimboSlider;
