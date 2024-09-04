'use client';
import * as Slider from '@radix-ui/react-slider';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form';
import { INumberInputContext, NumberInput } from '../../../../ui/number-input';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { rowMultipliers } from '../../constants';
import { PlinkoForm } from '../../types';

interface Props {
  minWager: number;
  maxWager: number;
  onLogin?: () => void;
}

export const ManualController: React.FC<Props> = ({ minWager, maxWager, onLogin }) => {
  const form = useFormContext() as PlinkoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const rowSize = form.watch('plinkoSize');
  const wager = form.watch('wager');

  const maxPayout = React.useMemo(() => {
    const maxMultiplier = isNaN(rowMultipliers?.[rowSize]?.[0] as number)
      ? 0
      : (rowMultipliers?.[rowSize]?.[0] as number);

    return toDecimals(wager * maxMultiplier, 2);
  }, [wager, rowSize]);

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} />
      <PlinkoRowFormField minValue={6} maxValue={12} />
      <div className="wr-mb-6 wr-grid-cols-2 wr-gap-2 lg:!wr-grid wr-hidden">
        <div>
          <FormLabel>Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] wr-overflow-hidden'
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
          Bet
        </Button>
      </PreBetButton>
    </>
  );
};

export const PlinkoRowFormField: React.FC<{
  isDisabled?: boolean;
  minValue?: number;
  maxValue?: number;
  className?: string;
}> = ({ isDisabled, minValue, maxValue, className }) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="plinkoSize"
        render={({ field }) => (
          <FormItem className={cn('wr-mb-3 lg:wr-mb-6', className)}>
            <FormLabel className="wr-leading-4 lg:wr-leading-6 wr-mb-3 lg:wr-mb-[6px]">
              Plinko Row
            </FormLabel>

            <FormControl>
              <div>
                <PlinkoRowInput
                  isDisabled={isDisabled}
                  minValue={minValue}
                  maxValue={maxValue}
                  {...field}
                />
                <PlinkoRowSlider
                  disabled={isDisabled}
                  minValue={minValue}
                  maxValue={maxValue}
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

interface PlinkoRowInputProps extends INumberInputContext {
  className?: string;
  hasError?: boolean;
  containerClassName?: string;
}

const PlinkoRowInput = ({
  className,
  hasError,
  containerClassName,
  ...rest
}: PlinkoRowInputProps) => {
  return (
    <NumberInput.Root {...rest}>
      <NumberInput.Container
        className={cn(
          'wr-rounded-b-[6px] wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px]',
          {
            ['wr-border wr-border-solid wr-border-red-600']: !!hasError,
          },
          containerClassName
        )}
      >
        <NumberInput.Input
          className={cn(
            'wr-rounded-none wr-border-none wr-bg-transparent wr-px-0 wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0',
            className
          )}
        />
      </NumberInput.Container>
    </NumberInput.Root>
  );
};

const PlinkoRowSlider = ({ ...props }) => {
  const form = useFormContext();
  const sliderEffect = useAudioEffect(SoundEffects.SPIN_TICK_1X);

  const plinkoSize = form.watch('plinkoSize');
  const debouncedPlinkoSize = useDebounce(plinkoSize, 25);

  React.useEffect(() => {
    sliderEffect.play();
  }, [debouncedPlinkoSize[0]]);

  return (
    <Slider.Root
      className={cn(
        'wr-relative -wr-mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center',
        {
          'wr-cursor-none wr-pointer-events-none wr-opacity-60': props.disabled,
        }
      )}
      min={props.minValue || 1}
      value={[props.value]}
      max={props.maxValue}
      onValueChange={(e) => {
        form.setValue('plinkoSize', e[0], { shouldValidate: true });
      }}
    >
      <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
        <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
      </Slider.Track>
      <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 wr-disabled:pointer-events-none wr-disabled:opacity-50" />
    </Slider.Root>
  );
};
