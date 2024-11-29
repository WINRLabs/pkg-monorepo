import { zodResolver } from '@hookform/resolvers/zod';
import debug from 'debug';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { useGameOptions } from '../../../game-provider';
import { useCustomBetStrategist } from '../../../hooks/use-custom-bet-strategist';
import { useAutoBetStrategist } from '../../../hooks/use-strategist';
import { WAGER_PRECISION } from '../../../strategist';
import { BetMode, StrategyProps } from '../../../types';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { cn } from '../../../utils/style';
import { Plinko } from '..';
import { MIN_BET_COUNT } from '../constants';
import { PlinkoFormFields, PlinkoGameResult } from '../types';
import { BetController } from './bet-controller';
import { PlinkoGameProps } from './game';

const log = debug('worker:PlinkoTemplate');

export type PlinkoTemplateOptions = {
  scene?: {
    backgroundImage?: string;
    backgroundColor?: string;
  };
  hideWager?: boolean;
  disableAuto?: boolean;
  disableStrategy?: boolean;
  hideTotalWagerInfo?: boolean;
  hideMaxPayout?: boolean;

  /**
   * Row multipliers shown at the buckets.
   */
  rowMultipliers?: {
    [key: number]: number[];
  };

  maxPayout?: {
    label?: string;
    icon?: string;
  };

  controllerHeader?: React.ReactNode;
  controllerFooter?: React.ReactNode;

  hideTabs?: boolean;

  /**
   * @default '$'
   */
  tokenPrefix?: string;

  showBetCount?: boolean;
};

type TemplateProps = PlinkoGameProps & {
  options: PlinkoTemplateOptions;
  minWager?: number;
  maxWager?: number;
  isPinNotFound?: boolean;
  onSubmitGameForm: (data: PlinkoFormFields) => void;
  onFormChange?: (fields: PlinkoFormFields) => void;
  onAutoBetModeChange?: (isAutoBetMode: boolean) => void;
  onLogin?: () => void;

  strategy: StrategyProps;
};

const PlinkoTemplate = ({ ...props }: TemplateProps) => {
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
    betCount: z.number().min(MIN_BET_COUNT, { message: `Minimum bet count is ${MIN_BET_COUNT}` }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
    plinkoSize: z.number().min(6).max(12),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'onSubmit',
    defaultValues: {
      wager: 1,
      betCount: MIN_BET_COUNT,
      stopGain: 0,
      stopLoss: 0,
      increaseOnWin: 0,
      increaseOnLoss: 0,
      plinkoSize: 10,
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

  const processStrategy = (result: PlinkoGameResult[]) => {
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
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onBetModeChange={setBetMode}
            onLogin={props.onLogin}
            scene={options?.scene}
            strategy={props.strategy}
            isPinNotFound={props.isPinNotFound}
            {...props.options}
          />
          <SceneContainer
            className={cn(
              'wr-h-[640px] max-md:wr-h-[350px] lg:wr-py-12 wr-relative !wr-px-4 wr-bg-center'
            )}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
              backgroundColor: options?.scene?.backgroundColor,
            }}
          >
            <Plinko.Body>
              <Plinko.Game {...props}>
                <Plinko.LastBets />
                <Plinko.Canvas
                  {...props}
                  processStrategy={processStrategy}
                  isAutoBetMode={isAutoBetMode}
                  onAutoBetModeChange={setIsAutoBetMode}
                />
              </Plinko.Game>
            </Plinko.Body>
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default PlinkoTemplate;
