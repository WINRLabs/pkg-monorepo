'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AutoBetCountFormField,
  AutoBetIncreaseOnLoss,
  AutoBetIncreaseOnWin,
  AutoBetStopGainFormField,
  AutoBetStopLossFormField,
  WagerFormField,
} from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { KenoForm } from '../../types';
import useKenoGameStore from '../../store';
import { kenoMultipliers } from '../../constants';
import { IconMagicStick, IconTrash } from '../../../../svgs';

interface AutoControllerProps {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

export const AutoController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  onAutoBetModeChange,
  onLogin,
}: AutoControllerProps) => {
  const form = useFormContext() as KenoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const wager = form.watch('wager');
  const selections = form.watch('selections');

  const { updateKenoGameResults } = useKenoGameStore([
    'gameStatus',
    'updateKenoGameResults',
    'kenoGameResults',
  ]);

  const currentMultipliers = kenoMultipliers[selections.length] || [];
  const maxMultiplier = Math.max(...currentMultipliers);
  const maxPayout = wager * maxMultiplier;

  const clearBetHandler = () => {
    digitalClickEffect.play();
    form.setValue('selections', []);
    updateKenoGameResults([]);
  };

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const autoPickHandler = () => {
    digitalClickEffect.play();
    clearBetHandler();

    var randomNumbers: number[] = [];

    for (var i = 0; i < 10; i++) {
      var randomNumber;

      do {
        randomNumber = getRandomNumber(1, 40);
      } while (randomNumbers.includes(randomNumber));

      randomNumbers.push(randomNumber);
    }

    form.setValue('selections', randomNumbers);
  };

  return (
    <div className="wr-flex wr-flex-col">
      <WagerFormField
        minWager={minWager}
        maxWager={maxWager}
        className="wr-order-0 lg:!wr-mb-3"
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <div className="wr-mb-3 wr-grid wr-grid-cols-2 wr-gap-2">
        <Button
          size={'xl'}
          variant={'secondary'}
          type="button"
          disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          onClick={autoPickHandler}
        >
          <IconMagicStick className="wr-mr-1 wr-h-5 wr-w-5" />
          Auto Pick
        </Button>
        <Button
          size={'xl'}
          variant={'secondary'}
          type="button"
          onClick={clearBetHandler}
          disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        >
          <IconTrash className="wr-mr-1 wr-h-5 wr-w-5" />
          Clear
        </Button>
      </div>

      <div className="wr-order-2 lg:wr-order-none wr-flex wr-gap-2 lg:wr-flex-col lg:wr-gap-0">
        <AutoBetCountFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
        <div className="wr-flex wr-gap-2 md:wr-gap-3">
          <AutoBetIncreaseOnWin
            isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
            showSm
          />
          <AutoBetIncreaseOnLoss
            isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
            showSm
          />
        </div>
      </div>

      <div className="wr-order-3 lg:wr-order-none wr-flex wr-gap-3">
        <AutoBetStopGainFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
        <AutoBetStopLossFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
      </div>

      <PreBetButton onLogin={onLogin} className="wr-mb-3 lg:wr-mb-0">
        <Button
          type={!isAutoBetMode ? 'button' : 'submit'}
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-3 lg:wr-mb-0 wr-order-1 lg:wr-order-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                maxPayout == 0,
            }
          )}
          size={'xl'}
          onClick={() => {
            clickEffect.play();
            onAutoBetModeChange(!isAutoBetMode);
          }}
        >
          {isAutoBetMode ? 'Stop Autobet' : 'Start Autobet'}
        </Button>
      </PreBetButton>
    </div>
  );
};
