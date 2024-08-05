"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Chip } from "../../../common/chip-controller/types";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { CDN_URL } from "../../../constants";
import { Form } from "../../../ui/form";
import { RotationWrapper } from "../../../ui/rotation-wrapper";
import { MULTIPLIER_BANKER, MULTIPLIER_TIE } from "../constants";
import {
  BaccaratBetType,
  BaccaratFormFields,
  BaccaratGameProps,
  BaccaratGameResult,
  BaccaratGameSettledResult,
} from "../types";
import { BaccaratScene } from "./baccarat-scene";
import { BetController } from "./bet-controller";

type TemplateProps = BaccaratGameProps & {
  minWager?: number;
  maxWager?: number;

  onSubmitGameForm: (data: BaccaratFormFields) => void;
  onFormChange?: (fields: BaccaratFormFields) => void;
};

const BaccaratTemplate: React.FC<TemplateProps> = ({
  minWager,
  maxWager,

  baccaratResults,
  baccaratSettledResults,

  onAnimationCompleted = () => {},
  onSubmitGameForm,
  onFormChange,
}) => {
  const [maxPayout, setMaxPayout] = React.useState<number>(0);

  const [isGamePlaying, setIsGamePlaying] = React.useState<boolean>(false);

  const [lastSelections, setLastSelections] = React.useState<
    {
      type: BaccaratBetType;
      wager: number;
    }[]
  >([]);

  const [selectedChip, setSelectedChip] = React.useState<Chip>(Chip.ONE);
  const [results, setResults] = React.useState<BaccaratGameResult | null>(null);
  const [settled, setSettled] =
    React.useState<BaccaratGameSettledResult | null>(null);

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager || 1, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    playerWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    bankerWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    tieWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    defaultValues: {
      wager: minWager || 1,
      playerWager: 0,
      bankerWager: 0,
      tieWager: 0,
    },
  });

  const wager = form.watch("wager");

  const tieWager = form.watch("tieWager");

  const bankerWager = form.watch("bankerWager");

  const playerWager = form.watch("playerWager");

  const addWager = (wager: Chip, betType: BaccaratBetType) => {
    const _lastSelections = lastSelections;

    switch (betType) {
      case BaccaratBetType.TIE:
        form.setValue("tieWager", tieWager + wager);

        _lastSelections.push({ type: BaccaratBetType.TIE, wager });

        break;

      case BaccaratBetType.BANKER:
        form.setValue("bankerWager", bankerWager + wager);

        _lastSelections.push({ type: BaccaratBetType.BANKER, wager });

        break;

      case BaccaratBetType.PLAYER:
        form.setValue("playerWager", playerWager + wager);

        _lastSelections.push({ type: BaccaratBetType.PLAYER, wager });

        break;
    }

    setLastSelections([..._lastSelections]);
  };

  const undoBet = () => {
    if (!lastSelections.length) return;

    // get last index
    const lastSelectionIdx = lastSelections.length - 1;

    const lastSelection = lastSelections[lastSelectionIdx];

    // call selected numbers and remove last wager
    if (lastSelection?.type === BaccaratBetType.TIE) {
      form.setValue("tieWager", tieWager - lastSelection.wager);
    }

    if (lastSelection?.type === BaccaratBetType.BANKER) {
      form.setValue("bankerWager", bankerWager - lastSelection.wager);
    }

    if (lastSelection?.type === BaccaratBetType.PLAYER) {
      form.setValue("playerWager", playerWager - lastSelection.wager);
    }

    // remove last selection
    lastSelections.pop();

    setLastSelections([...lastSelections]);
  };

  React.useEffect(() => {
    const tieMaxPayout = tieWager * MULTIPLIER_TIE * wager;

    const bankerMaxPayout = bankerWager * MULTIPLIER_BANKER * wager;

    const playerMaxPayout = playerWager * MULTIPLIER_BANKER * wager;

    if (tieMaxPayout > bankerMaxPayout && tieMaxPayout > playerMaxPayout)
      setMaxPayout(tieMaxPayout);
    else if (
      bankerMaxPayout > tieMaxPayout &&
      bankerMaxPayout > playerMaxPayout
    )
      setMaxPayout(bankerMaxPayout);
    else setMaxPayout(playerMaxPayout);
  }, [bankerWager, playerWager, tieWager, wager]);

  const prepareSubmit = (data: BaccaratFormFields) => {
    setResults(null);
    setSettled(null);
    setIsGamePlaying(true);

    console.log("SUBMITTING!!!!!!");

    onSubmitGameForm(data);
  };

  React.useEffect(() => {
    baccaratResults && setResults(baccaratResults);
  }, [baccaratResults]);

  React.useEffect(() => {
    baccaratSettledResults && setSettled(baccaratSettledResults);
  }, [baccaratSettledResults]);

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      onFormChange && onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(prepareSubmit)}>
        <GameContainer className="wr-relative wr-overflow-hidden wr-pt-0">
          <BetController
            maxWager={maxWager || 2000}
            minWager={minWager || 1}
            isDisabled={isGamePlaying}
            totalWager={(bankerWager + tieWager + playerWager) * wager}
            maxPayout={maxPayout}
            selectedChip={selectedChip}
            undoBet={undoBet}
            onSelectedChipChange={setSelectedChip}
          />
          <SceneContainer
            className="wr-relative wr-flex wr-h-[475px] lg:wr-h-[640px] wr-overflow-hidden"
            style={{
              backgroundImage: `url(${CDN_URL}/baccarat/baccarat-bg.png)`,
            }}
          >
            <BaccaratScene
              baccaratResults={results}
              baccaratSettled={settled}
              isDisabled={isGamePlaying}
              setIsDisabled={setIsGamePlaying}
              addWager={addWager}
              selectedChip={selectedChip}
              onAnimationCompleted={onAnimationCompleted}
            />
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default BaccaratTemplate;
