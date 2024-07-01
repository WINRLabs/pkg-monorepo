import { LastBetsContainer } from "../../../../common/last-bets-container";
import { cn } from "../../../../utils/style";
import { colorMultipliers, WheelColor } from "../../constants";

const LastBets = () => {
  // const { data, refetch } = useGetWheelGameHistoryQuery(
  //   getGraphQLClient(),
  //   {},
  //   {
  //     retry: false,
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  // React.useEffect(() => {
  //   isFinished && refetch();
  // }, [isFinished]);

  // const history = data?.getWheelGameHistory.length
  //   ? data.getWheelGameHistory
  //   : [];

  const history = [
    {
      color: WheelColor.BLUE,
      multiplier: 3,
    },
    {
      color: WheelColor.GREEN,
      multiplier: 6,
    },
    {
      color: WheelColor.RED,
      multiplier: 48,
    },
    {
      color: WheelColor.GREY,
      multiplier: 2,
    },
  ];

  return (
    <LastBetsContainer className="absolute top-4 h-[28px]">
      {history.map((h, i) => (
        <div
          className={cn(
            "wr-flex wr-h-[28px] wr-items-center wr-justify-center wr-rounded-[200px] wr-px-2 wr-py-1.5 wr-font-semibold",
            {
              "wr-bg-white wr-bg-opacity-25":
                `${colorMultipliers[String(h.color) as WheelColor]}x` === "2x",
              "wr-bg-blue-600":
                `${colorMultipliers[String(h.color) as WheelColor]}x` === "3x",
              "wr-bg-green-500":
                `${colorMultipliers[String(h.color) as WheelColor]}x` === "6x",
              "wr-bg-red-600":
                `${colorMultipliers[String(h.color) as WheelColor]}x` === "48x",
            }
          )}
          key={i}
        >
          {colorMultipliers[String(h.color) as WheelColor]}x
        </div>
      ))}
    </LastBetsContainer>
  );
};

export default LastBets;
