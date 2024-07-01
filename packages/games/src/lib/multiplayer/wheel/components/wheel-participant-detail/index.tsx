import { Multiplier } from "../../constants";
import { cn } from "../../../../utils/style";
import { Avatar, Wheel } from "../../../../svgs";
import { Separator } from "../../../../ui/separator";
import { useWheelGameStore } from "../../store";

const color = {
  gray: " wr-bg-[#ffffff15] ",
  yellow: "wr-bg-[#FACC1525]",
  blue: "wr-bg-[#3B82F625]",
  green: "wr-bg-[#84CC1625]",
  red: "wr-bg-[#DC262625]",
};

const iconColor = {
  gray: "wr-text-white ",
  yellow: "wr-text-yellow-500",
  blue: "wr-text-blue-500",
  green: "wr-text-green-500",
  red: "wr-text-red-600",
};

interface WheelParticipantDetailProps {
  variant: "gray" | "yellow" | "blue" | "green" | "red";
  multiplier: Multiplier;
}

const WheelParticipantDetail: React.FC<WheelParticipantDetailProps> = ({
  variant,
  multiplier,
}) => {
  const { isParticipantsOpen, wheelParticipants } = useWheelGameStore([
    "isParticipantsOpen",
    "wheelParticipants",
  ]);

  const getWheelParticipantDetail = (multiplier: Multiplier, index: number) => {
    if (Array.isArray(wheelParticipants[multiplier])) {
      if (wheelParticipants[multiplier].length + 1 <= index) {
        return null;
      } else {
        return wheelParticipants[multiplier][
          wheelParticipants[multiplier].length - index
        ];
      }
    } else {
      return null;
    }
  };

  return (
    <div className="wr-flex wr-flex-col">
      <div
        className={cn(
          "wr-mb-[5px] wr-flex wr-h-[118px] wr-w-[184px] wr-flex-col wr-justify-between wr-gap-[1.5px] wr-overflow-hidden wr-transition-all wr-duration-300 max-md:wr-hidden",
          {
            "wr-h-0": !isParticipantsOpen,
          }
        )}
      >
        <div
          className={cn(
            "wr-flex wr-h-[28px] wr-w-[184px] wr-items-center wr-justify-between wr-rounded wr-rounded-tl-md wr-rounded-tr-md  wr-px-2.5 wr-text-[13px] wr-font-semibold ",
            color[variant]
          )}
        >
          <div
            className="wr-w-[54px] wr-truncate"
            title={getWheelParticipantDetail(multiplier, 1)?.name}
          >
            {getWheelParticipantDetail(multiplier, 1)?.name}
          </div>
          <div className="wr-flex">
            {getWheelParticipantDetail(multiplier, 1)?.bet ? (
              <>
                {getWheelParticipantDetail(multiplier, 1)?.bet}
                USDC
              </>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "wr-flex h-[28px]  wr-w-[184px] wr-items-center wr-justify-between wr-rounded   wr-px-2.5 wr-text-[13px] wr-font-semibold ",
            color[variant]
          )}
        >
          <div
            className="wr-w-[54px] wr-truncate"
            title={getWheelParticipantDetail(multiplier, 2)?.name}
          >
            {getWheelParticipantDetail(multiplier, 2)?.name}
          </div>
          <div className="wr-flex">
            {getWheelParticipantDetail(multiplier, 2)?.bet ? (
              <>{getWheelParticipantDetail(multiplier, 2)?.bet} USDC</>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "wr-flex wr-h-[28px]  wr-w-[184px] wr-items-center wr-justify-between wr-rounded   wr-px-2.5 wr-text-[13px] wr-font-semibold ",
            color[variant]
          )}
        >
          <div
            className="wr-w-[54px] wr-truncate"
            title={getWheelParticipantDetail(multiplier, 3)?.name}
          >
            {getWheelParticipantDetail(multiplier, 3)?.name}
          </div>
          <div className="wr-flex">
            {getWheelParticipantDetail(multiplier, 3)?.bet ? (
              <>{getWheelParticipantDetail(multiplier, 3)?.bet} USDC</>
            ) : null}
          </div>
        </div>
        <div
          className={cn(
            "wr-flex wr-h-[28px]  wr-w-[184px] wr-items-center wr-justify-between wr-rounded  wr-px-2.5 wr-text-[13px] wr-font-semibold ",
            color[variant]
          )}
        >
          <div
            className="wr-w-[54px] wr-truncate"
            title={getWheelParticipantDetail(multiplier, 4)?.name}
          >
            {getWheelParticipantDetail(multiplier, 4)?.name}
          </div>
          <div className="wr-flex">
            {getWheelParticipantDetail(multiplier, 4)?.bet ? (
              <>{getWheelParticipantDetail(multiplier, 4)?.bet} USDC</>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "wr-flex wr-h-[40px] wr-w-[184px] wr-flex-row wr-items-center wr-justify-center wr-gap-1 wr-rounded-md wr-p-2  wr-text-[14px] wr-font-semibold ",
          color[variant]
        )}
      >
        <Wheel className={(cn("wr-h-5 wr-w-5"), iconColor[variant])} />
        <div>{multiplier}</div>
        <Separator className="wr-mx-2 " orientation="vertical" />
        <Avatar />
        <div>{wheelParticipants[multiplier].length}</div>
      </div>
    </div>
  );
};

export default WheelParticipantDetail;
