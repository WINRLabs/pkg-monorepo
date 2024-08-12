import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import React from "react";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { DICE, RollForm } from "../types";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";

interface Props {
  item: DICE;
  winner: number | undefined;
  isBetting: boolean;
  isDisabled?: boolean;
}

export const dotPosition = {
  0: [
    "wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform",
  ],
  1: ["wr-top-[16px] wr-left-[16px]", "wr-bottom-[16px] wr-right-[16px]"],
  2: [
    "wr-top-[16px] wr-left-[16px] ",
    "wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform",
    "wr-bottom-[16px] wr-right-[16px]",
  ],
  3: [
    "wr-top-[16px] wr-left-[16px]",
    "wr-top-[16px] wr-right-[16px]",
    "wr-bottom-[16px] wr-left-[16px]",
    "wr-bottom-[16px] wr-right-[16px]",
  ],
  4: [
    "wr-top-[16px] wr-left-[16px]",
    "wr-top-[16px] wr-right-[16px]",
    "wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform",
    "wr-bottom-[16px] wr-left-[16px]",
    "wr-bottom-[16px] wr-right-[16px]",
  ],
  5: [
    "wr-top-[16px] wr-left-[16px]",
    "wr-top-[16px] wr-right-[16px]",
    "wr-top-1/2 wr-left-[16px] -wr-translate-y-1/2 wr-transform",
    "wr-top-1/2 wr-right-[16px] -wr-translate-y-1/2 wr-transform",
    "wr-bottom-[16px] wr-left-[16px]",
    "wr-bottom-[16px] wr-right-[16px]",
  ],
};

export const miniDotPosition = {
  0: [
    "wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform",
  ],
  1: ["wr-top-[4px] wr-left-[4px]", "wr-bottom-[4px] wr-right-[4px]"],
  2: [
    "wr-top-[4px] wr-left-[4px]",
    "wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform",
    "wr-bottom-[4px] wr-right-[4px]",
  ],
  3: [
    "wr-top-[4px] wr-left-[4px] ",
    "wr-top-[4px] wr-right-[4px]",
    "wr-bottom-[4px] wr-left-[4px]",
    "wr-bottom-[4px] wr-right-[4px]",
  ],
  4: [
    "wr-top-[4px] wr-left-[4px] ",
    "wr-top-[4px] wr-right-[4px]",
    "wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-transform",
    "wr-bottom-[4px] wr-left-[4px]",
    "wr-bottom-[4px] wr-right-[4px]",
  ],
  5: [
    "wr-top-[4px] wr-left-[4px] ",
    "wr-top-[4px] wr-right-[4px]",
    "wr-top-1/2 wr-left-[4px] -wr-translate-y-1/2 wr-transform",
    "wr-top-1/2 wr-right-[4px] -wr-translate-y-1/2 wr-transform",
    "wr-bottom-[4px] wr-left-[4px]",
    "wr-bottom-[4px] wr-right-[4px]",
  ],
};

const Dice: React.FC<Props> = ({
  item,
  winner,
  isBetting = false,
  isDisabled = false,
}) => {
  const form = useFormContext() as RollForm;
  const clickEffect = useAudioEffect(SoundEffects.LIMBO_TICK);

  return (
    <FormField
      key={item}
      control={form.control}
      name="dices"
      render={({ field }) => {
        return (
          <FormItem
            key={item}
            className="wr-mb-0 wr-aspect-square wr-h-full wr-transform-gpu wr-transition-all wr-duration-300 wr-ease-in-out hover:wr-scale-[1.2]"
          >
            <FormControl>
              <CheckboxPrimitive.Root
                className={cn(
                  "focus-visible:wr-ring-ring data-[state=checked]:wr-bg-primary data-[state=checked]:wr-text-primary-foreground wr-peer wr-relative wr-mb-0 wr-h-full wr-w-full wr-shrink-0 wr-rounded-md md:wr-rounded-xl wr-bg-zinc-700 focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-cursor-not-allowed disabled:wr-opacity-50",
                  {
                    "wr-bg-white": field.value?.includes(item),
                    "wr-bg-green-500":
                      field.value?.includes(item) &&
                      item + 1 === winner &&
                      isBetting,
                    "wr-bg-red-600":
                      !field.value?.includes(item) &&
                      item + 1 === winner &&
                      isBetting,
                  }
                )}
                checked={field.value?.includes(item)}
                onCheckedChange={(checked) => {
                  clickEffect.play();
                  return checked
                    ? field.onChange([...field.value, item])
                    : field.onChange(
                        field.value?.filter((value: any) => value !== item)
                      );
                }}
                style={{
                  boxShadow:
                    "5.778px 5.778px 8.667px 0px rgba(255, 255, 255, 0.30) inset, -5.778px -5.778px 8.667px 0px rgba(0, 0, 0, 0.40) inset",
                }}
                disabled={isDisabled}
              >
                {dotPosition[item].map((dot, i) => (
                  <Dot
                    className={dot}
                    key={i}
                    selected={field.value?.includes(item)}
                  />
                ))}
              </CheckboxPrimitive.Root>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default Dice;

export const Dot = ({
  className,
  selected = false,
}: {
  className?: string;
  selected: boolean;
}) => {
  return (
    <div
      className={cn(
        "wr-absolute md:wr-size-6 wr-size-3 wr-shrink-0 wr-rounded-full wr-border-2 wr-border-[#EDEDF1] wr-bg-dice wr-transition-all sm:wr-h-[23px] sm:wr-w-[23px]",
        className,
        { "wr-border-[#41414C] wr-bg-dice-selected": selected }
      )}
    />
  );
};
