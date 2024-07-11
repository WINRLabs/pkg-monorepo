import * as Radio from "@radix-ui/react-radio-group";
import React from "react";
import { useFormContext } from "react-hook-form";

import { AudioController } from "../../../../common/audio-controller";
import { BetControllerContainer } from "../../../../common/containers";
import {
  BetControllerTitle,
  WagerFormField,
} from "../../../../common/controller";
import { PreBetButton } from "../../../../common/pre-bet-button";
import { WagerCurrencyIcon } from "../../../../common/wager";
import useCountdown from "../../../../hooks/use-time-left";
// import useWheelGameStore from "../../_store/game-info-store";
// import useCountdown from "@/hooks/use-time-left";
import { Button } from "../../../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../../../ui/form";
import { cn } from "../../../../utils/style";
import { toDecimals } from "../../../../utils/web3";
import { MultiplayerGameStatus } from "../../../core/type";
import { colorMultipliers,WheelColor } from "../../constants";
import { useWheelGameStore } from "../../store";
import { WheelForm } from "../../types";

interface Props {
  minWager: number;
  maxWager: number;
}

const BetController: React.FC<Props> = ({ minWager, maxWager }) => {
  const {
    cooldownFinish,
    status,
    resetState,
    resetWheelParticipant,
    isGamblerParticipant,
    setIsGamblerParticipant,
  } = useWheelGameStore([
    "cooldownFinish",
    "status",
    "resetState",
    "resetWheelParticipant",
    "isGamblerParticipant",
    "setIsGamblerParticipant",
  ]);

  const form = useFormContext() as WheelForm;

  const chosenColor = form.watch("color");

  const currentWager = form.watch("wager");

  const maxPayout = React.useMemo(() => {
    return toDecimals(
      colorMultipliers[chosenColor as WheelColor] * currentWager
    );
  }, [chosenColor, currentWager]);

  const timeLeft = useCountdown(cooldownFinish, () => {
    resetState();
    resetWheelParticipant();
    setIsGamblerParticipant(false);
  });

  return (
    <BetControllerContainer>
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>Wheel</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={form.formState.isSubmitting || form.formState.isLoading}
        />
        <div className="wr-mb-6">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="wr-text-white/50">Choose</FormLabel>
                <FormControl>
                  <Radio.RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="wr-grid wr-h-9 wr-w-full wr-grid-cols-4 wr-grid-rows-1 wr-gap-[6px]"
                  >
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            "wr-h-full wr-w-full wr-rounded-md wr-bg-white/25 wr-text-zinc-200 wr-transition-all wr-ease-in data-[state=checked]:wr-bg-white  data-[state=checked]:wr-text-zinc-600"
                          )}
                          value={WheelColor.GREY}
                        >
                          2x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            "wr-h-full wr-w-full wr-rounded-md wr-bg-blue-500/25 wr-text-blue-400 wr-transition-all wr-ease-in data-[state=checked]:wr-bg-blue-500 data-[state=checked]:wr-text-zinc-100"
                          )}
                          value={WheelColor.BLUE}
                        >
                          3x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            "wr-h-full wr-w-full wr-rounded-md wr-bg-green-500/25  wr-text-green-500 wr-transition-all wr-ease-in data-[state=checked]:wr-bg-green-500 data-[state=checked]:wr-text-zinc-100"
                          )}
                          value={WheelColor.GREEN}
                        >
                          6x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            "wr-h-full wr-w-full wr-rounded-md wr-bg-red-600/25 wr-text-red-600  wr-transition-all wr-ease-in data-[state=checked]:wr-bg-red-600 data-[state=checked]:wr-text-zinc-100"
                          )}
                          value={WheelColor.RED}
                        >
                          48x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                  </Radio.RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="wr-mb-6">
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
        </div>
        <PreBetButton>
          <Button
            type="submit"
            variant={"success"}
            className="wr-w-full max-lg:-wr-order-1 max-lg:wr-mb-3.5"
            size={"xl"}
            isLoading={form.formState.isSubmitting || form.formState.isLoading}
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              (timeLeft > 0 &&
                status === MultiplayerGameStatus.Wait &&
                isGamblerParticipant) ||
              (timeLeft > 0 && status === MultiplayerGameStatus.Finish) ||
              chosenColor === WheelColor.IDLE
            }
          >
            {timeLeft > 0 && status === MultiplayerGameStatus.Finish
              ? `Next game in ${timeLeft} seconds`
              : chosenColor !== WheelColor.IDLE
                ? "BET"
                : "CHOOSE COLOR"}
          </Button>
        </PreBetButton>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};

export default BetController;
