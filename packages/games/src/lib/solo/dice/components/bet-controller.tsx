"use client";
import * as React from "react";

import { BetControllerContainer } from "../../../common/containers";
import {
  BetControllerTitle,
  BetCountFormField,
  StopGainFormField,
  StopLossFormField,
  WagerFormField,
} from "../../../common/controller";
import { TotalWager, WagerCurrencyIcon } from "../../../common/wager";
import { Advanced } from "../../../common/advanced";
import { useFormContext } from "react-hook-form";
import { toDecimals, toFormatted } from "../../../utils/web3";
import { DiceForm } from "../types";
import { PreBetButton } from "../../../common/pre-bet-button";
import { useDiceGameStore } from "..";
import { SkipButton } from "../../../common/skip-button";
import { AudioController } from "../../../common/audio-controller";
import { cn } from "../../../utils/style";
import { FormLabel } from "../../../ui/form";
import { Button } from "../../../ui/button";
// import { AudioController } from "@/components/common/audio-controller";
// import { PreBetButton } from "@/app/(games)/_components/bet-button";

interface Props {
  minWager: number;
  maxWager: number;
  winMultiplier: number;
  isGettingResults?: boolean;
}

export const BetController: React.FC<Props> = ({
  minWager,
  maxWager,
  winMultiplier,
  isGettingResults,
}) => {
  const form = useFormContext() as DiceForm;

  const maxPayout = React.useMemo(() => {
    const { wager, betCount } = form.getValues();

    return toDecimals(wager * betCount * winMultiplier, 2);
  }, [form.getValues().wager, form.getValues().betCount, winMultiplier]);

  const { gameStatus, diceGameResults } = useDiceGameStore([
    "gameStatus",
    "diceGameResults",
  ]);

  console.log("diceGameResults", diceGameResults.length);

  return (
    <BetControllerContainer>
      <div className="wr-max-lg:flex wr-max-lg:flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>Dice</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING" ||
            isGettingResults
          }
        />
        <BetCountFormField
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING" ||
            isGettingResults
          }
        />
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
                  gameStatus == "PLAYING" ||
                  isGettingResults
                }
              />
              <StopLossFormField
                isDisabled={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == "PLAYING" ||
                  isGettingResults
                }
              />
            </div>
          </Advanced>
        </div>
        {!(diceGameResults.length > 3) && (
          <PreBetButton>
            <Button
              type="submit"
              variant={"success"}
              className="wr-w-full max-lg:-wr-order-1 max-lg:wr-mb-3.5"
              size={"xl"}
              isLoading={
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                isGettingResults
              }
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                gameStatus == "PLAYING" ||
                isGettingResults
              }
            >
              Bet
            </Button>
          </PreBetButton>
        )}
        {diceGameResults.length > 3 && gameStatus == "PLAYING" && (
          <SkipButton />
        )}
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
