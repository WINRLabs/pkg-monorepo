import { LastBetsContainer } from "../../../common/last-bets-container";
import { cn } from "../../../utils/style";
import useCrashGameStore from "../store";

const LastBets = () => {
  const { lastBets: history } = useCrashGameStore(["lastBets"]);

  return (
    <LastBetsContainer className="wr-absolute wr-left-1/2 wr-top-5 wr--translate-x-1/2">
      {history.map((multiplier, i) => (
        <div
          className={cn(
            "wr-flex wr-h-[28px] wr-w-12 wr-flex-grow wr-items-center wr-justify-center wr-rounded-md wr-text-xs wr-font-semibold wr-leading-3",
            {
              "wr-bg-white wr-bg-opacity-25": multiplier < 1,
              "wr-bg-[#1BC3543D] text-[#30DB60]": multiplier >= 1,
              "wr-bg-[#C3B31B3D]/25 wr-text-[#E5D321]": multiplier >= 2,
              "wr-bg-[#B13A3A3D]/25 wr-text-[#F94747]": multiplier >= 10,
            }
          )}
          key={i}
        >
          X{multiplier}
        </div>
      ))}
    </LastBetsContainer>
  );
};

export default LastBets;
