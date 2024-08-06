import { LastBetsContainer } from "../../../common/last-bets-container";
import { cn } from "../../../utils/style";
import usePlinkoLastBetsStore from "../store";

export const Plinko3dLastBets = () => {
  const { lastBets } = usePlinkoLastBetsStore(["lastBets"]);

  return (
    <LastBetsContainer
      className="wr-absolute wr-right-5 wr-left-[unset] wr-top-5 wr-flex-col wr-max-w-[unset] "
      dir="vertical"
    >
      {lastBets?.map((result, index) => {
        return (
          <div
            key={index}
            className={cn(
              "wr-flex wr-h-7 wr-w-[53px] wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700 wr-font-semibold wr-text-zinc-100",
              {
                "wr-bg-green-500": Number(result.multiplier) > 1,
                "wr-bg-zinc-700": Number(result.multiplier) < 1,
              }
            )}
          >
            <div className="wr-text-zinc-100">X{result.multiplier}</div>
          </div>
        );
      })}
    </LastBetsContainer>
  );
};
