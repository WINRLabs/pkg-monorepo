import React from "react";

import { cn } from "../../../../utils/style";
import { redNumbers } from "../../constants";
import useRouletteGameStore from "../../store";

export const RouletteLastBets: React.FC = () => {
  const { lastBets } = useRouletteGameStore(["lastBets"]);

  return (
    <div className="wr-absolute max-md:wr-flex-row wr-left-[55px] wr-top-1/2 wr-mx-2 wr-flex wr-max-h-[235px] -wr-translate-y-[105%] md:wr-flex-col wr-items-center wr-justify-end wr-gap-2 wr-overflow-hidden wr-transition-all wr-duration-300 max-md:wr-left-1/2 max-md:wr-top-12 max-md:wr-max-h-[45px] max-md:wr-w-[285px] max-md:-wr-translate-x-1/2">
      {lastBets.map((result, idx) => (
        <div
          key={idx}
          className={cn(
            "wr-flex wr-h-[40px] wr-w-[40px] wr-flex-shrink-0 wr-flex-grow-0 wr-items-center wr-justify-center wr-rounded-full wr-font-bold wr-transition-all wr-duration-300",
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
