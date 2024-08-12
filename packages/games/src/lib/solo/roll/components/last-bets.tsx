import React from "react";

import { LastBetsContainer } from "../../../common/last-bets-container";
import { FormLabel } from "../../../ui/form";
import { cn } from "../../../utils/style";
import useRollGameStore from "../store";
import { miniDotPosition } from "./dice";

type DiceResultIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const LastBets = () => {
  const { lastBets } = useRollGameStore(["lastBets"]);
  const lastFiveBets = lastBets?.slice(-5);

  return (
    <LastBetsContainer className="h-12">
      {lastFiveBets?.map((result, index) => {
        return (
          <div
            className={cn(
              "wr-relative wr-aspect-square md:wr-size-9 wr-size-12 wr-rounded-md wr-border-2 wr-border-zinc-800 wr-bg-black",
              {
                "wr-bg-green-500": result.payout > 0,
              }
            )}
            key={`dot-${index}`}
          >
            {miniDotPosition?.[(result.dice - 1) as DiceResultIndex]?.map(
              (dot, i) => (
                <div
                  key={i}
                  className={cn(
                    "wr-ease wr-transfrom  wr-absolute wr-h-2 wr-w-2 wr-shrink-0 wr-rounded-full wr-border-2 wr-border-[#EDEDF1] wr-bg-dice wr-transition-all ",
                    dot
                  )}
                />
              )
            )}
          </div>
        );
      })}
    </LastBetsContainer>
  );
};

export const RollController: React.FC<{
  multiplier: number;
  winChance: number;
}> = ({ multiplier, winChance }) => {
  return (
    <section className="wr-z-10 wr-grid wr-w-[240px] lg:wr-w-[280px] wr-grid-cols-2 wr-items-center wr-gap-2 wr-rounded-xl wr-border wr-border-zinc-800 wr-bg-zinc-950 wr-p-[14px]">
      <div>
        <FormLabel className="wr-leading-4 lg:wr-leading-6">
          Multiplier
        </FormLabel>
        <div className="wr-rounded-md wr-bg-zinc-800 wr-p-3 wr-font-semibold">
          {multiplier}x
        </div>
      </div>
      <div>
        <FormLabel className="wr-leading-4 lg:wr-leading-6">
          Win Chance
        </FormLabel>
        <div className="wr-rounded-md wr-bg-zinc-800 wr-p-3 wr-font-semibold">
          {winChance}%
        </div>
      </div>
    </section>
  );
};
