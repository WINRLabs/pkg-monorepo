import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { UnityGameContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { CoinFlip3D } from "..";
import { COIN_SIDE, MAX_BET_COUNT_3D, MIN_BET_COUNT_3D } from "../constants";
import { CoinFlip3dFormFields } from "../types";
import { BetController } from "./bet-controller";
import { CoinFlip3dGameProps } from "./game";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
    loader?: string;
    logo?: string;
  };
};

type TemplateProps = CoinFlip3dGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  winMultiplier?: number;
  onSubmitGameForm: (data: CoinFlip3dFormFields) => void;
  onFormChange?: (fields: CoinFlip3dFormFields) => void;
  buildedGameUrl: string;
};

export const CoinFlipTemplate = ({ ...props }: TemplateProps) => {
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
      .min(MIN_BET_COUNT_3D, { message: "Minimum bet count is 1" })
      .max(MAX_BET_COUNT_3D, {
        message: "Maximum bet count is 100",
      }),
    stopGain: z.number(),
    stopLoss: z.number(),
    coinSide: z.nativeEnum(COIN_SIDE),
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
      coinSide: COIN_SIDE.ETH,
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
        <UnityGameContainer className="wr-flex wr-overflow-hidden wr-rounded-xl wr-border wr-border-zinc-800 max-lg:wr-flex-col-reverse lg:wr-h-[640px]">
          <BetController
            maxWager={props?.maxWager || 2000}
            minWager={props?.minWager || 1}
            winMultiplier={props?.winMultiplier || 1}
            logo={props.options.scene?.logo || ""}
          />
          <CoinFlip3D.Game {...props}>
            <CoinFlip3D.LastBets />
            <CoinFlip3D.Scene
              loader={props.options.scene?.loader || ""}
              {...props}
            />
            <div className="wr-hidden lg:wr-block">
              <CoinFlip3D.Controller />
            </div>
          </CoinFlip3D.Game>
        </UnityGameContainer>
      </form>
    </Form>
  );
};
