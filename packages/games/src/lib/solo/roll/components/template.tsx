"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { GameContainer, SceneContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { cn } from "../../../utils/style";
import { toDecimals } from "../../../utils/web3";
import { Roll } from "..";
import {
  ALL_DICES,
  LUCK_MULTIPLIER,
  MAX_BET_COUNT,
  MIN_BET_COUNT,
} from "../constant";
import { DICE, RollFormFields } from "../types";
import { BetController } from "./bet-controller";
import { RollGameProps } from "./game";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = RollGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: RollFormFields) => void;
  onFormChange?: (fields: RollFormFields) => void;
};

const RollTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...props.options };

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
    dices: z
      .array(z.nativeEnum(DICE))
      .nonempty()
      .min(1, {
        message: "You have to select at least one dice.",
      })
      .max(5, {
        message: "You can select up to 5 dices.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "all",
    defaultValues: {
      wager: props?.minWager || 1,
      betCount: 1,
      stopGain: 0,
      stopLoss: 0,
      dices: [],
    },
  });

  const dices = form.watch("dices");

  const { winMultiplier, winChance } = React.useMemo(() => {
    if (!dices.length)
      return {
        winChance: 0,
        winMultiplier: 0,
      };

    return {
      winMultiplier: toDecimals(
        (ALL_DICES.length / dices.length) * LUCK_MULTIPLIER,
        4
      ),
      winChance: toDecimals((dices.length * 100) / ALL_DICES.length, 2),
    };
  }, [dices]);

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
            maxWager={props?.maxWager || 2000}
            minWager={props?.minWager || 1}
            winMultiplier={winMultiplier}
          />

          <SceneContainer
            className={cn(
              "wr-h-[640px] max-md:wr-h-[425px] lg:wr-py-12 wr-relative"
            )}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <Roll.Game {...props}>
              <Roll.LastBets />
              <Roll.GameArea {...props} />
              <Roll.RollController
                multiplier={winMultiplier}
                winChance={winChance}
              />
            </Roll.Game>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default RollTemplate;
