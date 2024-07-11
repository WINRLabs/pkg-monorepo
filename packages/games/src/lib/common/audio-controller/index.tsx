"use client";

import * as Slider from "@radix-ui/react-slider";
import React from "react";

import { CDN_URL } from "../../constants";
import { useAudioContext } from "../../hooks/use-audio-effect";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { Button } from "../../ui/button";
import { cn } from "../../utils/style";

export const AudioController: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { volume, onVolumeChange } = useAudioContext();

  const [isSliderOpen, setIsSliderOpen] = React.useState(false);

  const ref = useOutsideClick(() => {
    setIsSliderOpen(false);
  });

  const handleVolumeChange = (val: number[]) => {
    localStorage["lastVolume"] = val[0];

    onVolumeChange(val[0] as number);
  };

  return (
    <div
      className={cn(
        "wr-relative wr-flex wr-cursor-pointer wr-items-center wr-justify-center wr-gap-2",
        className
      )}
      ref={ref}
      onMouseEnter={() => {
        setIsSliderOpen(true);
      }}
      onMouseLeave={() => {
        setIsSliderOpen(false);
      }}
    >
      <Button
        variant="secondary"
        type="button"
        className="wr-h-9 wr-w-9 wr-p-0"
        onClick={() => {
          volume > 0
            ? onVolumeChange(0)
            : onVolumeChange(localStorage["lastVolume"] || 50);
        }}
      >
        {!volume || volume === 0 ? (
          <img src={`${CDN_URL}/icons/icon-mute.svg`} />
        ) : (
          <img src={`${CDN_URL}/icons/icon-sound.svg`} />
        )}
      </Button>
      <div
        className={cn("wr-transition-all wr-duration-300", {
          "wr-opacity-0": !isSliderOpen,
          "wr-opacity-100": isSliderOpen,
        })}
      >
        <Slider.Root
          className="wr-relative wr-z-20 wr-flex wr-h-1 wr-w-12 wr-items-center wr-rounded-lg wr-bg-gray-300"
          value={[volume]}
          max={100}
          step={1}
          min={0}
          orientation="horizontal"
          onValueChange={handleVolumeChange}
        >
          <Slider.Track className="wr-relative wr-flex-grow wr-rounded-[9999px] wr-bg-zinc-700">
            <Slider.Range className="wr-absolute wr-h-full wr-rounded-full wr-bg-white" />
          </Slider.Track>
          <Slider.Thumb
            className="wr-absolute wr-left-[-6px] wr-top-1/2 wr-block wr-h-3 wr-w-3 -wr-translate-y-1/2 wr-rounded-md wr-bg-white"
            data-orientation="horizontal"
            aria-label="Volume"
          />
        </Slider.Root>
      </div>
    </div>
  );
};

export const UnityAudioController: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { volume, onVolumeChange } = useAudioContext();

  return (
    <div
      className={cn(
        "wr-relative wr-flex wr-cursor-pointer wr-items-center wr-justify-center wr-gap-2",
        className
      )}
    >
      <Button
        variant="secondary"
        type="button"
        className="wr-h-9 wr-w-9 wr-p-0"
        onClick={() => {
          volume > 0 ? onVolumeChange(0) : onVolumeChange(100);
        }}
      >
        {!volume || volume === 0 ? (
          <img src={`${CDN_URL}/icons/icon-mute.svg`} />
        ) : (
          <img src={`${CDN_URL}/icons/icon-sound.svg`} />
        )}
      </Button>
    </div>
  );
};
