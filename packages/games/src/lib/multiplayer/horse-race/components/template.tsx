import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { UnityGameContainer } from "../../../common/containers";
import { Form } from "../../../ui/form";
import { Horse, horseMultipliers } from "../constants";
import useHorseRaceGameStore from "../store";
import { HorseRaceFormFields } from "../types";
import { HorseRaceBetController } from "./bet-controller";
import LastBets from "./last-bets";
import { RacingScene } from "./racing-scene";
import SelectedHorseDetail from "./selected-horse-detail";

type TemplateOptions = {
  scene?: {
    loader?: string;
    logo?: string;
  };
};

type TemplateProps = {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  currentAccount: `0x${string}`;
  onSubmitGameForm: (props: HorseRaceFormFields) => void;
  onFormChange?: (fields: HorseRaceFormFields) => void;
  onComplete?: () => void;
  buildedGameUrl: string;
};

const HorseRaceTemplate = (props: TemplateProps) => {
  const { selectedHorse: participants } = useHorseRaceGameStore([
    "selectedHorse",
  ]);

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 2, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    horse: z.nativeEnum(Horse),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "all",
    defaultValues: {
      wager: 2,
      horse: Horse.IDLE,
    },
  });

  const selectedHorse = form.watch("horse");

  const currentWager = form.watch("wager");

  const maxPayout = horseMultipliers[selectedHorse] * currentWager;

  const isGamblerParticipant = React.useMemo(() => {
    if (
      participants["15x"].find((p) => p.name === props.currentAccount) ||
      participants["2x"].find((p) => p.name === props.currentAccount) ||
      participants["3x"].find((p) => p.name === props.currentAccount) ||
      participants["60x"].find((p) => p.name === props.currentAccount) ||
      participants["8x"].find((p) => p.name === props.currentAccount)
    )
      return true;
    else return false;
  }, [participants]);

  const onComplete = React.useCallback(() => {
    props.onComplete && props.onComplete();
  }, [props.onComplete]);

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
          <UnityGameContainer
            className="wr-relative wr-h-[840px] wr-overflow-hidden wr-rounded-xl wr-border wr-border-zinc-800 md:!wr-h-[700px]"
            id="animationScene"
          >
            <HorseRaceBetController
              minWager={props?.minWager || 2}
              maxWager={props?.maxWager || 2000}
              maxPayout={maxPayout}
              isGamblerParticipant={isGamblerParticipant}
              logo={props.options.scene?.logo}
            />
            <LastBets />
            <RacingScene
              onComplete={onComplete}
              buildedGameUrl={props.buildedGameUrl}
              loaderImg={props.options.scene?.loader}
            />
            <div className="wr-absolute wr-top-0 wr-z-10 wr-h-full wr-w-full md:wr-bg-unity-overlay" />
            <SelectedHorseDetail />
          </UnityGameContainer>
        </form>
      </Form>
    </>
  );
};

export default HorseRaceTemplate;
