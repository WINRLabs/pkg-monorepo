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
import { CoinFlip, CoinFlipFormFields, CoinFlipGameResult } from '..';
import { CoinSide, MAX_BET_COUNT, MIN_BET_COUNT, WIN_MULTIPLIER } from '../constants';
import { BetController } from './bet-controller';
import { CoinFlipGameProps } from './game';

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = CoinFlipGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: CoinFlipFormFields) => void;
  onFormChange?: (fields: CoinFlipFormFields) => void;
  isGettingResult?: boolean;
};

const CoinFlipTemplate = ({ ...props }: TemplateProps) => {
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
    betCount: z
      .number()
      .min(MIN_BET_COUNT, { message: 'Minimum bet count is 0' })
      .max(MAX_BET_COUNT, {
        message: 'Maximum bet count is 100',
      }),
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
      wager: props?.minWager || 1,
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

  const strategist = useStrategist({
    wager,
    increasePercentageOnLoss,
    increasePercentageOnWin,
    stopLoss,
    stopProfit,
  });

  const processStrategy = (result: CoinFlipGameResult[]) => {
    const payout = result[0]?.payoutInUsd || 0;
    console.log(result, 'result');
    const p = strategist.process(parseToBigInt(wager, 8), parseToBigInt(payout, 8));
    const newWager = Number(p.wager) / 1e8;
    if (p.action && !p.action.isStop()) {
      form.setValue('wager', newWager);
    }

    if (p.action && p.action.isStop()) {
      setIsAutoBetMode(false);
      return;
    }

    if (newWager < (props.minWager || 0) || balanceAsDollar < newWager) {
      setIsAutoBetMode(false);
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
        <GameContainer>
          <BetController
            minWager={props.minWager || 1}
            maxWager={props.maxWager || 2000}
            winMultiplier={WIN_MULTIPLIER}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
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
