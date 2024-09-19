import { zodResolver } from '@hookform/resolvers/zod';
import debug from 'debug';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { useGameOptions } from '../../../game-provider';
import { useStrategist } from '../../../hooks/use-strategist';
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

  maxPayout?: {
    label?: string;
    icon?: string;
  };

  controllerHeader?: React.ReactNode;
  hideTabs?: boolean;

  /**
   * @default '$'
   */
  tokenPrefix?: string;
};

type TemplateProps = PlinkoGameProps & {
  options: PlinkoTemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: PlinkoFormFields) => void;
  onFormChange?: (fields: PlinkoFormFields) => void;
  onAutoBetModeChange?: (isAutoBetMode: boolean) => void;
  onLogin?: () => void;
};

const PlinkoTemplate = ({ ...props }: TemplateProps) => {
  const options = { ...props.options };
  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);
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
    plinkoSize: z.number().min(6).max(12),
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

  const strategist = useStrategist({
    wager,
    increasePercentageOnLoss,
    increasePercentageOnWin,
    stopLoss,
    stopProfit,
    isAutoBetMode,
  });

  const processStrategy = (result: PlinkoGameResult[]) => {
    const payout = result[0]?.payoutInUsd || 0;
    log(result, 'result');
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
            onLogin={props.onLogin}
            hideWager={props.options.hideWager}
            disableAuto={props.options.disableAuto}
            disableStrategy={props.options.disableStrategy}
            hideTotalWagerInfo={props.options.hideTotalWagerInfo}
            maxPayout={props.options.maxPayout}
            controllerHeader={props.options.controllerHeader}
            hideTabs={props.options.hideTabs}
            tokenPrefix={props.options.tokenPrefix}
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
