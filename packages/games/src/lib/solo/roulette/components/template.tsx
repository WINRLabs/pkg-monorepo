'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Chip } from '../../../common/chip-controller/types';
import { GameContainer, SceneContainer } from '../../../common/containers';
import { WinAnimation } from '../../../common/win-animation';
import { CDN_URL } from '../../../constants';
import { useGameOptions } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { useStrategist } from '../../../hooks/use-strategist';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { Roulette } from '..';
import {
  chunkMinWagerIndexes,
  MAX_BET_COUNT,
  MIN_BET_COUNT,
  minWagerMultiplierForSideBets,
  NUMBER_INDEX_COUNT,
} from '../constants';
import { RouletteFormFields, RouletteGameProps, RouletteGameResult } from '../types';
import { MobileController } from './mobile-controller';
import debug from 'debug';

const log = debug('worker:RouletteTemplate');

type TemplateProps = RouletteGameProps & {
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: RouletteFormFields) => void;
  onFormChange?: (fields: RouletteFormFields) => void;
  onError?: (e: any) => void;
  onLogin?: () => void;
};

const RouletteTemplate: React.FC<TemplateProps> = ({
  gameResults,
  minWager,
  maxWager,
  onSubmitGameForm,
  onFormChange,
  onAnimationCompleted,
  onAnimationSkipped,
  onAnimationStep,
  onError,
  onLogin,
}) => {
  const [selectedChip, setSelectedChip] = React.useState<Chip>(Chip.ONE);
  const [isPrepared, setIsPrepared] = React.useState<boolean>(false);
  const [lastSelecteds, setLastSelecteds] = React.useState<
    {
      index: number;
      wager: number;
    }[]
  >([]);

  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;
  const chipEffect = useAudioEffect(SoundEffects.CHIP_EFFECT);

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager || 1, {
        message: `Minimum wager is $${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is $${maxWager || 2000}`,
      }),
    selectedNumbers: z.array(z.number()),
    totalWager: z
      .number()
      .min(1, {
        message: `Minimum wager is $${minWager}`,
      })
      .max(2000, {
        message: `Maximum wager is $${maxWager}`,
      }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
    betCount: z
      .number()
      .min(MIN_BET_COUNT, { message: `Minimum bet count is ${MIN_BET_COUNT}` })
      .max(MAX_BET_COUNT, {
        message: `Maximum bet count is ${MAX_BET_COUNT}`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    defaultValues: {
      wager: 1,
      totalWager: 0,
      betCount: 0,
      stopGain: 0,
      stopLoss: 0,
      increaseOnWin: 0,
      increaseOnLoss: 0,
      selectedNumbers: new Array(NUMBER_INDEX_COUNT).fill(0),
    },
  });

  const selectedNumbers = form.watch('selectedNumbers');

  const addWager = (n: number, wager: Chip) => {
    const _selectedNumbers = [...selectedNumbers];

    let newWager = 0;

    // min wager for side bets
    if (chunkMinWagerIndexes.includes(n)) {
      const amount = _selectedNumbers[n] as number;

      if ((wager == Chip.ONE || wager == Chip.TWO) && amount < 10) {
        newWager = minWagerMultiplierForSideBets;
      } else {
        newWager = amount + wager;
      }
    } else {
      newWager = (_selectedNumbers[n] as number) + wager;
    }

    const totalWager = _selectedNumbers.reduce((acc, cur) => acc + cur, 0);

    _selectedNumbers[n] = newWager;

    const currentBalance = account?.balanceAsDollar || 0;
    const chipAmount = form.watch('wager');

    if (totalWager * chipAmount > currentBalance) {
      return;
    } else {
      form.setValue('selectedNumbers', [..._selectedNumbers]);
      form.setValue('totalWager', totalWager + 1);

      // set last selected for undo bet
      const _ls = lastSelecteds;

      _ls.push({ index: n, wager });

      setLastSelecteds([..._ls]);

      chipEffect.play();
    }
  };

  const undoBet = () => {
    if (!lastSelecteds.length) return;

    // get last index
    const _ls = lastSelecteds[lastSelecteds.length - 1] as {
      index: number;
      wager: number;
    };

    // call selected numbres and remove last wager
    const _sn = selectedNumbers;

    const _nw = (_sn[_ls.index] as number) - _ls?.wager;

    _sn[_ls.index] = _nw;

    form.setValue('selectedNumbers', [..._sn]);

    // remove last items
    lastSelecteds.pop();

    setLastSelecteds([...lastSelecteds]);
  };

  const prepareSubmit = async (data: RouletteFormFields) => {
    setIsPrepared(true);
    onSubmitGameForm(data);
  };

  React.useEffect(() => {
    const cb = (formFields: any) => {
      onFormChange && onFormChange(formFields);
    };

    const subscription = form.watch(cb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // strategy
  const wager = form.watch('wager');
  const totalWager = form.watch('totalWager');
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

  const processStrategy = (result: RouletteGameResult[]) => {
    const payout = result[0]?.payoutInUsd || 0;
    log(result, 'result');
    const p = strategist.process(parseToBigInt(wager, 8), parseToBigInt(payout, 8));
    const newWager = Number(p.wager) / 1e8;
    const currentBalance = balanceAsDollar - totalWager + payout;

    if (currentBalance < totalWager) {
      setIsAutoBetMode(false);
      onError && onError(`Oops, you are out of funds. \n Deposit more funds to continue playing.`);
      return;
    }

    if (newWager < (minWager || 0)) {
      form.setValue('wager', minWager || 0);
      return;
    }

    if (newWager > (maxWager || 0)) {
      form.setValue('wager', maxWager || 0);
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
      <form onSubmit={form.handleSubmit(prepareSubmit)}>
        <GameContainer className="wr-relative wr-overflow-hidden wr-pt-0">
          <Roulette.BetController
            isPrepared={isPrepared}
            selectedChip={selectedChip}
            onSelectedChipChange={setSelectedChip}
            undoBet={undoBet}
            minWager={minWager || 1}
            maxWager={maxWager || 2000}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onLogin={onLogin}
          />
          <SceneContainer
            style={{
              backgroundImage: `url(${CDN_URL}/roulette/roulette-bg.png)`,
            }}
            className="wr-relative wr-flex wr-h-[625px] md:wr-h-[640px] wr-flex-col wr-items-center wr-justify-start wr-gap-8 wr-bg-center wr-pb-20 wr-pt-6 wr-overflow-hidden"
          >
            <Roulette.Game gameResults={gameResults}>
              <Roulette.Scene
                isPrepared={isPrepared}
                setIsPrepared={setIsPrepared}
                onAnimationCompleted={onAnimationCompleted}
                onAnimationSkipped={onAnimationSkipped}
                onAnimationStep={onAnimationStep}
                processStrategy={processStrategy}
                onSubmitGameForm={prepareSubmit}
                isAutoBetMode={isAutoBetMode}
                onAutoBetModeChange={setIsAutoBetMode}
              />
              <Roulette.Table
                addWager={addWager}
                winningNumber={null}
                selectedChip={selectedChip}
                isPrepared={isPrepared || isAutoBetMode}
              />
              <Roulette.LastBets />
              <MobileController
                isPrepared={isPrepared}
                undoBet={undoBet}
                isAutoBetMode={isAutoBetMode}
              />
            </Roulette.Game>
            <WinAnimation />
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default RouletteTemplate;
