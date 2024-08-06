"use client";

import * as Slider from "@radix-ui/react-slider";
import React from "react";
import { useFormContext } from "react-hook-form";

import { Advanced } from "../../../common/advanced";
import { UnityAudioController } from "../../../common/audio-controller";
import { UnityBetControllerContainer } from "../../../common/containers";
import {
  BetControllerTitle,
  StopGainFormField,
  StopLossFormField,
  UnityBetCountFormField,
  UnityWagerFormField,
} from "../../../common/controller";
import { PreBetButton } from "../../../common/pre-bet-button";
import { TotalWager, WagerCurrencyIcon } from "../../../common/wager";
import { Button } from "../../../ui/button";
import { FormLabel } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { toDecimals } from "../../../utils/web3";
import { rowMultipliers } from "../constants";
import usePlinko3dGameStore from "../store";
import { Plinko3dForm } from "../types";
import PlinkoRow from "./plinko-row";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";

type Props = {
  minWager: number;
  maxWager: number;
  count: number;
  logo: string;
};

export const BetController: React.FC<Props> = ({
  minWager,
  maxWager,
  logo,
}) => {
  const form = useFormContext() as Plinko3dForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const wager = form.watch("wager");

  const betCount = form.watch("betCount");

  const { gameStatus } = usePlinko3dGameStore(["gameStatus"]);

  const rowSize = form.watch("plinkoSize");

  const maxPayout = React.useMemo(() => {
    const maxMultiplier = isNaN(rowMultipliers?.[rowSize]?.[0] || 0)
      ? 0
      : rowMultipliers?.[rowSize]?.[0] || 0;

    return toDecimals(wager * betCount * maxMultiplier, 2);
  }, [betCount, wager, rowSize]);

  return (
    <UnityBetControllerContainer className="wr-no-scrollbar wr-relative wr-z-[20]  wr-flex wr-h-full wr-max-h-full max-lg:wr-w-full wr-flex-col wr-justify-between wr-overflow-auto lg:wr-absolute lg:wr-left-0 lg:wr-top-0 lg:wr-w-[264px]">
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="wr-mb-6 max-lg:wr-hidden">
          <BetControllerTitle>
            <img src={logo} width={103.47} height={19.6} alt="game_logo" />
          </BetControllerTitle>
        </div>

        <UnityWagerFormField minWager={minWager} maxWager={maxWager} />
        <div className="wr-relative">
          <UnityBetCountFormField
            isDisabled={
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              gameStatus == "PLAYING"
            }
          >
            (1 - 100)
          </UnityBetCountFormField>
          <Slider.Root
            className={cn(
              "wr-absolute wr-left-0 wr-top-[65px] wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center wr-px-1.5"
            )}
            min={1}
            value={[form.getValues("betCount")]}
            max={100}
            onValueChange={(e: any) => {
              form.setValue("betCount", e[0], { shouldValidate: true });
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
        </div>

        <PlinkoRow />
        <div className="wr-mb-6 wr-grid wr-grid-cols-2 wr-gap-2">
          <div>
            <FormLabel className="wr-text-unity-white-50">Max Payout</FormLabel>
            <div
              className={cn(
                "wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] ",
                "wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md"
              )}
            >
              <WagerCurrencyIcon />
              <span className={cn("wr-font-semibold wr-text-zinc-100")}>
                ${maxPayout}
              </span>
            </div>
          </div>
          <div>
            <FormLabel className="wr-text-unity-white-50">
              Total Wager
            </FormLabel>
            <TotalWager
              betCount={form.getValues().betCount}
              wager={form.getValues().wager}
              containerClassName="wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md"
            />
          </div>
        </div>

        <div>
          <Advanced>
            <div className="wr-grid wr-grid-cols-2 wr-gap-2">
              <StopGainFormField
                labelClassName="wr-text-unity-white-50"
                inputContainerClassName={cn(
                  "wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md"
                )}
                isDisabled={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING"
                }
              />
              <StopLossFormField
                labelClassName="wr-text-unity-white-50"
                inputContainerClassName={cn(
                  "wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md"
                )}
                isDisabled={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING"
                }
              />
            </div>
          </Advanced>
        </div>
        <PreBetButton variant={"plinko"}>
          <Button
            type="submit"
            variant="plinko"
            className="wr-w-full !wr-rounded-none max-lg:-wr-order-2 max-lg:wr-mb-3.5 max-lg:wr-bg-cover"
            size={"xl"}
            onClick={() => clickEffect.play()}
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              gameStatus === "PLAYING"
            }
            isLoading={form.formState.isSubmitting || form.formState.isLoading}
          >
            Play
          </Button>
        </PreBetButton>
      </div>
      <footer className="wr-mt-auto wr-flex wr-items-center wr-justify-between">
        <UnityAudioController />
      </footer>
    </UnityBetControllerContainer>
  );
};
