"use client";

import * as Slider from "@radix-ui/react-slider";
import React from "react";
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
import { NumberInput } from "../../../ui/number-input";
import { cn } from "../../../utils/style";
import { toDecimals } from "../../../utils/web3";
import useLimboGameStore from "../store";
import { LimboForm } from "../types";

interface Props {
  minWager: number;
  maxWager: number;
  winMultiplier: number;
}

export const BetController: React.FC<Props> = ({
  minWager,
  maxWager,
  winMultiplier,
}) => {
  const form = useFormContext() as LimboForm;

  const { limboGameResults, gameStatus } = useLimboGameStore([
    "limboGameResults",
    "gameStatus",
  ]);

  const isFormInProgress =
    form.formState.isSubmitting ||
    form.formState.isLoading ||
    gameStatus == "PLAYING";

  const maxPayout = React.useMemo(() => {
    const { wager, betCount } = form.getValues();

    return toDecimals(wager * betCount * winMultiplier, 2);
  }, [form.getValues().wager, form.getValues().betCount, winMultiplier]);

  return (
    <BetControllerContainer>
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>Limbo</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={isFormInProgress}
        />
        <BetCountFormField isDisabled={isFormInProgress} />
        <>
          <FormField
            control={form.control}
            name="limboMultiplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multiplier (1.1-{100}) </FormLabel>

                <FormControl>
                  <div>
                    <NumberInput.Root {...field} isDisabled={isFormInProgress}>
                      <NumberInput.Container
                        className={cn(
                          " wr-rounded-b-[6px] wr-border-none wr-bg-zinc-950 wr-px-2  wr-py-[10px]"
                        )}
                      >
                        <NumberInput.Input
                          className={cn(
                            "wr-rounded-none wr-border-none  wr-bg-transparent wr-px-0 wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0"
                          )}
                        />
                      </NumberInput.Container>
                    </NumberInput.Root>
                    <Slider.Root
                      className={cn(
                        "wr-relative -wr-mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center"
                      )}
                      min={1.1}
                      value={[field.value]}
                      max={100}
                      step={1}
                      disabled={isFormInProgress}
                      onValueChange={(e: any) => {
                        form.setValue("limboMultiplier", e[0], {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
                        <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
                      </Slider.Track>
                      <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex  wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-opacity-50" />
                    </Slider.Root>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
        <div className="wr-mb-6 wr-grid wr-grid-cols-2 wr-gap-2">
          <div>
            <FormLabel>Max Payout</FormLabel>
            <div
              className={cn(
                "wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]"
              )}
            >
              <WagerCurrencyIcon />
              <span className={cn("wr-font-semibold wr-text-zinc-100")}>
                ${maxPayout}
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
              <StopGainFormField isDisabled={isFormInProgress} />
              <StopLossFormField isDisabled={isFormInProgress} />
            </div>
          </Advanced>
        </div>

        {!(limboGameResults.length > 3) && (
          <PreBetButton>
            <Button
              type="submit"
              variant={"success"}
              className="wr-w-full max-lg:-wr-order-1 max-lg:wr-mb-3.5"
              size={"xl"}
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
        {limboGameResults.length > 3 && gameStatus == "PLAYING" && (
          <SkipButton />
        )}
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
