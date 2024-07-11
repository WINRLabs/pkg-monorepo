import { LastBetsContainer } from "../../../common/last-bets-container";
import { cn } from "../../../utils/style";
import { Horse, horseMultipliers } from "../constants";

const LastBets = () => {
  //   const { data, refetch } = useGetHorseRaceGameHistoryQuery(
  //     getGraphQLClient(),
  //     {},
  //     {
  //       retry: false,
  //       refetchOnMount: false,
  //       refetchOnWindowFocus: false,
  //     }
  //   );

  //   React.useEffect(() => {
  //     isFinished && refetch();
  //   }, [isFinished]);

  const history = [Horse.FIVE, Horse.FOUR];

  return (
    <LastBetsContainer className="wr-absolute wr-left-1/2 wr-top-5 wr--translate-x-1/2">
      {history.map((horse, i) => (
        <div
          className={cn(
            "wr-flex wr-h-[28px] wr-items-center wr-justify-center wr-rounded-[200px] wr-px-2 wr-py-1.5 wr-font-semibold",
            {
              "wr-bg-white wr-bg-opacity-25":
                `${horseMultipliers[String(horse) as Horse]}x` === "2x",
              "wr-bg-yellow-600":
                `${horseMultipliers[String(horse) as Horse]}x` === "3x",
              "wr-bg-blue-600":
                `${horseMultipliers[String(horse) as Horse]}x` == "8x",
              "wr-bg-green-500":
                `${horseMultipliers[String(horse) as Horse]}x` === "15x",
              "wr-bg-red-600":
                `${horseMultipliers[String(horse) as Horse]}x` === "60x",
            }
          )}
          key={i}
        >
          {horseMultipliers[String(horse) as Horse]}x
        </div>
      ))}
    </LastBetsContainer>
  );
};

export default LastBets;
