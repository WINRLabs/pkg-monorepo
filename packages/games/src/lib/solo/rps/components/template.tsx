'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { useGameOptions } from '../../../game-provider';
import { useStrategist } from '../../../hooks/use-strategist';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { Rps } from '..';
import { RockPaperScissors, RpsFormFields, RPSGameResult } from '../types';
import { BetController } from './bet-controller';
import { RpsGameProps } from './game';

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = RpsGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: RpsFormFields) => void;
  onFormChange?: (fields: RpsFormFields) => void;

  onError?: (e: any) => void;
  onLogin?: () => void;
};

const RpsTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...props.options };
  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);
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
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
    rpsChoice: z.nativeEnum(RockPaperScissors),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'all',
    defaultValues: {
      wager: props?.minWager || 1,
      betCount: 0,
      stopGain: 0,
      stopLoss: 0,
      increaseOnWin: 0,
      increaseOnLoss: 0,
      rpsChoice: RockPaperScissors.ROCK,
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
    isAutoBetMode,
  });

  const processStrategy = (result: RPSGameResult[]) => {
    const payout = result[0]?.payoutInUsd || 0;
    const p = strategist.process(parseToBigInt(wager, 8), parseToBigInt(payout, 8));
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <GameContainer>
          <BetController
            maxWager={props?.maxWager || 2000}
            minWager={props?.minWager || 1}
            winMultiplier={1.96}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onLogin={props.onLogin}
          />
          <SceneContainer
            className="wr-relative wr-h-[640px] wr-overflow-hidden !wr-p-0 max-md:wr-h-[300px]"
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <Rps.Game {...props}>
              <Rps.LastBets />
              <Rps.Scene
                {...props}
                processStrategy={processStrategy}
                isAutoBetMode={isAutoBetMode}
                onAutoBetModeChange={setIsAutoBetMode}
              />
            </Rps.Game>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default RpsTemplate;
