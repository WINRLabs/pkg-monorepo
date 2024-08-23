'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { DiceForm } from '../../types';

interface ManualControllerProps {
  winMultiplier: number;
  minWager: number;
  maxWager: number;
}

export const ManualController = ({ winMultiplier, minWager, maxWager }: ManualControllerProps) => {
  const form = useFormContext() as DiceForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const maxPayout = React.useMemo(() => {
    const { wager } = form.getValues();

    return toDecimals(wager * winMultiplier, 2);
  }, [form.getValues().wager, winMultiplier]);

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} />
      <div className="wr-mb-6 lg:!wr-grid wr-grid-cols-2 wr-gap-2 wr-hidden">
        <div>
          <FormLabel>Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]'
            )}
          >
            <WagerCurrencyIcon />
            <span className={cn('wr-font-semibold wr-text-zinc-100')}>
              ${toFormatted(maxPayout, 2)}
            </span>
          </div>
        </div>
        <div>
          <FormLabel>Total Wager</FormLabel>
          <TotalWager betCount={form.getValues().betCount} wager={form.getValues().wager} />
        </div>
      </div>
      <PreBetButton>
        <Button
          type="submit"
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading,
            }
          )}
          size={'xl'}
          onClick={() => clickEffect.play()}
        >
          Bet
        </Button>
      </PreBetButton>
    </>
  );
};