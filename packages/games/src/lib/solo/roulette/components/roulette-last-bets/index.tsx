import React from "react";

import { cn } from "../../../../utils/style";
import { redNumbers } from "../../constants";
import useRouletteGameStore from "../../store";

export const RouletteLastBets: React.FC = () => {
  const { lastBets } = useRouletteGameStore(["lastBets"]);

  return (
    <div className="wr-absolute wr-left-0 wr-top-1/2 wr-mx-4 wr-flex wr-max-h-[265px] -wr-translate-y-1/2 wr-flex-col wr-items-center wr-justify-end wr-gap-2 wr-overflow-hidden wr-transition-all wr-duration-300 max-lg:wr-left-1/2 max-lg:wr-top-6 max-lg:wr-max-h-[45px] max-lg:wr-w-[185px] max-lg:-wr-translate-x-1/2 max-lg:wr-flex-row">
      {lastBets.map((result, idx) => (
        <div
          key={idx}
          className={cn(
            "wr-flex wr-h-[46px] wr-w-[46px] wr-flex-shrink-0 wr-flex-grow-0 wr-items-center wr-justify-center wr-rounded-full wr-font-bold wr-transition-all wr-duration-300 max-lg:wr-h-[40px] max-lg:wr-w-[40px]",
            {
              "wr-bg-red-600": redNumbers.includes(result.outcome),
              "wr-bg-zinc-800": !redNumbers.includes(result.outcome),
            }
          )}
        >
          {result.outcome}
        </div>
      ))}
    </div>
  );
};
