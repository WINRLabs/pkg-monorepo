import React from "react";

import { LastBetsContainer } from "../../../common/last-bets-container";
import { cn } from "../../../utils/style";
import useLimboGameStore from "../store";

const LastBets = () => {
  const { lastBets } = useLimboGameStore(["lastBets"]);

  return (
    <LastBetsContainer className="wr-mx-auto lg:wr-pt-3.5 max-md:wr-static">
      {lastBets?.map((result, index) => {
        return (
          <div
            key={index}
            className={cn(
              "wr-flex wr-h-7 wr-w-[53px] wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700 wr-font-semibold wr-text-zinc-100",
              {
                "wr-bg-green-500": result.payout > 0,
              }
            )}
          >
            <div className="wr-text-zinc-100">
              {result.number < 1 ? 1 : result.number}
            </div>
          </div>
        );
      })}
    </LastBetsContainer>
  );
};

export default LastBets;
