"use client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
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
import { FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { toDecimals } from "../../../utils/web3";
import { ALL_RPS_CHOICES, rpsChoiceMap } from "../constant";
import useRpsGameStore from "../store";
import { RockPaperScissors,RPSForm } from "../types";

interface BetControllerProps {
  minWager: number;
  maxWager: number;
  winMultiplier: number;
}

export const RPSChoiceRadio: React.FC<{
  choice: RockPaperScissors;
  disabled: boolean;
}> = ({ choice, disabled = false }) => {
  return (
    <RadioGroupPrimitive.Item
      disabled={disabled}
      value={choice}
      className="wr-flex wr-h-9 wr-w-full wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-md wr-bg-zinc-800 wr-text-center data-[state=checked]:wr-bg-red-600 hover:wr-bg-red-600"
    >
      <FormLabel className="wr-mb-0 wr-cursor-pointer  wr-justify-center wr-text-base wr-font-semibold wr-leading-4 wr-text-white">
        <img
          alt="icon_item"
          src={rpsChoiceMap[choice].icon}
          width={20}
          height={20}
        />
        {rpsChoiceMap[choice].label}
      </FormLabel>
    </RadioGroupPrimitive.Item>
  );
};

export const BetController: React.FC<BetControllerProps> = ({
  minWager,
  maxWager,
  winMultiplier,
}) => {
  const form = useFormContext() as RPSForm;

  const { rpsGameResults, gameStatus } = useRpsGameStore([
    "rpsGameResults",
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
          <BetControllerTitle>Rock Paper Scissors</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={isFormInProgress}
        />
        <FormField
          control={form.control}
          name="rpsChoice"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroupPrimitive.Root
                  {...field}
                  onValueChange={field.onChange}
                  className="wr-grid wr-w-full wr-grid-cols-3 wr-grid-rows-1 wr-items-center wr-justify-between wr-gap-1"
                >
                  {ALL_RPS_CHOICES.map((item) => (
                    <FormItem className="wr-mb-0 wr-cursor-pointer" key={item}>
                      <FormControl>
                        <RPSChoiceRadio
                          choice={item}
                          disabled={isFormInProgress}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroupPrimitive.Root>
              </FormControl>
            </FormItem>
          )}
        />
        <BetCountFormField isDisabled={isFormInProgress} />
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

        {!(rpsGameResults.length > 3) && (
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
        {rpsGameResults.length > 3 && gameStatus == "PLAYING" && <SkipButton />}
      </div>
      <footer className="wr-mt-4 wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
