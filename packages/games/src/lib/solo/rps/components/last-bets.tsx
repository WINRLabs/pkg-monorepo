import React from "react";
import { LastBetsContainer } from "../../../common/last-bets-container";
import {
  RpsArrowRightSm,
  RpsPaperSm,
  RpsRockSm,
  RpsScissorsSm,
} from "../../../svgs";
import { cn } from "../../../utils/style";
import { RPSForm, RockPaperScissors } from "../types";
import useRpsGameStore from "../store";
import { useFormContext } from "react-hook-form";

const MiniRPSIcon = ({ rps }: { rps: string }) => {
  switch (rps) {
    case RockPaperScissors.PAPER:
      return <RpsPaperSm />;

    case RockPaperScissors.SCISSORS:
      return <RpsScissorsSm />;

    case RockPaperScissors.ROCK:
      return <RpsRockSm />;

    default:
      break;
  }
};

const LastBets = () => {
  const { lastBets } = useRpsGameStore(["lastBets"]);
  const form = useFormContext() as RPSForm;

  const rpsChoice = form.watch("rpsChoice");

  return (
    <LastBetsContainer className="wr-absolute wr-top-3 wr-z-10 wr-max-w-[430px] max-md:wr-max-w-[340px]">
      {lastBets?.map((result, index) => {
        return (
          <div
            key={index}
            className={cn(
              "wr-flex wr-h-8 wr-w-[80px] wr-flex-shrink-0 wr-items-center  wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700  wr-font-semibold wr-text-zinc-100",
              {
                "wr-bg-green-500": result.payout > 0,
                "wr-bg-yellow-500":
                  result.rps.toString() === rpsChoice.toString(),
              }
            )}
          >
            <div className="wr-flex wr-items-center">
              <MiniRPSIcon rps={result.rps.toString()} />
              <RpsArrowRightSm />
              <MiniRPSIcon rps={rpsChoice} />
            </div>
          </div>
        );
      })}
    </LastBetsContainer>
  );
};

export default LastBets;
