'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import debug from 'debug';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { useGameOptions } from '../../../game-provider';
import { useCustomBetStrategist } from '../../../hooks/use-custom-bet-strategist';
import { useAutoBetStrategist } from '../../../hooks/use-strategist';
import { WAGER_PRECISION } from '../../../strategist';
import { BetMode, StrategyProps } from '../../../types';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { cn } from '../../../utils/style';
import { CoinFlip, CoinFlipFormFields, CoinFlipGameResult } from '..';
import { CoinSide, MIN_BET_COUNT, WIN_MULTIPLIER } from '../constants';
import { BetController } from './bet-controller';
import { CoinFlipGameProps } from './game';

const log = debug('worker:CoinFlipTemplate');

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = CoinFlipGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  isGettingResult?: boolean;
  isPinNotFound?: boolean;
  onSubmitGameForm: (data: CoinFlipFormFields) => void;
  onFormChange?: (fields: CoinFlipFormFields) => void;
  onAutoBetModeChange?: (isAutoBetMode: boolean) => void;
  onError?: (error: any) => void;
  onLogin?: () => void;

  strategy: StrategyProps;
};

const CoinFlipTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...props.options };
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
    coinSide: z.nativeEnum(CoinSide),
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
      coinSide: CoinSide.HEADS,
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

  const processStrategy = (result: CoinFlipGameResult[]) => {
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
            winMultiplier={WIN_MULTIPLIER}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onBetModeChange={setBetMode}
            onLogin={props.onLogin}
            strategy={props.strategy}
            isPinNotFound={props.isPinNotFound}
          />
          <SceneContainer
            className={cn(
              'wr-h-[640px] max-lg:wr-h-[500px] max-md:wr-h-[300px] lg:wr-py-12 wr-relative'
            )}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            <CoinFlip.Body>
              <CoinFlip.Game {...props}>
                <CoinFlip.LastBets />
                <CoinFlip.Coin
                  {...props}
                  processStrategy={processStrategy}
                  isAutoBetMode={isAutoBetMode}
                  onAutoBetModeChange={setIsAutoBetMode}
                />
              </CoinFlip.Game>
            </CoinFlip.Body>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default CoinFlipTemplate;
