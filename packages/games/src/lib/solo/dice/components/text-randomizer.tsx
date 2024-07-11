"use client";
import * as React from "react";

import { cn } from "../../../../lib/utils/style";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import useDiceGameStore from "../store";

export const TextRandomizer = () => {
  const { diceGameResults, currentAnimationCount, gameStatus } =
    useDiceGameStore([
      "diceGameResults",
      "currentAnimationCount",
      "gameStatus",
    ]);

  const currentResult =
    gameStatus === "PLAYING" ? diceGameResults[currentAnimationCount] : null;

  const [resetAnimation, setResetAnimation] = React.useState(false);

  React.useEffect(() => {
    if (diceGameResults.length === 0) {
      return;
    } else {
      setResetAnimation(false);
    }
  }, [diceGameResults]);

  React.useEffect(() => {
    setResetAnimation(true);

    setTimeout(() => {
      setResetAnimation(false);
    }, 1000);
  }, [diceGameResults]);

  return (
    <div className="wr-relative wr-w-full">
      <div>
        {currentResult ? (
          <div
            className={cn("wr-transition-all", {
              "wr-opacity-0 delay-1000":
                currentAnimationCount + 1 === diceGameResults.length &&
                gameStatus !== "PLAYING",
              "wr-opacity-0": resetAnimation,
              "wr-opacity-100 wr-delay-100": diceGameResults.length === 1,
            })}
          >
            <span
              className={cn(
                "wr-absolute wr-bottom-6 wr-z-10 -wr-translate-x-1/2 wr-rounded-lg wr-p-2 wr-text-4xl wr-font-bold wr-transition-all",
                {
                  "wr-bg-lime-600": currentResult?.payout > 0,
                  "wr-bg-red-600": currentResult?.payout <= 0,
                }
              )}
              style={{ left: `${currentResult.resultNumber}%` }}
            >
              {currentResult.resultNumber}
            </span>
            <Polygon
              result={currentResult?.payout || 0 > 0 ? "win" : "loss"}
              resultNumber={currentResult.resultNumber}
            />
          </div>
        ) : null}
      </div>
      {/* Dots */}
      {diceGameResults.map((result, key) => (
        <span
          key={key}
          style={{ left: `${result.resultNumber}%` }}
          className={cn(
            "wr-absolute wr-bottom-[-40px] wr-h-1.5 wr-w-1.5 -wr-translate-x-1/2 wr-rounded-full wr-opacity-0 wr-transition-all",
            {
              "wr-bg-lime-600": result?.payout > 0,
              "wr-bg-red-600": result?.payout <= 0,
              "wr-opacity-100 transition-all": key <= currentAnimationCount,
              "wr-opacity-0": resetAnimation,
            }
          )}
        >
          <TooltipProvider>
            <Tooltip key={key}>
              <TooltipTrigger>
                <div className="wr-relative wr-top-2 wr-block wr-h-1.5 wr-w-1.5 wr-rounded" />
              </TooltipTrigger>
              <TooltipContent className="wr- wr-absolute wr-top-0 wr-z-[100]">
                <p>{result?.resultNumber}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      ))}
    </div>
  );
};

const Polygon = ({
  result,
  resultNumber,
}: {
  result: "win" | "loss";
  resultNumber?: number;
}) => {
  return (
    <svg
      width="21"
      height="15"
      viewBox="0 0 21 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="wr-absolute wr-bottom-[9px] wr-z-10 -wr-translate-x-1/2 wr-transition-all"
      style={{ left: `${resultNumber}%` }}
    >
      <path
        d="M12.196 13.2864C11.4127 14.5397 9.58734 14.5397 8.804 13.2864L0.500001 -1.58893e-07L20.5 -1.90735e-06L12.196 13.2864Z"
        fill={result === "win" ? "#65A30D" : "#DC2626"}
      />
    </svg>
  );
};
