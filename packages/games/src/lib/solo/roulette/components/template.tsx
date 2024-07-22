"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AudioController } from "../../../common/audio-controller";
import { Chip } from "../../../common/chip-controller/types";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { CDN_URL } from "../../../constants";
import { Form } from "../../../ui/form";
import { RotationWrapper } from "../../../ui/rotation-wrapper";
import { Roulette } from "..";
import {
  chunkMinWagerIndexes,
  MAX_BET_COUNT,
  MIN_BET_COUNT,
  minWagerMultiplierForSideBets,
  NUMBER_INDEX_COUNT,
} from "../constants";
import { RouletteFormFields, RouletteGameProps } from "../types";

type TemplateProps = RouletteGameProps & {
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: RouletteFormFields) => void;
  onFormChange?: (fields: RouletteFormFields) => void;
};

const RouletteTemplate: React.FC<TemplateProps> = ({
  gameResults,
  minWager,
  maxWager,
  onSubmitGameForm,
  onFormChange,
  onAnimationCompleted,
  onAnimationSkipped,
  onAnimationStep,
}) => {
  const [selectedChip, setSelectedChip] = React.useState<Chip>(Chip.ONE);

  const [isPrepared, setIsPrepared] = React.useState<boolean>(false);

  const [lastSelecteds, setLastSelecteds] = React.useState<
    {
      index: number;
      wager: number;
    }[]
  >([]);

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager || 1, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    selectedNumbers: z.array(z.number()),
    totalWager: z
      .number()
      .min(1, {
        message: `Minimum wager is ${minWager}`,
      })
      .max(2000, {
        message: `Maximum wager is ${maxWager}`,
      }),
    betCount: z
      .number()
      .min(MIN_BET_COUNT, { message: `Minimum bet count is ${MIN_BET_COUNT}` })
      .max(MAX_BET_COUNT, {
        message: `Maximum bet count is ${MAX_BET_COUNT}`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    defaultValues: {
      wager: minWager || 1,
      totalWager: 0,
      betCount: 1,
      selectedNumbers: new Array(NUMBER_INDEX_COUNT).fill(0),
    },
  });

  const selectedNumbers = form.watch("selectedNumbers");

  const addWager = (n: number, wager: Chip) => {
    const _selectedNumbers = selectedNumbers;

    console.log(n, "index", chunkMinWagerIndexes.includes(n));

    let newWager = 0;

    // min wager for side bets
    if (chunkMinWagerIndexes.includes(n)) {
      newWager =
        (_selectedNumbers[n] as number) + wager * minWagerMultiplierForSideBets;
    } else {
      newWager = (_selectedNumbers[n] as number) + wager;
    }

    const totalWager = _selectedNumbers.reduce((acc, cur) => acc + cur, 0);

    _selectedNumbers[n] = newWager;

    form.setValue("selectedNumbers", [..._selectedNumbers]);

    form.setValue("totalWager", totalWager + 1);

    // set last selected for undo bet
    const _ls = lastSelecteds;

    _ls.push({ index: n, wager });

    setLastSelecteds([..._ls]);
  };

  const undoBet = () => {
    if (!lastSelecteds.length) return;

    // get last index
    const _ls = lastSelecteds[lastSelecteds.length - 1] as {
      index: number;
      wager: number;
    };

    // call selected numbres and remove last wager
    const _sn = selectedNumbers;

    const _nw = (_sn[_ls.index] as number) - _ls?.wager;

    _sn[_ls.index] = _nw;

    form.setValue("selectedNumbers", [..._sn]);

    // remove last items
    lastSelecteds.pop();

    setLastSelecteds([...lastSelecteds]);
  };

  const prepareSubmit = async (data: RouletteFormFields) => {
    setIsPrepared(true);
    onSubmitGameForm(data);
  };

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      onFormChange && onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <RotationWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(prepareSubmit)}>
          <GameContainer className="wr-relative wr-overflow-hidden wr-pt-0">
            <SceneContainer
              style={{
                backgroundImage: `url(${CDN_URL}/roulette/roulette-bg.png)`,
              }}
              className="wr-relative wr-flex wr-h-[675px] wr-flex-col wr-items-center wr-justify-start wr-gap-8 wr-bg-center wr-pb-20 wr-pt-6 max-lg:wr-h-[100dvh] max-lg:wr-rounded-none lg:wr-pt-6"
            >
              <AudioController className="wr-absolute wr-left-3 wr-top-3" />

              <Roulette.Game gameResults={gameResults}>
                <Roulette.Scene
                  isPrepared={isPrepared}
                  setIsPrepared={setIsPrepared}
                  onAnimationCompleted={onAnimationCompleted}
                  onAnimationSkipped={onAnimationSkipped}
                  onAnimationStep={onAnimationStep}
                />
                <Roulette.Table
                  addWager={addWager}
                  winningNumber={null}
                  selectedChip={selectedChip}
                  isPrepared={isPrepared}
                />
                <Roulette.BetController
                  isPrepared={isPrepared}
                  selectedChip={selectedChip}
                  onSelectedChipChange={setSelectedChip}
                  undoBet={undoBet}
                  minWager={minWager || 1}
                  maxWager={maxWager || 2000}
                />
                <Roulette.LastBets />
              </Roulette.Game>
            </SceneContainer>
          </GameContainer>
        </form>
      </Form>
    </RotationWrapper>
  );
};

export default RouletteTemplate;
