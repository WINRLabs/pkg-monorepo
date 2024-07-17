import { AlignLeft } from "../../../svgs";
import { Button } from "../../../ui/button";
import { cn } from "../../../utils/style";
import useHorseRaceGameStore from "../store";
import HorseDetail from "./horse-detail";

const SelectedHorseDetail = () => {
  const { isParticipantsOpen, setIsParticipantsOpen } = useHorseRaceGameStore([
    "isParticipantsOpen",
    "setIsParticipantsOpen",
  ]);

  return (
    <div className="wr-absolute wr-left-3 wr-top-0 wr-z-[15] wr-w-full md:wr-left-[unset] md:wr-right-3.5 md:wr-top-1 md:!wr-h-full  md:wr-max-w-full">
      <Button
        variant="secondary"
        type="button"
        className={cn(
          "wr-absolute wr-top-0 wr-h-9 wr-w-9 wr-bg-zinc-100/60 wr-p-0 wr-transition-all wr-duration-200 wr-hidden  md:!wr-grid wr-place-items-center",
          {
            "wr-right-[190px]": isParticipantsOpen,
            "wr-right-[45px]": !isParticipantsOpen,
          }
        )}
        onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
      >
        <AlignLeft
          className={cn("wr-rotate-180 wr-transition-all wr-duration-300", {
            "wr-rotate-0": !isParticipantsOpen,
          })}
        />
      </Button>
      <div className="wr-absolute wr-top-[285px] wr-flex wr-items-end wr-gap-2 max-md:wr-w-full max-md:wr-overflow-scroll max-md:wr-pr-5 max-md:wr-scrollbar-none md:wr-right-0 md:wr-top-0 md:wr-flex-col">
        <HorseDetail variant="gray" multiplier="2x" />
        <HorseDetail variant="yellow" multiplier="3x" />
        <HorseDetail variant="blue" multiplier="8x" />
        <HorseDetail variant="green" multiplier="15x" />
        <HorseDetail variant="red" multiplier="60x" />
      </div>
    </div>
  );
};

export default SelectedHorseDetail;
