import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useFormContext } from "react-hook-form";

import { CDN_URL } from "../../../constants";
import { MineCellBg } from "./mine-cell-bg";
import { FormControl, FormField, FormItem } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { boardsSchema, initialBoard } from "../constants";
import { useMinesGameStateStore } from "../store";
import { MINES_GAME_STATUS, MINES_SUBMIT_TYPE, MinesForm } from "../types";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import React from "react";

const MineCell: React.FC<{
  mineCell: (typeof initialBoard)["0"];
  idx: number;
  isLoading?: boolean;
}> = ({ mineCell, idx, isLoading }) => {
  const form = useFormContext() as MinesForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const bombEffect = useAudioEffect(SoundEffects.MINES_BOMB);
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const { gameStatus, updateBoardItem, updateMinesGameState } =
    useMinesGameStateStore([
      "gameStatus",
      "updateBoardItem",
      "updateMinesGameState",
    ]);

  React.useEffect(() => {
    if (mineCell.isBomb) bombEffect.play();
  }, [mineCell.isBomb]);

  React.useEffect(() => {
    if (!mineCell.isBomb && mineCell.isRevealed) winEffect.play();
  }, [mineCell.isBomb, mineCell.isRevealed]);

  return (
    <FormField
      control={form.control}
      name="selectedCells"
      render={({ field }) => {
        return (
          <FormItem className="wr-mb-0 wr-aspect-square lg:wr-aspect-auto">
            <FormControl>
              <CheckboxPrimitive.Root
                className={cn("wr-h-full wr-w-full")}
                onClick={() => {
                  clickEffect.play();
                  updateMinesGameState({
                    submitType:
                      gameStatus === MINES_GAME_STATUS.IDLE
                        ? MINES_SUBMIT_TYPE.FIRST_REVEAL
                        : MINES_SUBMIT_TYPE.REVEAL,
                  });
                }}
                checked={field.value[idx]}
                onCheckedChange={(checked) => {
                  const currentSelectedCellAmount = field.value.filter(
                    (item) => item === true
                  ).length;

                  const currentSchema =
                    boardsSchema[form.getValues().minesCount - 1];

                  if (currentSchema === undefined) {
                    // toast({
                    //   title: "Error",
                    //   description: "Please select mines count",
                    //   variant: "error",
                    // });

                    return;
                  } else if (
                    currentSelectedCellAmount >= currentSchema.maxReveal &&
                    !field.value[idx]
                  ) {
                    // toast({
                    //   title: "Error",
                    //   description: `You can select maximum ${currentSchema.maxReveal} cells`,
                    //   variant: "error",
                    // });

                    return;
                  }
                  updateBoardItem(idx, {
                    ...mineCell,
                    isSelected: checked ? true : false,
                  });

                  const newSelectedCells = [...field.value];
                  newSelectedCells[idx] = checked ? true : false;

                  return field.onChange(newSelectedCells);
                }}
                disabled={mineCell.isBomb || mineCell.isRevealed || isLoading}
              >
                <div className="wr-relative wr-aspect-square lg:wr-aspect-auto lg:wr-h-[120px] lg:wr-w-[120px]">
                  <MineCellBg
                    isLoading={isLoading}
                    className={cn(
                      "wr-absolute wr-left-0 wr-top-0 wr-rounded-xl wr-text-zinc-700 wr-opacity-100 wr-transition-all wr-duration-300 hover:wr-scale-105",
                      {
                        "wr-text-red-600": mineCell.isSelected,
                        "wr-opacity-0": mineCell.isRevealed,
                      }
                    )}
                  />

                  <div
                    className={cn(
                      "wr-absolute -wr-bottom-20 wr-left-0 wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-rounded-xl wr-opacity-100 wr-transition-all wr-duration-500",
                      {
                        "wr-opacity-0": !mineCell.isRevealed,
                        "wr-bottom-0": mineCell.isRevealed,
                      }
                    )}
                    style={{
                      background: mineCell.isBomb
                        ? "radial-gradient(76.92% 76.92% at 69.23% 38.46%, #EF4444 24.51%, #DC2626 77.06%)"
                        : "radial-gradient(97.56% 97.56% at 69.23% 38.46%, #A3E635 24.51%, #65A30D 77.06%)",
                    }}
                  >
                    <img
                      src={
                        mineCell.isBomb
                          ? `${CDN_URL}/mines/revealed-mine.png`
                          : `${CDN_URL}/mines/revealed-gem.png`
                      }
                      width={88}
                      height={88}
                      alt="revealed gem"
                    />
                  </div>
                </div>
              </CheckboxPrimitive.Root>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default MineCell;
