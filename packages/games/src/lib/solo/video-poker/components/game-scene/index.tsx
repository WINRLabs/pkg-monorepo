"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../../../utils/style";
import { VideoPokerForm } from "../../types";
import useVideoPokerGameStore from "../../store";
import { VideoPokerResult, videoPokerHands } from "../../constants";
const ResultBox: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "wr-flex wr-h-20 wr-flex-col wr-items-center wr-justify-center wr-rounded-lg wr-border wr-border-zinc-800 wr-text-lg wr-font-bold wr-leading-[18px] max-md:wr-text-center max-md:wr-text-xs",
        className
      )}
    >
      {children}
    </div>
  );
};
/*     <div className="mt-1 text-base font-normal leading-5 text-zinc-500">
              100x $101
            </div> */

export const VideoPokerResults = () => {
  // copy video poker result names and remove first item
  const form = useFormContext() as VideoPokerForm;

  const { gameResult, updateState } = useVideoPokerGameStore([
    "gameResult",
    "updateState",
  ]);

  const wager = form.watch("wager");

  const hands = videoPokerHands.slice(1);

  return (
    <section className="wr-w-full">
      <div className="wr-w-full wr-transition-all wr-duration-500">
        <ResultBox
          className={cn("wr-mb-3", {
            "wr-bg-royal-flush wr-text-yellow-900":
              gameResult === VideoPokerResult.ROYAL_FLUSH,
          })}
        >
          Royal Flush
          <div
            className={cn(
              "wr-mt-1 wr-text-base wr-font-normal wr-leading-5 wr-text-zinc-500",
              {
                "wr-text-yellow-700":
                  gameResult === VideoPokerResult.ROYAL_FLUSH,
              }
            )}
          >
            100x ${100 * wager}
          </div>
        </ResultBox>
        <div className="wr-grid wr-w-full wr-grid-cols-4 wr-grid-rows-2 wr-gap-3 wr-transition-all wr-duration-500">
          {hands.map((hand, idx) => {
            return (
              <ResultBox
                key={idx}
                className={cn({
                  "wr-bg-jacks-or-better":
                    hand.name === "Jacks or Better" &&
                    gameResult === VideoPokerResult.JACKS_OR_BETTER,
                  "wr-bg-videopoker-result wr-text-lime-900":
                    hand.name !== "Jacks or Better" &&
                    gameResult === hand.value,
                })}
              >
                {hand.name}
                <div
                  className={cn(
                    "wr-mt-1 wr-text-base wr-font-normal wr-leading-5 wr-text-zinc-500 max-md:wr-text-xs",
                    {
                      "wr-text-orange-200":
                        hand.name === "Jacks or Better" &&
                        gameResult === VideoPokerResult.JACKS_OR_BETTER,
                      "wr-text-lime-800":
                        hand.name !== "Jacks or Better" &&
                        gameResult === hand.value,
                    }
                  )}
                >
                  {hand.multiplier}x{" "}
                  <span className="wr-ml-[10px]">
                    ${hand.multiplier * wager}
                  </span>
                </div>
              </ResultBox>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const VideoPokerScene = () => {
  return <section></section>;
};