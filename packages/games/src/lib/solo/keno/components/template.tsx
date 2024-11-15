'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { WinAnimation } from '../../../common/win-animation';
import { useGameOptions } from '../../../game-provider';
import { useCustomBetStrategist } from '../../../hooks/use-custom-bet-strategist';
import { useAutoBetStrategist } from '../../../hooks/use-strategist';
import { WAGER_PRECISION } from '../../../strategist';
import { BetMode, StrategyProps } from '../../../types';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { Keno, KenoFormField, KenoGameResult } from '..';
import { KenoGameProps } from './game';

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = KenoGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  strategy: StrategyProps;
  onSubmitGameForm: (data: KenoFormField) => void;
  onFormChange?: (fields: KenoFormField) => void;
  onAutoBetModeChange?: (isAutoBetMode: boolean) => void;
  onLogin?: () => void;
};

const KenoTemplate = ({ ...props }: TemplateProps) => {
  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);
  const [betMode, setBetMode] = React.useState<BetMode>('MANUAL');
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 1, {
        message: `Minimum wager is $${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is $${props?.maxWager}`,
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
      wager: 1,
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

  const autoBetStrategist = useAutoBetStrategist({
    wager,
    increasePercentageOnLoss,
    increasePercentageOnWin,
    stopLoss,
    stopProfit,
    isAutoBetMode,
  });

  const { strategist: customBetStrategist } = useCustomBetStrategist({
    wager,
    isAutoBetMode,
    createdStrategies: props.strategy.createdStrategies,
  });

  const processStrategy = (result: KenoGameResult[]) => {
    if (betMode == 'MANUAL') return;
    let p;
    const payout = result[0]?.settled.payoutsInUsd || 0;

    if (betMode == 'AUTO') {
      p = autoBetStrategist.process(
        parseToBigInt(wager, WAGER_PRECISION),
        parseToBigInt(payout, WAGER_PRECISION)
      );
    } else {
      p = customBetStrategist.process(
        parseToBigInt(wager, WAGER_PRECISION),
        parseToBigInt(payout, WAGER_PRECISION)
      );
    }

    const newWager = Number(p.wager) / 1e8;
    const currentBalance = balanceAsDollar - wager + payout;

    if (currentBalance < wager) {
      setIsAutoBetMode(false);
      props?.onError &&
        props.onError(`Oops, you are out of funds. \n Deposit more funds to continue playing.`);
      return;
    }

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
    props.onAutoBetModeChange?.(isAutoBetMode);
  }, [isAutoBetMode]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => props.onSubmitGameForm(v))}>
        <GameContainer>
          <Keno.Game {...props}>
            <Keno.Controller
              maxWager={props?.maxWager || 2000}
              minWager={props?.minWager || 1}
              isAutoBetMode={isAutoBetMode}
              onAutoBetModeChange={setIsAutoBetMode}
              onLogin={props.onLogin}
              onBetModeChange={setBetMode}
              strategy={props.strategy}
            />
            <SceneContainer className="wr-relative md:wr-h-[750px] lg:wr-px-[14px] lg:wr-pb-[14px] max-lg:!wr-border-0 max-lg:!wr-p-0 max-md:wr-bg-transparent">
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
