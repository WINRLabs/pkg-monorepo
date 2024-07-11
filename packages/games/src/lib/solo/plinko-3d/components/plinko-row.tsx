import * as Slider from "@radix-ui/react-slider";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { NumberInput } from "../../../ui/number-input";
import { cn } from "../../../utils/style";
import usePlinko3dGameStore from "../store";
import { Plinko3dForm } from "../types";

const PlinkoRow = () => {
  const form = useFormContext() as Plinko3dForm;

  const { gameStatus } = usePlinko3dGameStore(["gameStatus"]);

  return (
    <FormField
      control={form.control}
      name="plinkoSize"
      disabled={
        form.formState.isSubmitting ||
        form.formState.isLoading ||
        gameStatus == "PLAYING"
      }
      render={({ field }) => (
        <FormItem className="wr-mt-3">
          <FormLabel className="wr-text-unity-white-50">Plinko Row</FormLabel>

          <FormControl>
            <NumberInput.Root
              minValue={6}
              maxValue={12}
              isDisabled={
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                gameStatus == "PLAYING"
              }
              {...field}
            >
              <NumberInput.Container
                className={cn(
                  "wr-relative wr-border wr-border-solid  wr-border-unity-white-15 wr-bg-unity-white-15 wr-px-2 wr-py-[10px] wr-backdrop-blur-md "
                )}
              >
                <NumberInput.Input className={cn()} />

                <Slider.Root
                  className={cn(
                    "wr-absolute wr-bottom-0 wr-left-0 -wr-mt-8 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center wr-px-1.5"
                  )}
                  min={6}
                  value={[form.getValues("plinkoSize")]}
                  max={12}
                  onValueChange={(e: any) => {
                    form.setValue("plinkoSize", e[0], {
                      shouldValidate: true,
                    });
                  }}
                  disabled={
                    form.formState.isSubmitting ||
                    form.formState.isLoading ||
                    gameStatus == "PLAYING"
                  }
                >
                  <Slider.Track className="wr-relative wr-h-1 wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full  wr-bg-zinc-600">
                    <Slider.Range className="wr-absolute wr-h-full wr-bg-sky-400" />
                  </Slider.Track>
                  <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex  wr-h-4 wr-w-4 wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-opacity-50" />
                </Slider.Root>
              </NumberInput.Container>
            </NumberInput.Root>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PlinkoRow;
