import React from "react";

import { cn } from "../../utils/style";
import { chips } from "./constants";
import { ChipControllerFixedProps, ChipFixedProps } from "./types";
import { SoundEffects, useAudioEffect } from "../../hooks/use-audio-effect";

export const ChipControllerFixed: React.FC<ChipControllerFixedProps> = ({
  selectedChip,
  onSelectedChipChange,
  isDisabled,
  className,
}) => {
  const clickEffect = useAudioEffect(SoundEffects.CHIP_EFFECT);
  return (
    <div
      className={cn(
        "wr-flex wr-items-end wr-justify-center wr-gap-2",
        className && className
      )}
    >
      {chips.map((i, idx) => (
        <Chip
          icon={i.src}
          value={i.value}
          selectedChip={selectedChip}
          onSelectedChipChange={(e) => {
            clickEffect.play();
            onSelectedChipChange(e);
          }}
          isDisabled={isDisabled}
          key={idx}
        />
      ))}
    </div>
  );
};

const Chip: React.FC<ChipFixedProps> = ({
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
        "wr-relative wr-cursor-pointer wr-select-none wr-rounded-md wr-bg-unity-white-15 wr-p-2 wr-transition-all wr-duration-300 hover:wr-bg-unity-white-50 max-lg:wr-p-1",
        {
          "wr-pointer-events-none wr-cursor-default wr-opacity-70 wr-grayscale-[0.3]":
            isDisabled,
          "wr-bg-unity-white-50": selectedChip === value,
        }
      )}
    >
      <img
        src={icon}
        width={40}
        height={40}
        className="max-lg:wr-max-h-[40px] max-lg:wr-max-w-[40px]"
        alt="JustBet Decentralized Casino Chip"
      />
      <span className="wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 wr-translate-y-[-55%] wr-text-base wr-font-bold">
        {value <= 100 && value}
        {value == 1000 && "1K"}
        {value == 10000 && "10K"}
      </span>
    </div>
  );
};
