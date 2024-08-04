import React from "react";

import { cn } from "../../utils/style";
import { chips } from "./constants";
import { ChipControllerProps, ChipProps } from "./types";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";

export const ChipController: React.FC<ChipControllerProps> = ({
  selectedChip,
  onSelectedChipChange,
  isDisabled,
  className,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollHorizontal = (scrollAmount: number) => {
    if (scrollRef.current) {
      console.log("scrolled");
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div
      className={cn(
        "wr-relative wr-flex wr-items-end wr-justify-center wr-gap-2 wr-w-full wr-rounded-md wr-py-1 wr-pl-12 wr-pr-12 wr-bg-zinc-700",
        className && className
      )}
    >
      <Button
        onClick={() => scrollHorizontal(-100)}
        className="wr-absolute wr-left-0 wr-top-0 wr-h-full wr-w-12 wr-bg-zinc-700 hover:wr-bg-zinc-700"
      >
        L
      </Button>

      <ScrollArea ref={scrollRef} className="wr-flex wr-w-full wr-items-center">
        <div className="wr-flex">
          {chips.map((i, idx) => (
            <Chip
              icon={i.src}
              value={i.value}
              selectedChip={selectedChip}
              onSelectedChipChange={onSelectedChipChange}
              isDisabled={isDisabled}
              key={idx}
            />
          ))}
        </div>
      </ScrollArea>

      <Button
        onClick={() => scrollHorizontal(100)}
        className="wr-absolute wr-right-0 wr-top-0 wr-h-full wr-w-12 wr-bg-zinc-700 hover:wr-bg-zinc-700"
      >
        R
      </Button>
    </div>
  );
};

const Chip: React.FC<ChipProps> = ({
  selectedChip,
  onSelectedChipChange,
  icon,
  value,
  isDisabled,
}) => {
  return (
    <div
      onClick={() => !isDisabled && onSelectedChipChange(value)}
      className={cn(
        "wr-flex wr-relative wr-cursor-pointer wr-select-none wr-rounded-md wr-p-1.5 wr-transition-all wr-duration-300 hover:wr-bg-unity-white-50 max-lg:wr-p-1 wr-w-max",
        {
          "wr-pointer-events-none wr-cursor-default wr-opacity-70 wr-grayscale-[0.3]":
            isDisabled,
          "wr-bg-unity-white-50": selectedChip === value,
        }
      )}
    >
      <img
        src={icon}
        width={35}
        height={35}
        className="max-lg:wr-max-h-[35px] max-lg:wr-max-w-[35px]"
        alt="JustBet Decentralized Casino Chip"
      />
      <span className="wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 wr-translate-y-[-55%] wr-text-base wr-font-bold">
        {value}
      </span>
    </div>
  );
};
