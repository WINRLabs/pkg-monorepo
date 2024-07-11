"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { cn } from "../../../../lib/utils/style";
import { GameContainer, SceneContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { toDecimals } from "../../../utils/web3";
import { LUCK_MULTIPLIER, MAX_BET_COUNT, MIN_BET_COUNT } from "../constant";
import { Dice } from "../index";
import { DiceFormFields } from "../types";
import { BetController } from "./bet-controller";
import { RangeGameProps } from "./game";
import { SliderTrackOptions } from "./slider";

type TemplateOptions = {
  slider?: {
    track?: SliderTrackOptions;
  };

  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = RangeGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: DiceFormFields) => void;
  onFormChange: (fields: DiceFormFields) => void;
  isGettingResult?: boolean;
};

const defaultOptions: TemplateOptions = {
  slider: {
    track: {
      color: "#a1a1aa",
      activeColor: "#22c55e",
    },
  },
};

const DiceTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...defaultOptions, ...props.options };

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 1, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    betCount: z
      .number()
      .min(MIN_BET_COUNT, { message: "Minimum bet count is 1" })
      .max(MAX_BET_COUNT, {
        message: "Maximum bet count is 100",
      }),
    stopGain: z.number(),
    stopLoss: z.number(),
    rollValue: z.number().min(5).max(95),
    rollType: z.enum(["OVER", "UNDER"]),
    winChance: z.number().min(5).max(95),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "onSubmit",
    defaultValues: {
      wager: props?.minWager || 1,
      betCount: 1,
      stopGain: 0,
      stopLoss: 0,
      rollType: "OVER",
      rollValue: 50,
      winChance: 50,
    },
  });

  const winChance = form.watch("winChance");

  const winMultiplier = useMemo(() => {
    return toDecimals((100 / winChance) * LUCK_MULTIPLIER, 2);
  }, [winChance]);

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <GameContainer>
          <BetController
            minWager={props.minWager || 1}
            maxWager={props.maxWager || 2000}
            winMultiplier={winMultiplier}
            isGettingResults={props.isGettingResult}
          />
          <SceneContainer
            className={cn("wr-h-[640px]  max-md:wr-h-[425px] lg:wr-py-12")}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <Dice.Game {...props}>
              {/* last bets */}
              <div />
              <Dice.Body>
                <Dice.LastBets />
                <Dice.TextRandomizer />
                <Dice.Slider track={options?.slider?.track} />
              </Dice.Body>
              <Dice.Controller winMultiplier={winMultiplier} />
            </Dice.Game>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default DiceTemplate;
