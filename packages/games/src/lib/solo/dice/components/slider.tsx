import * as SliderPrimitive from "@radix-ui/react-slider";
import { useFormContext } from "react-hook-form";

import { cn } from "../../../../lib/utils/style";
import { FormControl, FormField, FormItem } from "../../../ui/form";
import { toDecimals } from "../../../utils/web3";
import { useDiceGameStore } from "..";
import { MAX_VALUE, MIN_VALUE } from "../constant";
import { DiceForm } from "../types";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import { useDebounce } from "use-debounce";
import React from "react";

export interface SliderTrackOptions {
  color?: string;
  activeColor?: string;
}

export interface SliderProps {
  isLoading?: boolean;
  disabled?: boolean;
  track?: SliderTrackOptions;
}

export const Slider = ({ isLoading, disabled, track }: SliderProps) => {
  const form = useFormContext() as DiceForm;
  const sliderEffect = useAudioEffect(SoundEffects.SLIDER_TICK_1X);

  const { gameStatus } = useDiceGameStore(["gameStatus"]);

  const rollValue = form.watch("rollValue");

  const rollType = form.watch("rollType");

  const debouncedRollValue = useDebounce(rollValue, 150);

  React.useEffect(() => {
    sliderEffect.play();
  }, [debouncedRollValue[0]]);

  return (
    <div className="wr-w-full wr-shrink-0">
      <FormField
        control={form.control}
        name="rollValue"
        render={({ field }) => (
          <FormItem className="wr-mb-0">
            <FormControl>
              <SliderPrimitive.Root
                className={cn(
                  "wr-relative wr-flex wr-h-6 wr-cursor-pointer wr-touch-none wr-select-none wr-items-center",
                  {
                    "wr-pointer-events-none wr-cursor-not-allowed":
                      form.formState.isSubmitting ||
                      form.formState.isLoading ||
                      isLoading ||
                      gameStatus == "PLAYING",
                  }
                )}
                defaultValue={[rollValue]}
                min={MIN_VALUE}
                max={MAX_VALUE}
                onValueChange={(e) => {
                  field.onChange(e[0]);
                  sliderEffect.play();

                  const { rollType } = form.getValues();

                  const newValue = rollType === "UNDER" ? e[0] : 100 - e[0]!;

                  form.setValue("winChance", newValue!, {
                    shouldValidate: true,
                  });
                }}
                step={0.01}
                value={rollValue <= MAX_VALUE ? [rollValue] : [MAX_VALUE]}
                disabled={disabled}
              >
                <SliderPrimitive.Track
                  className={cn(
                    "wr-relative wr-h-6 wr-grow wr-rounded-sm wr-transition-all wr-duration-300 wr-ease-linear"
                  )}
                  style={{
                    background:
                      rollType === "OVER" ? track?.activeColor : track?.color,
                  }}
                >
                  <SliderPrimitive.Range
                    className={cn(
                      "wr-absolute wr-h-full wr-rounded-sm wr-transition-all wr-duration-300 wr-ease-linear"
                    )}
                    style={{
                      background:
                        rollType === "OVER" ? track?.color : track?.activeColor,
                    }}
                  />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                  className="wr-relative wr-grid wr-size-12 wr-place-items-center wr-rounded-[10px] wr-bg-gradient-to-b wr-from-white wr-to-[#C5C5CC] wr-shadow-[0_1px_5px] focus:wr-shadow-[0_2px_10px] focus:wr-outline-none focus:wr-ring-0"
                  aria-label="Volume"
                >
                  <div className="wr-absolute -wr-top-[50px] wr-text-4xl wr-font-bold">
                    {toDecimals(
                      rollValue <= MAX_VALUE ? rollValue : MIN_VALUE,
                      2
                    )}
                  </div>
                  <div className="wr-flex wr-gap-[6px]">
                    <div className="wr-h-[34px] wr-w-[6px] wr-rounded-[2px] wr-bg-zinc-400" />
                    <div className="wr-h-[34px] wr-w-[6px] wr-rounded-[2px] wr-bg-zinc-400" />
                    <div className="wr-h-[34px] wr-w-[6px] wr-rounded-[2px] wr-bg-zinc-400" />
                  </div>
                </SliderPrimitive.Thumb>
              </SliderPrimitive.Root>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="wr-mt-[22px] wr-flex wr-justify-between wr-text-[15px] wr-font-bold">
        {[0, 25, 50, 75, 100].map((value) => (
          <span
            key={value}
            className="block wr-size-10 wr-text-center first:wr-text-left last:wr-text-right"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
