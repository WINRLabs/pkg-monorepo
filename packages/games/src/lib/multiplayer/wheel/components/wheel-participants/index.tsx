"use client";

import { AlignLeft } from "../../../../svgs";
import { Button } from "../../../../ui/button";
import { cn } from "../../../../utils/style";
import { useWheelGameStore } from "../../store";
import WheelParticipantDetail from "../wheel-participant-detail";

const WheelParticipants = () => {
  const { isParticipantsOpen, setIsParticipantsOpen } = useWheelGameStore([
    "isParticipantsOpen",
    "setIsParticipantsOpen",
  ]);

  return (
    <div className="wr-relative wr-h-[640px] wr-w-full  ">
      <Button
        variant="outline"
        type="button"
        className={cn(
          "wr-absolute  wr-left-0 wr-h-9  wr-w-9 wr-bg-[#ffffff15] wr-p-0 wr-transition-all wr-duration-200 max-md:wr-hidden",
          {
            "wr-bottom-[170px]": isParticipantsOpen,
            "wr-bottom-[45px]": !isParticipantsOpen,
          }
        )}
        onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
      >
        <AlignLeft
          className={cn("-wr-rotate-90 wr-transition-all wr-duration-300", {
            "wr-rotate-90": !isParticipantsOpen,
          })}
        />
      </Button>
      <div className="wr-absolute wr-bottom-0 wr-left-0 wr-flex  wr-w-full wr-gap-2 wr-overflow-scroll wr-scrollbar-none wr-z-20">
        <WheelParticipantDetail variant="gray" multiplier="2x" />
        <WheelParticipantDetail variant="blue" multiplier="3x" />
        <WheelParticipantDetail variant="green" multiplier="6x" />
        <WheelParticipantDetail variant="red" multiplier="48x" />
      </div>
    </div>
  );
};

export default WheelParticipants;
