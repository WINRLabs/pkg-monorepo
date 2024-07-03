import React from "react";
import { useFormContext } from "react-hook-form";
import { AudioController } from "../../../common/audio-controller";
import { BetControllerContainer } from "../../../common/containers";
import { BetControllerTitle, WagerFormField } from "../../../common/controller";
import { PreBetButton } from "../../../common/pre-bet-button";
import { TotalWager, WagerCurrencyIcon } from "../../../common/wager";
import { Button } from "../../../ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import { NumberInput } from "../../../ui/number-input";
import { cn } from "../../../utils/style";
import { toDecimals } from "../../../utils/web3";
import { initialBoard } from "../constants";
import mineMultipliers from "../constants/mines-multipliers.json";
import { useMinesGameStateStore } from "../store";
import { MINES_GAME_STATUS, MINES_SUBMIT_TYPE, MinesForm } from "../types";
import MinesCountButton from "./count-button";
import MinesCountDisplay from "./count-display";
import { CDN_URL } from "../../../constants";

type Props = {
  minWager: number;
  maxWager: number;
  currentMultiplier: number;
  currentCashoutAmount: number;
};

export const MinesBetController: React.FC<Props> = ({
  minWager,
  maxWager,
  currentCashoutAmount,
}) => {
  const form = useFormContext() as MinesForm;

  const { updateMinesGameState, gameStatus, board } = useMinesGameStateStore([
    "updateMinesGameState",
    "gameStatus",
    "board",
  ]);

  const wager = form.watch("wager");

  const numMines = form.watch("minesCount");

  const selectedCells = form.watch("selectedCells");

  const isSomeCellSelected =
    board.filter((cell) => cell.isRevealed).length !==
    selectedCells.filter((cell) => cell).length
      ? false
      : true;

  const maxPayout = React.useMemo(() => {
    const currentScheme = mineMultipliers.filter(
      (scheme) => scheme.numOfMines === numMines
    );

    if (currentScheme.length === 0) return 0;

    const largestReveal = currentScheme?.reduce((max, obj) => {
      return obj.reveal > max.reveal ? obj : max;
    });

    const largestMultiplier = toDecimals(
      Number(largestReveal.multiplier) / 10000,
      2
    );

    return toDecimals(wager * largestMultiplier, 2);
  }, [wager, numMines]);

  return (
    <BetControllerContainer>
      <div>
        <div className="wr-mb-3">
          <BetControllerTitle>Mines</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={gameStatus !== MINES_GAME_STATUS.IDLE}
        />

        <FormField
          control={form.control}
          name="minesCount"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Mines Count (1 -24)</FormLabel>
                <NumberInput.Root
                  {...field}
                  className="wr-relative wr-flex wr-items-center wr-gap-2"
                  isDisabled={gameStatus !== MINES_GAME_STATUS.IDLE}
                >
                  <NumberInput.Container>
                    <img
                      alt="mine_icon"
                      width={17}
                      height={17}
                      src={`${CDN_URL}/mines/mine-icon.png`}
                    />
                    <NumberInput.Input className="" />
                  </NumberInput.Container>
                  <div className="wr-flex wr-flex-shrink-0 wr-items-center wr-justify-between wr-gap-1">
                    <MinesCountButton
                      value={3}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                    <MinesCountButton
                      value={5}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                    <MinesCountButton
                      value={10}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                    <MinesCountButton
                      value={20}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                  </div>
                  <FormMessage className="wr-absolute wr-left-0 wr-top-12" />
                </NumberInput.Root>
              </FormItem>
            );
          }}
        />
        <MinesCountDisplay />

        <div className="wr-mb-6 wr-mt-6 wr-grid wr-grid-cols-2 wr-gap-2">
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
            <TotalWager betCount={1} wager={form.getValues().wager} />
          </div>
        </div>
        <PreBetButton>
          {gameStatus === MINES_GAME_STATUS.ENDED ? (
            <Button
              variant={"default"}
              className="wr-w-full wr-bg-yellow-600 hover:wr-bg-yellow-700"
              size={"xl"}
              type="button"
              onClick={() => {
                updateMinesGameState({
                  gameStatus: MINES_GAME_STATUS.IDLE,
                  submitType: MINES_SUBMIT_TYPE.IDLE,
                });

                form.resetField("selectedCells");

                updateMinesGameState({
                  board: initialBoard,
                });
              }}
            >
              Reset
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                variant={"success"}
                className="wr-w-full"
                size={"xl"}
                isLoading={
                  form.formState.isSubmitting || form.formState.isLoading
                }
                onClick={() => {
                  updateMinesGameState({
                    submitType:
                      gameStatus === MINES_GAME_STATUS.IDLE
                        ? MINES_SUBMIT_TYPE.FIRST_REVEAL
                        : MINES_SUBMIT_TYPE.REVEAL,
                  });
                }}
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  (gameStatus === MINES_GAME_STATUS.IDLE &&
                    selectedCells.every((cell) => cell === false)) ||
                  (gameStatus === MINES_GAME_STATUS.IN_PROGRESS &&
                    isSomeCellSelected)
                }
              >
                Reveal
              </Button>
              {gameStatus !== MINES_GAME_STATUS.IN_PROGRESS ? (
                <Button
                  type="submit"
                  variant={"success"}
                  className="wr-mt-6 wr-w-full"
                  size={"xl"}
                  isLoading={
                    form.formState.isSubmitting || form.formState.isLoading
                  }
                  onClick={() => {
                    updateMinesGameState({
                      submitType: MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT,
                    });
                  }}
                  disabled={
                    !form.formState.isValid ||
                    form.formState.isSubmitting ||
                    form.formState.isLoading ||
                    (gameStatus === MINES_GAME_STATUS.IDLE &&
                      selectedCells.every((cell) => cell === false))
                  }
                >
                  Reveal and Cashout
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant={"success"}
                  className="wr-mt-2 wr-flex wr-w-full wr-items-center wr-gap-2 wr-bg-green-500 hover:wr-bg-lime-700 disabled:wr-bg-lime-950"
                  size={"xl"}
                  isLoading={
                    form.formState.isSubmitting || form.formState.isLoading
                  }
                  onClick={() => {
                    updateMinesGameState({
                      submitType: MINES_SUBMIT_TYPE.CASHOUT,
                    });
                  }}
                  disabled={
                    form.formState.isSubmitting || form.formState.isLoading
                  }
                >
                  <span>Get </span>
                  <div className="wr-h-1 wr-w-1 wr-rounded-full wr-bg-white" />
                  {`$${currentCashoutAmount}`}
                </Button>
              )}
            </>
          )}
        </PreBetButton>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
