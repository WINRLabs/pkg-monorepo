'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { WinAnimation } from '../../../common/win-animation';
import { Form } from '../../../ui/form';
import { Tower } from '..';
import { TowerGameProps } from './game';

export type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
    gemImage?: string;
    bombImage?: string;
    logo?: string;
    cell?: string;
    bombCell?: string;
    selectedCell?: string;
    cellBomb?: string;
    cellCoin?: string;
    cellHover?: string;
    hoverRowCell?: string;
    gameBg?: string;
  };
};

type TemplateProps = TowerGameProps & {
  options?: TemplateOptions;
  // minWager?: number;
  // maxWager?: number;
  // onSubmitGameForm: (data: TowerFormField) => void;
  // onFormChange?: (fields: TowerFormField) => void;
  // onAutoBetModeChange?: (isAutoBetMode: boolean) => void;
  // onLogin?: () => void;
};

const TowerTemplate = ({ ...props }: TemplateProps) => {
  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);

  const formSchema = z.object({
    wager: z
      .number()
      .min(1, {
        message: `Minimum wager is $1`,
      })
      .max(2000, {
        message: `Maximum wager is $2000`,
      }),
    betCount: z.number().min(0, { message: 'Minimum bet count is 0' }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
    riskLevel: z.string(),
    rows: z.number(),
    numberOfBet: z.number(),
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
      riskLevel: 'easy',
      rows: 8,
      numberOfBet: 1,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => console.log(v))}>
        <GameContainer>
          <Tower.Game {...props}>
            <Tower.Controller
              maxWager={2000}
              minWager={1}
              isAutoBetMode={isAutoBetMode}
              onAutoBetModeChange={setIsAutoBetMode}
            />
            <SceneContainer className="wr-relative md:wr-h-[750px] max-lg:!wr-border-0 !wr-p-0 max-md:wr-bg-transparent">
              <Tower.Scene
                {...props}
                // onSubmitGameForm={() => {}}
                // processStrategy={() => {}}
                // isAutoBetMode={isAutoBetMode}
                // onAutoBetModeChange={setIsAutoBetMode}
              />
              <WinAnimation />
            </SceneContainer>
          </Tower.Game>
        </GameContainer>
      </form>
    </Form>
  );
};

export default TowerTemplate;
