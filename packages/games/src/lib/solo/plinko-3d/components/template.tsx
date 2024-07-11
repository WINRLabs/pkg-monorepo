"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { UnityGameContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { Plinko3d, Plinko3dFormFields } from "..";
import { Plinko3dGameProps } from "./game";

const MIN_BET_COUNT = 1 as const;

const MAX_BET_COUNT = 100 as const;

type TemplateOptions = {
  scene?: {
    loader: string;
  };
  betController: {
    logo: string;
  };
};

type TemplateProps = Plinko3dGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  buildedGameUrl: string;
  onSubmitGameForm: (data: Plinko3dFormFields) => void;
  onFormChange?: (fields: Plinko3dFormFields) => void;
};

export function PlinkoGame({ ...props }: TemplateProps) {
  const [count, setCount] = React.useState(0);

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
    plinkoSize: z.number().min(6).max(12),
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
      plinkoSize: 10,
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
        <UnityGameContainer className="wr-flex wr-overflow-hidden wr-relative  wr-rounded-xl wr-border wr-border-zinc-800 max-lg:wr-flex-col-reverse lg:wr-h-[640px]">
          <Plinko3d.Game {...props}>
            <Plinko3d.BetController
              count={count}
              maxWager={props?.maxWager || 2000}
              minWager={props?.minWager || 1}
              logo={props.options.betController.logo}
            />
            <Plinko3d.Scene
              {...props}
              loader={props.options.scene?.loader}
              count={count}
              setCount={setCount}
            />
            <div className="wr-absolute wr-top-0 wr-z-10 wr-h-full wr-w-full" />
          </Plinko3d.Game>
        </UnityGameContainer>
      </form>
    </Form>
  );
}
