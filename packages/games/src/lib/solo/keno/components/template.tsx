'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'debounce';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { WinAnimation } from '../../../common/win-animation';
import { Form } from '../../../ui/form';
import { Keno, KenoFormField, KenoGameResult } from '..';
import { KenoGameProps } from './game';
import { useStrategist } from '../../../hooks/use-strategist';
import { parseToBigInt } from '../../../utils/number';
import { useGameOptions } from '../../../game-provider';
import { useToast } from '../../../hooks/use-toast';

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
  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 1, {
        message: `Minimum wager is ${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is ${props?.maxWager}`,
      }),
    betCount: z.number().min(0, { message: 'Minimum bet count is 0' }),
    selections: z.array(z.number()),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'onSubmit',
    defaultValues: {
      wager: props.minWager || 1,
      betCount: 0,
      stopGain: 0,
      stopLoss: 0,
      increaseOnLoss: 0,
      increaseOnWin: 0,
      selections: [],
    },
  });

  React.useEffect(() => {
    const cb = (formFields: any) => {
      props?.onFormChange && props.onFormChange(formFields);
    };

    const subscription = form.watch(cb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // strategy
  const wager = form.watch('wager');
  const increasePercentageOnWin = form.watch('increaseOnWin');
  const increasePercentageOnLoss = form.watch('increaseOnLoss');
  const stopProfit = form.watch('stopGain');
  const stopLoss = form.watch('stopLoss');

  const strategist = useStrategist({
    wager,
    increasePercentageOnLoss,
    increasePercentageOnWin,
    stopLoss,
    stopProfit,
  });

  const processStrategy = (result: KenoGameResult[]) => {
    const payout = result[0]?.settled.payoutsInUsd || 0;
    const p = strategist.process(parseToBigInt(wager, 8), parseToBigInt(payout, 8));
    const newWager = Number(p.wager) / 1e8;

    if (newWager < (props.minWager || 0)) {
      form.setValue('wager', props.minWager || 0);
      return;
    }

    if (newWager > (props.maxWager || 0)) {
      form.setValue('wager', props.maxWager || 0);
      return;
    }

    if (p.action && !p.action.isStop()) {
      form.setValue('wager', newWager);
    }

    if (p.action && p.action.isStop()) {
      setIsAutoBetMode(false);
      return;
    }
  };

  React.useEffect(() => {
    if (balanceAsDollar < wager) {
      setIsAutoBetMode(false);
      toast({
        title: 'Oops, you are out of funds.',
        description: 'Deposit more funds to continue playing.',
        variant: 'error',
      });
    }
  }, [wager, balanceAsDollar]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <GameContainer>
          <Keno.Game {...props}>
            <Keno.Controller
              maxWager={props?.maxWager || 2000}
              minWager={props?.minWager || 1}
              isAutoBetMode={isAutoBetMode}
              onAutoBetModeChange={setIsAutoBetMode}
            />
            <SceneContainer className="wr-relative md:wr-h-[750px] lg:wr-px-[14px] lg:wr-pb-[14px] max-lg:!wr-border-0 max-lg:!wr-p-0">
              <Keno.Scene
                {...props}
                processStrategy={processStrategy}
                isAutoBetMode={isAutoBetMode}
                onAutoBetModeChange={setIsAutoBetMode}
              />
              <WinAnimation />
            </SceneContainer>
          </Keno.Game>
        </GameContainer>
      </form>
    </Form>
  );
};

export default KenoTemplate;
