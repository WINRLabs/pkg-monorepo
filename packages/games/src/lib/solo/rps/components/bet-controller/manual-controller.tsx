'use client';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { ALL_RPS_CHOICES, rpsChoiceMap } from '../../constant';
import useRpsGameStore from '../../store';
import { RockPaperScissors, RPSForm } from '../../types';
import { BetLoader } from './bet-loader';

interface BetControllerProps {
  minWager: number;
  maxWager: number;
  winMultiplier: number;
  onLogin?: () => void;
}

export const RPSChoiceRadio: React.FC<{
  choice: RockPaperScissors;
  disabled?: boolean;
}> = ({ choice, disabled = false }) => {
  return (
    <RadioGroupPrimitive.Item
      disabled={disabled}
      value={choice}
      className="wr-flex wr-h-9 wr-w-full wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-md wr-bg-zinc-800 wr-text-center data-[state=checked]:wr-bg-red-600 hover:wr-bg-red-600"
    >
      <FormLabel className="wr-mb-0 wr-cursor-pointer  wr-justify-center wr-text-base wr-font-semibold wr-leading-4 wr-text-white">
        <img alt="icon_item" src={rpsChoiceMap[choice].icon} width={20} height={20} />
        {rpsChoiceMap[choice].label}
      </FormLabel>
    </RadioGroupPrimitive.Item>
  );
};

export const ManualController: React.FC<BetControllerProps> = ({
  minWager,
  maxWager,
  winMultiplier,
  onLogin,
}) => {
  const form = useFormContext() as RPSForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.LIMBO_TICK);

  const maxPayout = React.useMemo(() => {
    const { wager } = form.getValues();

    return toDecimals(wager * winMultiplier, 2);
  }, [form.getValues().wager, winMultiplier]);

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} />
      <FormField
        control={form.control}
        name="rpsChoice"
        render={({ field }) => (
          <FormItem className="wr-mb-3 lg:wr-mb-6">
            <FormControl>
              <RadioGroupPrimitive.Root
                {...field}
                onValueChange={(e) => {
                  digitalClickEffect.play();
                  field.onChange(e);
                }}
                className="wr-grid wr-w-full wr-grid-cols-3 wr-grid-rows-1 wr-items-center wr-justify-between wr-gap-1"
              >
                {ALL_RPS_CHOICES.map((item) => (
                  <FormItem className="wr-mb-0 wr-cursor-pointer" key={item}>
                    <FormControl>
                      <RPSChoiceRadio choice={item} />
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroupPrimitive.Root>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="wr-mb-6 lg:!wr-grid-cols-2 wr-gap-2 wr-hidden">
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
          <TotalWager betCount={1} wager={form.getValues().wager} />
        </div>
      </div>
      <PreBetButton onLogin={onLogin}>
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
          {form.formState.isSubmitting || form.formState.isLoading ? <BetLoader /> : 'Bet'}
        </Button>
      </PreBetButton>
    </>
  );
};
