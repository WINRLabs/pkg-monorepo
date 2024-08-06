"use client";

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
import { FormLabel } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { toDecimals } from "../../../utils/web3";
import useRollGameStore from "../store";
import { RollForm } from "../types";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";

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
  const form = useFormContext() as RollForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const wager = form.watch("wager");

  const betCount = form.watch("betCount");

  const { rollGameResults, gameStatus } = useRollGameStore([
    "rollGameResults",
    "gameStatus",
  ]);
  const isFormInProgress =
    form.formState.isSubmitting ||
    form.formState.isLoading ||
    gameStatus == "PLAYING";

  const maxPayout = React.useMemo(() => {
    return toDecimals(wager * betCount * winMultiplier, 2);
  }, [wager, betCount, winMultiplier]);

  return (
    <BetControllerContainer>
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>Roll</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={isFormInProgress}
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
            <TotalWager betCount={betCount} wager={wager} />
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

        {!(rollGameResults.length > 3) && (
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
        {rollGameResults.length > 3 && gameStatus == "PLAYING" && (
          <SkipButton />
        )}
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
