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
import { MULTIPLIER_BANKER, MULTIPLIER_PLAYER, MULTIPLIER_TIE } from '../constants';
import {
  BaccaratBetType,
  BaccaratFormFields,
  BaccaratGameProps,
  BaccaratGameResult,
  BaccaratGameSettledResult,
} from '../types';
import { BaccaratScene } from './baccarat-scene';
import { BetController } from './bet-controller';
import Control from './control';

type TemplateProps = BaccaratGameProps & {
  minWager?: number;
  maxWager?: number;

  onSubmitGameForm: (data: BaccaratFormFields) => void;
  onFormChange?: (fields: BaccaratFormFields) => void;

  onError?: (e: any) => void;
  onLogin?: () => void;
};

const BaccaratTemplate: React.FC<TemplateProps> = ({
  minWager,
  maxWager,

  baccaratResults,
  baccaratSettledResults,

  onAnimationCompleted = () => {},
  onSubmitGameForm,
  onFormChange,
  onError,
  onLogin,
}) => {
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const [maxPayout, setMaxPayout] = React.useState<number>(0);
  const [isAutoBetMode, setIsAutoBetMode] = React.useState<boolean>(false);

  const [isGamePlaying, setIsGamePlaying] = React.useState<boolean>(false);

  const [lastSelections, setLastSelections] = React.useState<
    {
      type: BaccaratBetType;
      wager: number;
    }[]
  >([]);

  const [selectedChip, setSelectedChip] = React.useState<Chip>(Chip.ONE);
  const [results, setResults] = React.useState<BaccaratGameResult | null>(null);
  const [settled, setSettled] = React.useState<BaccaratGameSettledResult | null>(null);

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager || 1, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    playerWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    bankerWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    tieWager: z
      .number()
      .min(0, {
        message: `Minimum wager is ${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager || 2000}`,
      }),
    betCount: z.number().min(0, { message: 'Minimum bet count is 0' }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    defaultValues: {
      wager: minWager || 1,
      playerWager: 0,
      bankerWager: 0,
      tieWager: 0,
      betCount: 0,
      increaseOnWin: 0,
      increaseOnLoss: 0,
      stopGain: 0,
      stopLoss: 0,
    },
  });

  const chipEffect = useAudioEffect(SoundEffects.CHIP_EFFECT);

  const wager = form.watch('wager');

  const tieWager = form.watch('tieWager');

  const bankerWager = form.watch('bankerWager');

  const playerWager = form.watch('playerWager');

  const addWager = (wager: Chip, betType: BaccaratBetType) => {
    const _lastSelections = lastSelections;
    chipEffect.play();

    switch (betType) {
      case BaccaratBetType.TIE:
        form.setValue('tieWager', tieWager + wager);

        _lastSelections.push({ type: BaccaratBetType.TIE, wager });

        break;

      case BaccaratBetType.BANKER:
        form.setValue('bankerWager', bankerWager + wager);

        _lastSelections.push({ type: BaccaratBetType.BANKER, wager });

        break;

      case BaccaratBetType.PLAYER:
        form.setValue('playerWager', playerWager + wager);

        _lastSelections.push({ type: BaccaratBetType.PLAYER, wager });

        break;
    }

    setLastSelections([..._lastSelections]);
  };

  const undoBet = () => {
    if (!lastSelections.length) return;

    // get last index
    const lastSelectionIdx = lastSelections.length - 1;

    const lastSelection = lastSelections[lastSelectionIdx];

    // call selected numbers and remove last wager
    if (lastSelection?.type === BaccaratBetType.TIE) {
      form.setValue('tieWager', tieWager - lastSelection.wager);
    }

    if (lastSelection?.type === BaccaratBetType.BANKER) {
      form.setValue('bankerWager', bankerWager - lastSelection.wager);
    }

    if (lastSelection?.type === BaccaratBetType.PLAYER) {
      form.setValue('playerWager', playerWager - lastSelection.wager);
    }

    // remove last selection
    lastSelections.pop();

    setLastSelections([...lastSelections]);
  };

  React.useEffect(() => {
    const tieMaxPayout = tieWager * MULTIPLIER_TIE * wager;

    const bankerMaxPayout = bankerWager * MULTIPLIER_BANKER * wager;

    const playerMaxPayout = playerWager * MULTIPLIER_PLAYER * wager;

    if (tieMaxPayout > bankerMaxPayout && tieMaxPayout > playerMaxPayout)
      setMaxPayout(tieMaxPayout);
    else if (bankerMaxPayout > tieMaxPayout && bankerMaxPayout > playerMaxPayout)
      setMaxPayout(bankerMaxPayout);
    else setMaxPayout(playerMaxPayout);
  }, [bankerWager, playerWager, tieWager, wager]);

  const prepareSubmit = (data: BaccaratFormFields) => {
    setResults(null);
    setSettled(null);
    setIsGamePlaying(true);
    onSubmitGameForm(data);
  };

  React.useEffect(() => {
    baccaratResults && setResults(baccaratResults);
  }, [baccaratResults]);

  React.useEffect(() => {
    baccaratSettledResults && setSettled(baccaratSettledResults);
  }, [baccaratSettledResults]);

  React.useEffect(() => {
    const cb = (formFields: any) => {
      onFormChange && onFormChange(formFields);
    };

    const subscription = form.watch(cb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const totalWager = (bankerWager + tieWager + playerWager) * wager;

  // strategy
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

  const processStrategy = (result: BaccaratGameSettledResult) => {
    const payout = result.payout;
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
          <BetController
            maxWager={maxWager || 2000}
            minWager={minWager || 1}
            isDisabled={isGamePlaying}
            totalWager={totalWager}
            maxPayout={maxPayout}
            selectedChip={selectedChip}
            undoBet={undoBet}
            onSelectedChipChange={setSelectedChip}
            isAutoBetMode={isAutoBetMode}
            onAutoBetModeChange={setIsAutoBetMode}
            onLogin={onLogin}
          />
          <SceneContainer
            className="wr-relative wr-flex wr-h-[340px] lg:wr-h-[640px] wr-overflow-hidden"
            style={{
              backgroundImage: `url(${CDN_URL}/baccarat/baccarat-bg.png)`,
            }}
          >
            <BaccaratScene
              baccaratResults={results}
              baccaratSettled={settled}
              isDisabled={isGamePlaying}
              setIsDisabled={setIsGamePlaying}
              addWager={addWager}
              selectedChip={selectedChip}
              onAnimationCompleted={onAnimationCompleted}
              processStrategy={processStrategy}
              onSubmitGameForm={prepareSubmit}
              isAutoBetMode={isAutoBetMode}
              onAutoBetModeChange={setIsAutoBetMode}
            />
            <Control
              totalWager={totalWager}
              isDisabled={isGamePlaying}
              undoBet={undoBet}
              reset={form.reset}
              variant="overlay"
            />
            <WinAnimation />
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default BaccaratTemplate;
