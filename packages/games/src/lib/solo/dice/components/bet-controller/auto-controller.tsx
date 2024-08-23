'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AutoBetCountFormField,
  AutoBetIncreaseOnLoss,
  AutoBetIncreaseOnWin,
  AutoBetStopGainFormField,
  AutoBetStopLossFormField,
  AutoBetWagerFormField,
} from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { DiceForm } from '../../types';

interface AutoControllerProps {
  winMultiplier: number;
  isGettingResults?: boolean;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AutoController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  onAutoBetModeChange,
}: AutoControllerProps) => {
  const form = useFormContext() as DiceForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  return (
    <>
      <AutoBetWagerFormField
        minWager={minWager}
        maxWager={maxWager}
        className="lg:!wr-mb-3"
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <AutoBetCountFormField
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />
      <AutoBetIncreaseOnWin
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />
      <AutoBetIncreaseOnLoss
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <div className="wr-flex wr-gap-3">
        <AutoBetStopGainFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
        <AutoBetStopLossFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
      </div>

      <PreBetButton>
        <Button
          type={!isAutoBetMode ? 'button' : 'submit'}
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading,
            }
          )}
          size={'xl'}
          onClick={() => {
            clickEffect.play();
            if (!isAutoBetMode) onAutoBetModeChange(true);
            if (isAutoBetMode) onAutoBetModeChange(false);
          }}
        >
          {isAutoBetMode ? 'Stop Autobet' : 'Start Autobet'}
        </Button>
      </PreBetButton>
    </>
  );
};