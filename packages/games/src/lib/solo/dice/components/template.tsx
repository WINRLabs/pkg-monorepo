'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { cn } from '../../../../lib/utils/style';
import { GameContainer, SceneContainer } from '../../../common/containers';
import { useGameOptions } from '../../../game-provider';
import { useCustomBetStrategist } from '../../../hooks/use-custom-bet-strategist';
import { useAutoBetStrategist } from '../../../hooks/use-strategist';
import { WAGER_PRECISION } from '../../../strategist';
import { BetMode, StrategyProps } from '../../../types';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { toDecimals } from '../../../utils/web3';
import { LUCK_MULTIPLIER, MAX_VALUE, MIN_BET_COUNT, MIN_VALUE } from '../constant';
import { Dice } from '../index';
import { DiceFormFields, DiceGameResult, DiceTemplateOptions } from '../types';
import { BetController } from './bet-controller';
import { RangeGameProps } from './game';

type TemplateProps = RangeGameProps & {
  options: DiceTemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: DiceFormFields) => void;
  onFormChange: (fields: DiceFormFields) => void;
  onAutoBetModeChange?: (isAutoBetMode: boolean) => void;
  onError?: (e: any) => void;
  onLogin?: () => void;

  strategy: StrategyProps;
};

const defaultOptions: DiceTemplateOptions = {
  slider: {
    track: {
      color: '#DC2626',
      activeColor: '#22c55e',
    },
  },
  scene: {
    background: '#111113',
  },
};

const DiceTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...defaultOptions, ...props.options };
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
    betCount: z.number().min(MIN_BET_COUNT, { message: 'Minimum bet count is 0' }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
    rollValue: z.number().min(MIN_VALUE).max(MAX_VALUE),
    rollType: z.enum(['OVER', 'UNDER']),
    winChance: z.number().min(MIN_VALUE).max(MAX_VALUE),
  });

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
      increaseOnWin: 0,
      increaseOnLoss: 0,
      rollType: 'UNDER',
      rollValue: 50,
      winChance: 50,
    },
  });

  const winChance = form.watch('winChance');

  const winMultiplier = useMemo(() => {
    return toDecimals((100 / winChance) * LUCK_MULTIPLIER, 2);
  }, [winChance]);

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

  const processStrategy = (result: DiceGameResult[]) => {
    if (betMode == 'MANUAL') return;
    let p;
    const payout = result[0]?.payoutInUsd || 0;

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

    // EXTERNAL OPTIONS
    if (p.action && p.action.isSwitchOverUnder()) {
      const rollType = form.getValues('rollType');

      form.setValue('rollType', rollType == 'UNDER' ? 'OVER' : 'UNDER');
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
          <BetController
            minWager={props.minWager || 1}
            maxWager={props.maxWager || 2000}
            winMultiplier={winMultiplier}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onBetModeChange={setBetMode}
            onLogin={props.onLogin}
            strategy={props.strategy}
          />
          <SceneContainer
            className={cn(
              'wr-h-[640px] wr-border-none max-md:wr-h-auto max-md:wr-pt-[130px] lg:wr-py-12'
            )}
            style={{ background: options?.scene?.background }}
          >
            <Dice.Game
              {...props}
              processStrategy={processStrategy}
              isAutoBetMode={isAutoBetMode}
              onAutoBetModeChange={setIsAutoBetMode}
            >
              {/* last bets */}
              <div />
              <Dice.Body>
                <Dice.LastBets />
                <Dice.TextRandomizer />
                <Dice.Slider track={options?.slider?.track} />
              </Dice.Body>
              <Dice.Controller disabled={isAutoBetMode} winMultiplier={winMultiplier} />
            </Dice.Game>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default DiceTemplate;
