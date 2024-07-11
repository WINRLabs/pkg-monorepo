import { useFormContext } from "react-hook-form";

import { cn } from "../../../../lib/utils/style";
import { IconChevronUp } from "../../../svgs";
import { Button } from "../../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { NumberInput } from "../../../ui/number-input";
import { useDiceGameStore } from "..";
import { DiceForm } from "../types";

export interface RangeControllerProps {
  winMultiplier: number;
  disabled?: boolean;
}

export const Controller: React.FC<RangeControllerProps> = ({
  winMultiplier,
  disabled,
}) => {
  const form = useFormContext() as DiceForm;

  const { gameStatus } = useDiceGameStore(["gameStatus"]);

  return (
    <div className="wr-relative wr-flex wr-w-full wr-shrink-0 wr-items-end wr-justify-center wr-gap-2 wr-">
      <FormField
        control={form.control}
        name="rollValue"
        render={({ field }) => (
          <FormItem className="!wr-mb-0 wr-max-w-[148px]">
            <FormControl>
              <NumberInput.Root
                {...field}
                isDisabled={
                  disabled ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING"
                }
                onChange={(val) => {
                  field.onChange(val);

                  const { rollType } = form.getValues();

                  const newValue = rollType === "UNDER" ? val : 100 - val;

                  form.setValue("winChance", newValue, {
                    shouldValidate: true,
                  });
                }}
              >
                <FormLabel className="wr-justify-center wr-text-zinc-400">
                  Roll {form.getValues().rollType === "OVER" ? "Over" : "Under"}
                </FormLabel>
                <NumberInput.Container
                  className={cn(
                    "wr-rounded-md wr-border wr-border-zinc-600 wr-bg-zinc-950 wr-py-[10px]"
                  )}
                >
                  <NumberInput.Input
                    decimalScale={2}
                    className={cn(
                      "wr-border-none wr-bg-transparent wr-px-2 wr-py-2 wr-text-center wr-font-semibold wr-leading-5 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0"
                    )}
                  />
                </NumberInput.Container>
              </NumberInput.Root>
            </FormControl>
            <FormMessage className="wr-absolute wr-left-2 wr-top-20" />
          </FormItem>
        )}
      />
      <Button
        variant={"success"}
        size={"sm"}
        type="button"
        className="wr-mb-1 wr-h-10 wr-w-10 wr-shrink-0 wr-bg-green-500 wr-p-0 hover:wr-bg-green-600"
        onClick={() => {
          const { rollType, winChance } = form.getValues();

          const newRollType = rollType === "OVER" ? "UNDER" : "OVER";

          form.setValue("rollType", newRollType, {
            shouldValidate: true,
          });

          form.setValue("winChance", 100 - winChance, {
            shouldValidate: true,
          });
        }}
        disabled={
          disabled ||
          form.formState.isSubmitting ||
          form.formState.isLoading ||
          gameStatus == "PLAYING"
        }
      >
        <IconChevronUp
          className={cn(
            "wr-h-5 wr-w-5 wr-text-zinc-100 wr-transition-all wr-duration-300",
            {
              ["wr-rotate-180 wr-transform"]:
                form.getValues().rollType === "UNDER",
            }
          )}
        />
      </Button>
      <FormField
        control={form.control}
        name="winChance"
        render={({ field }) => (
          <FormItem className="!wr-mb-0 wr-max-w-[148px]">
            <FormControl>
              <NumberInput.Root
                {...field}
                isDisabled={
                  disabled ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING"
                }
                onChange={(val) => {
                  field.onChange(val);

                  const { rollType } = form.getValues();

                  const newValue = rollType === "UNDER" ? val : 100 - val;

                  form.setValue("rollValue", newValue, {
                    shouldValidate: true,
                  });
                }}
              >
                <FormLabel className="wr-justify-center wr-text-center wr-text-zinc-400">
                  Win Chance
                </FormLabel>
                <NumberInput.Container
                  className={cn(
                    " wr-rounded-md wr-border wr-border-zinc-600 wr-bg-zinc-950 wr-py-[10px] wr-text-center"
                  )}
                >
                  <NumberInput.Input
                    decimalScale={2}
                    className={cn(
                      "wr-border-none wr-bg-transparent wr-px-2 wr-py-2 wr-text-center wr-font-semibold wr-leading-5 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0"
                    )}
                  />
                  <div className="wr-absolute wr-right-2 wr-flex wr-h-5 wr-w-5 wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-full wr-bg-zinc-600">
                    <span className="wr-text-xs">%</span>
                  </div>
                </NumberInput.Container>
              </NumberInput.Root>
            </FormControl>
            <FormMessage className="wr-absolute wr-left-2 wr-top-20" />
          </FormItem>
        )}
      />
      <div className="wr-w-[140px]">
        <FormLabel className="wr-justify-center wr-text-zinc-400">
          Multiplier
        </FormLabel>
        <div className="wr-mb-1 wr-flex wr-h-10 wr-w-full wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-lg wr-bg-zinc-600 wr-px-2 wr-py-[10px] wr-text-center wr-font-bold">
          x{winMultiplier}
        </div>
      </div>
    </div>
  );
};
