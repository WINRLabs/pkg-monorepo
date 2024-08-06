"use client";
import * as Slider from "@radix-ui/react-slider";
import * as React from "react";
import { useFormContext } from "react-hook-form";

import { Advanced } from "../../../common/advanced";
import { AudioController } from "../../../common/audio-controller";
import { BetControllerContainer } from "../../../common/containers";
import {
  BetControllerTitle,
  BetCountFormField,
  StopGainFormField,
  StopLossFormField,
  WagerFormField,
} from "../../../common/controller";
import { PreBetButton } from "../../../common/pre-bet-button";
import { SkipButton } from "../../../common/skip-button";
import { TotalWager, WagerCurrencyIcon } from "../../../common/wager";
import { Button } from "../../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { INumberInputContext, NumberInput } from "../../../ui/number-input";
import { cn } from "../../../utils/style";
import { toDecimals, toFormatted } from "../../../utils/web3";
import { rowMultipliers } from "../constants";
import usePlinkoGameStore from "../store";
import { PlinkoForm } from "../types";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import { useDebounce } from "use-debounce";

interface Props {
  minWager: number;
  maxWager: number;
}

export const BetController: React.FC<Props> = ({ minWager, maxWager }) => {
  const form = useFormContext() as PlinkoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const rowSize = form.watch("plinkoSize");
  const wager = form.watch("wager");
  const betCount = form.watch("betCount");

  const maxPayout = React.useMemo(() => {
    const maxMultiplier = isNaN(rowMultipliers?.[rowSize]?.[0] as number)
      ? 0
      : (rowMultipliers?.[rowSize]?.[0] as number);

    return toDecimals(wager * betCount * maxMultiplier, 2);
  }, [betCount, wager, rowSize]);

  const { plinkoGameResults, gameStatus } = usePlinkoGameStore([
    "plinkoGameResults",
    "gameStatus",
  ]);

  return (
    <BetControllerContainer>
      <div className="wr-max-lg:flex wr-max-lg:flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>Plinko</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING"
          }
        />
        <BetCountFormField
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING"
          }
        />
        <PlinkoRowFormField
          minValue={6}
          maxValue={12}
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING"
          }
        />
        <div className="wr-mb-6 wr-grid wr-grid-cols-2 wr-gap-2">
          <div>
            <FormLabel>Max Payout</FormLabel>
            <div
              className={cn(
                "wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] wr-overflow-hidden"
              )}
            >
              <WagerCurrencyIcon />
              <span className={cn("wr-font-semibold wr-text-zinc-100")}>
                ${toFormatted(maxPayout, 2)}
              </span>
            </div>
          </div>
          <div>
            <FormLabel>Total Wager</FormLabel>
            <TotalWager
              betCount={form.getValues().betCount}
              wager={form.getValues().wager}
            />
          </div>
        </div>

        <div>
          <Advanced>
            <div className="wr-grid wr-grid-cols-2 wr-gap-2">
              <StopGainFormField
                isDisabled={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING"
                }
              />
              <StopLossFormField
                isDisabled={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING"
                }
              />
            </div>
          </Advanced>
        </div>
        {!(plinkoGameResults.length > 3) && (
          <PreBetButton>
            <Button
              type="submit"
              variant={"success"}
              className="wr-w-full max-lg:-wr-order-1 max-lg:wr-mb-3.5"
              size={"xl"}
              onClick={() => clickEffect.play()}
              isLoading={
                form.formState.isSubmitting || form.formState.isLoading
              }
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                gameStatus == "PLAYING"
              }
            >
              Bet
            </Button>
          </PreBetButton>
        )}
        {plinkoGameResults.length > 3 && gameStatus == "PLAYING" && (
          <SkipButton />
        )}
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};

const PlinkoRowFormField: React.FC<{
  isDisabled?: boolean;
  minValue?: number;
  maxValue?: number;
}> = ({ isDisabled, minValue, maxValue }) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="plinkoSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plinko Row</FormLabel>

            <FormControl>
              <div>
                <PlinkoRowInput
                  isDisabled={isDisabled}
                  minValue={minValue}
                  maxValue={maxValue}
                  {...field}
                />
                <PlinkoRowSlider
                  disabled={isDisabled}
                  minValue={minValue}
                  maxValue={maxValue}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

interface PlinkoRowInputProps extends INumberInputContext {
  className?: string;
  hasError?: boolean;
  containerClassName?: string;
}

const PlinkoRowInput = ({
  className,
  hasError,
  containerClassName,
  ...rest
}: PlinkoRowInputProps) => {
  return (
    <NumberInput.Root {...rest}>
      <NumberInput.Container
        className={cn(
          "wr-rounded-b-[6px] wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px]",
          {
            ["wr-border wr-border-solid wr-border-red-600"]: !!hasError,
          },
          containerClassName
        )}
      >
        <NumberInput.Input
          className={cn(
            "wr-rounded-none wr-border-none wr-bg-transparent wr-px-0 wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0",
            className
          )}
        />
      </NumberInput.Container>
    </NumberInput.Root>
  );
};

const PlinkoRowSlider = ({ ...props }) => {
  const form = useFormContext();
  const sliderEffect = useAudioEffect(SoundEffects.SLIDER_TICK_1X);

  const plinkoSize = form.watch("plinkoSize");
  const debouncedPlinkoSize = useDebounce(plinkoSize, 100);

  React.useEffect(() => {
    sliderEffect.play();
  }, [debouncedPlinkoSize[0]]);

  return (
    <Slider.Root
      className={cn(
        "wr-relative -wr-mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center",
        {
          "wr-cursor-none wr-pointer-events-none wr-opacity-60": props.disabled,
        }
      )}
      min={props.minValue || 1}
      value={[props.value]}
      max={props.maxValue}
      onValueChange={(e) => {
        form.setValue("plinkoSize", e[0], { shouldValidate: true });
      }}
    >
      <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
        <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
      </Slider.Track>
      <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 wr-disabled:pointer-events-none wr-disabled:opacity-50" />
    </Slider.Root>
  );
};
