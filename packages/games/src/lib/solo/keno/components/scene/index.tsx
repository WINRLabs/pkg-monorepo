import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import React from "react";
import { useFormContext } from "react-hook-form";

import { CDN_URL } from "../../../../constants";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import { FormControl, FormField, FormItem } from "../../../../ui/form";
import { cn } from "../../../../utils/style";
import { Keno } from "../..";
import { initialKenoCells } from "../../constants";
import useKenoGameStore from "../../store";
import { KenoForm, KenoGameResult } from "../../types";
import styles from "./scene.module.css";

export type KenoSceneProps = {
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: KenoGameResult[]) => void;
};

export const KenoScene: React.FC<KenoSceneProps> = ({
  onAnimationStep,
  onAnimationCompleted,
}) => {
  const form = useFormContext() as KenoForm;

  const pickEffect = useAudioEffect(SoundEffects.LIMBO_TICK);

  const outComeEffect = useAudioEffect(SoundEffects.KENO_OUTCOME_NUMBER);

  const [currentNumbers, setCurrentNumbers] = React.useState<number[][]>([]);

  const { kenoGameResults, updateKenoGameResults, updateGameStatus } =
    useKenoGameStore([
      "kenoGameResults",
      "updateKenoGameResults",
      "updateGameStatus",
    ]);

  React.useEffect(() => {
    if (kenoGameResults.length == 0) return;

    const turn = (i = 0) => {
      const curr = i + 1;

      onAnimationStep && onAnimationStep(curr);

      const isWon = kenoGameResults?.[i]?.settled.won;

      setCurrentNumbers(
        currentNumbers.concat(kenoGameResults?.[i]?.resultNumbers || [])
      );

      if (isWon) {
        outComeEffect.play();
      }

      if (kenoGameResults.length === curr) {
        updateKenoGameResults([]);
        onAnimationCompleted && onAnimationCompleted(kenoGameResults);
        setTimeout(() => {
          setCurrentNumbers([]);
          updateGameStatus("ENDED");
        }, 1000);
      } else {
        setTimeout(() => turn(curr), 1500);
      }
    };

    turn();
  }, [kenoGameResults]);

  const renderCell = (cell: number, win: boolean, loss: boolean) => {
    if (win) {
      return (
        <div
          className={cn(
            styles["wr-keno-flip-animation"],
            " wr-grid wr-animate-keno-gem-flip  wr-grid-cols-3  "
          )}
        >
          <div
            className={cn(
              styles["wr-rotateY-180"],
              " wr-relative  wr-col-start-2 wr-w-full "
            )}
          >
            <img
              src={`${CDN_URL}/keno/blue-gem-1.png`}
              alt="win"
              className="wr-left-0 wr-top-0 wr-h-full wr-w-full  wr-object-cover"
            />
          </div>
        </div>
      );
    } else if (loss) {
      return (
        <div
          className={cn(
            styles["wr-keno-flip-animation"],
            "wr-grid wr-animate-keno-gem-flip wr-grid-cols-3"
          )}
        >
          <div
            className={cn(
              styles["wr-rotateY-180"],
              "wr-relative wr-col-start-2 wr-w-full "
            )}
          >
            <img
              src={`${CDN_URL}/keno/black-gem.png`}
              alt="loss"
              className="wr-left-0 wr-top-0 wr-h-full wr-w-full  wr-object-cover"
            />
          </div>
        </div>
      );
    } else {
      return cell;
    }
  };

  return (
    <>
      <FormField
        name="selections"
        control={form.control}
        render={({ field }) => (
          <FormItem className="wr-mb-0 wr-w-full">
            <FormField
              control={form.control}
              name="selections"
              render={({ field }) => {
                return (
                  <FormItem className="wr-grid wr-h-full wr-w-full wr-grid-cols-5 wr-grid-rows-5 wr-items-center wr-justify-center wr-gap-2">
                    {initialKenoCells.map((cell, idx) => {
                      return (
                        <FormItem key={idx} className="wr-mb-0 wr-w-full ">
                          <FormControl>
                            <CheckboxPrimitive.Root
                              checked={field.value.includes(cell)}
                              onCheckedChange={(checked) => {
                                if (!checked) {
                                  form.setValue(
                                    "selections",
                                    field.value.filter((item) => item !== cell)
                                  );

                                  pickEffect.play();
                                }

                                if (form.watch("selections").length >= 10) {
                                  return;
                                }

                                if (checked) {
                                  form.setValue(
                                    "selections",
                                    field.value.concat(cell)
                                  );
                                }
                              }}
                              className="wr-h-[34px] wr-w-full wr-rounded-lg wr-bg-keno-cell-bg wr-bg-[size:200%]  wr-bg-no-repeat wr-transition-all wr-duration-300 hover:wr-scale-105 sm:wr-h-[70px]"
                              style={{
                                backgroundPosition: field.value.includes(cell)
                                  ? "100% 90%"
                                  : "top",
                              }}
                            >
                              <div>
                                {renderCell(
                                  cell,
                                  currentNumbers.includes(cell) &&
                                    field.value.includes(cell),
                                  currentNumbers.includes(cell) &&
                                    !field.value.includes(cell)
                                )}
                              </div>
                            </CheckboxPrimitive.Root>
                          </FormControl>
                        </FormItem>
                      );
                    })}
                  </FormItem>
                );
              }}
            />
          </FormItem>
        )}
      />
      <Keno.MultiplierCarousel currentNumbers={currentNumbers} />
    </>
  );
};
