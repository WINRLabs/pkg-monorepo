"use client";
import * as React from "react";

import { FormLabel, Button, cn, toDecimals, toFormatted } from "@winrlabs/ui";
import { useFormContext } from "react-hook-form";
import { Advanced } from "../../../../common/advanced";
import {
  TotalWager,
  WagerCurrency,
  WagerCurrencyIcon,
} from "../../../../common/wager";
import {
  BetControllerTitle,
  BetCountFormField,
  StopGainFormField,
  StopLossFormField,
  WagerFormField,
} from "../../../../common/controller";
import { BetControllerContainer } from "../../../../common/containers";
import { CoinFlipForm } from "../../types";
import { PreBetButton } from "../../../../common/pre-bet-button";
import { AudioController } from "../../../../common/audio-controller";
import { useCoinFlipGameStore } from "../..";
import { useGameSkip } from "../../../../game-provider";
import { SkipButton } from "../../../../common/skip-button";

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
  const form = useFormContext() as CoinFlipForm;

  const maxPayout = React.useMemo(() => {
    const { wager, betCount } = form.getValues();

    return toDecimals(wager * betCount * winMultiplier, 2);
  }, [form.getValues().wager, form.getValues().betCount, winMultiplier]);

  const { coinFlipGameResults, gameStatus } = useCoinFlipGameStore([
    "coinFlipGameResults",
    "gameStatus",
  ]);

  const { updateSkipAnimation } = useGameSkip();

  return (
    <BetControllerContainer>
      <div className="max-lg:flex max-lg:flex-col">
        <div className="mb-3">
          <BetControllerTitle>Coin Flip</BetControllerTitle>
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
        <div className="mb-6 grid grid-cols-2 gap-2">
          <div>
            <FormLabel>Max Payout</FormLabel>
            <div
              className={cn(
                "flex w-full items-center gap-1 rounded-lg bg-zinc-800 px-2 py-[10px] overflow-hidden"
              )}
            >
              <WagerCurrencyIcon />
              <span className={cn("font-semibold text-zinc-100")}>
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
            <div className="grid grid-cols-2 gap-2">
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
        {!(coinFlipGameResults.length > 2) && gameStatus !== "PLAYING" ? (
          <PreBetButton>
            <Button
              type="submit"
              variant={"success"}
              className="w-full max-lg:-order-1 max-lg:mb-3.5"
              size={"xl"}
              isLoading={
                form.formState.isSubmitting || form.formState.isLoading
              }
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isLoading
              }
            >
              Bet
            </Button>
          </PreBetButton>
        ) : (
          <SkipButton />
        )}
      </div>
      <footer className="flex items-center justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
