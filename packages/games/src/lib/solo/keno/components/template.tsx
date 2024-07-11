"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { GameContainer, SceneContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { Keno, KenoFormField } from "..";
import { KenoGameProps } from "./game";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = KenoGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: KenoFormField) => void;
  onFormChange?: (fields: KenoFormField) => void;
};

const KenoTemplate = ({ ...props }: TemplateProps) => {
  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 1, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    betCount: z.number().min(1, { message: "Minimum bet count is 1" }).max(3, {
      message: "Maximum bet count is 3",
    }),
    selections: z.array(z.number()),
    stopGain: z.number(),
    stopLoss: z.number(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "onSubmit",
    defaultValues: {
      wager: props.minWager || 1,
      betCount: 1,
      stopGain: 0,
      stopLoss: 0,
      selections: [],
    },
  });

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
          <Keno.Game {...props}>
            <Keno.Controller
              maxWager={props?.maxWager || 2000}
              minWager={props?.minWager || 1}
            />
            <SceneContainer className="wr-relative sm:wr-h-[790px] lg:wr-px-[14px] lg:wr-pb-[14px]">
              <Keno.Scene {...props} />
            </SceneContainer>
          </Keno.Game>
        </GameContainer>
      </form>
    </Form>
  );
};

export default KenoTemplate;
