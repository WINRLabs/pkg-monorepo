import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { GameContainer, SceneContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { WheelColor } from "../constants";
import { WheelFormFields } from "../types";
import BetController from "./bet-controller";
import LastBets from "./last-bet";
import WheelParticipants from "./wheel-participants";
import { WheelScene } from "./wheel-scene";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: WheelFormFields) => void;
  onFormChange?: (fields: WheelFormFields) => void;
  onComplete?: () => void;
};

const WheelTemplate = (props: TemplateProps) => {
  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 1, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    color: z.nativeEnum(WheelColor),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "onSubmit",
    defaultValues: {
      wager: 2,
      color: WheelColor.IDLE,
    },
  });

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onComplete = React.useCallback(() => {
    props.onComplete && props.onComplete();
  }, [props.onComplete]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <GameContainer>
          <BetController
            maxWager={props?.maxWager || 2000}
            minWager={props?.minWager || 1}
          />
          <SceneContainer className="wr-h-[640px] max-md:wr-h-[480px] lg:wr-p-[14px]">
            <LastBets />
            <WheelScene onComplete={onComplete} />
            <WheelParticipants />
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default WheelTemplate;
