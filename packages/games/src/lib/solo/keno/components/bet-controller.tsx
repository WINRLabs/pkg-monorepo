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
import { TotalWager, WagerCurrencyIcon } from "../../../common/wager";
import { IconMagicStick, IconTrash } from "../../../svgs";
import { Button } from "../../../ui/button";
import { FormLabel } from "../../../ui/form";
import { cn } from "../../../utils/style";
import useKenoGameStore from "../store";
import { KenoForm } from "../types";

type Props = {
  minWager: number;
  maxWager: number;
};

export const BetController: React.FC<Props> = ({ minWager, maxWager }) => {
  const form = useFormContext() as KenoForm;

  const selections = form.watch("selections");

  const { kenoGameResults, gameStatus } = useKenoGameStore([
    "kenoGameResults",
    "gameStatus",
  ]);

  const maxPayout = 10;

  const clearBetHandler = () => {
    form.setValue("selections", []);
  };

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const autoPickHandler = () => {
    clearBetHandler();

    var randomNumbers: number[] = [];

    for (var i = 0; i < 10; i++) {
      var randomNumber;

      do {
        randomNumber = getRandomNumber(1, 40);
      } while (randomNumbers.includes(randomNumber));

      randomNumbers.push(randomNumber);
    }

    form.setValue("selections", randomNumbers);
  };

  const isFormInProgress =
    form.formState.isSubmitting || form.formState.isLoading;

  return (
    <BetControllerContainer>
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>Keno</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={isFormInProgress}
        />
        <BetCountFormField maxValue={3} isDisabled={isFormInProgress} />
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
            <div className="wr-grid grid-cols-2 gap-2">
              <StopGainFormField isDisabled={isFormInProgress} />
              <StopLossFormField isDisabled={isFormInProgress} />
            </div>
          </Advanced>
        </div>
        <PreBetButton>
          <Button
            type="submit"
            variant={"success"}
            className="wr-w-full max-lg:-wr-order-2 max-lg:wr-mb-3.5"
            size={"xl"}
            isLoading={isFormInProgress}
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              selections.length === 0 ||
              gameStatus == "PLAYING"
            }
          >
            Bet
          </Button>
        </PreBetButton>
        <div className="wr-mt-2 wr-grid wr-grid-cols-2 wr-gap-2 max-lg:-wr-order-1 ">
          <Button
            size={"xl"}
            variant={"secondary"}
            type="button"
            disabled={isFormInProgress}
            onClick={autoPickHandler}
          >
            <IconMagicStick className="wr-mr-1 wr-h-5 wr-w-5" />
            Auto Pick
          </Button>
          <Button
            size={"xl"}
            variant={"secondary"}
            type="button"
            onClick={clearBetHandler}
            disabled={isFormInProgress}
          >
            <IconTrash className="wr-mr-1 wr-h-5 wr-w-5" />
            Clear
          </Button>
        </div>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
