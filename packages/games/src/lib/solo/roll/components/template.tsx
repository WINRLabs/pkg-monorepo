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
import { cn } from '../../../utils/style';
import { toDecimals } from '../../../utils/web3';
import { Roll } from '..';
import { ALL_DICES, LUCK_MULTIPLIER, MIN_BET_COUNT } from '../constant';
import { DICE, RollFormFields, RollGameResult } from '../types';
import { BetController } from './bet-controller';
import { RollGameProps } from './game';

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
  onLogin?: () => void;
};

const RollTemplate = ({ ...props }: TemplateProps) => {
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
    betCount: z.number().min(MIN_BET_COUNT, { message: 'Minimum bet count is 0' }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
    dices: z
      .array(z.nativeEnum(DICE))
      .nonempty()
      .min(1, {
        message: 'You have to select at least one dice.',
      })
      .max(5, {
        message: 'You can select up to 5 dices.',
      }),
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
      dices: [],
    },
  });

  const dices = form.watch('dices');

  const { winMultiplier, winChance } = React.useMemo(() => {
    if (!dices.length)
      return {
        winChance: 0,
        winMultiplier: 0,
      };

    return {
      winMultiplier: toDecimals((ALL_DICES.length / dices.length) * LUCK_MULTIPLIER, 4),
      winChance: toDecimals((dices.length * 100) / ALL_DICES.length, 2),
    };
  }, [dices]);

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

  const processStrategy = (result: RollGameResult[]) => {
    const payout = result[0]?.payoutInUsd || 0;
    console.log(result, 'result');
    const p = strategist.process(parseToBigInt(wager, 8), parseToBigInt(payout, 8));
    const newWager = Number(p.wager) / 1e8;
    const currentBalance = balanceAsDollar - wager + payout;

    if (currentBalance < wager) {
      setIsAutoBetMode(false);
      props.onAnimationCompleted && props.onAnimationCompleted(result);
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
            winMultiplier={winMultiplier}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onLogin={props.onLogin}
          />

          <SceneContainer
            className={cn('wr-h-[640px] max-md:wr-h-[360px] lg:wr-py-12 wr-relative')}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <Roll.Game {...props}>
              <Roll.LastBets />
              <Roll.GameArea
                {...props}
                processStrategy={processStrategy}
                isAutoBetMode={isAutoBetMode}
                onAutoBetModeChange={setIsAutoBetMode}
              />
              <Roll.RollController multiplier={winMultiplier} winChance={winChance} />
            </Roll.Game>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default RollTemplate;
