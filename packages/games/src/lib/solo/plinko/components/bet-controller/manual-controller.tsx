'use client';
import * as Slider from '@radix-ui/react-slider';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { useGame, useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form';
import { INumberInputContext, NumberInput } from '../../../../ui/number-input';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { rowMultipliers } from '../../constants';
import { PlinkoForm } from '../../types';
import { PlinkoTemplateOptions } from '../template';
import { BetLoader } from './bet-loader';

interface Props extends Omit<PlinkoTemplateOptions, 'scene'> {
  minWager: number;
  maxWager: number;
  onLogin?: () => void;
}

export const ManualController: React.FC<Props> = ({
  minWager,
  maxWager,
  onLogin,
  hideWager,
  hideTotalWagerInfo,
  maxPayout: maxPayoutOptions,
  tokenPrefix,
  showBetCount,
  hideMaxPayout,
  rowMultipliers: customRowMultipliers,
}) => {
  const { readyToPlay } = useGame();
  const { dictionary } = useGameOptions();
  const form = useFormContext() as PlinkoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const rowSize = form.watch('plinkoSize');
  const wager = form.watch('wager');

  const maxPayout = React.useMemo(() => {
    const multipliers = customRowMultipliers?.[rowSize] || rowMultipliers[rowSize];
    const maxMultiplier = isNaN(multipliers?.[0] as number) ? 0 : (multipliers?.[0] as number);

    return toDecimals(wager * maxMultiplier, 2);
  }, [wager, rowSize]);

  React.useEffect(() => {
    form.setValue('betCount', 1);
  }, []);

  return (
    <>
      {!hideWager && <WagerFormField minWager={minWager} maxWager={maxWager} />}

      <PlinkoRowFormField minValue={6} maxValue={12} />
      {showBetCount && <PlinkoBetCountField minValue={1} maxValue={10} />}

      <div
        className={cn('wr-mb-6 wr-grid-cols-2 wr-gap-2 lg:!wr-grid wr-hidden', {
          'wr-hidden wr-mb-0': hideMaxPayout && hideTotalWagerInfo,
        })}
      >
        {!hideMaxPayout && (
          <div>
            <FormLabel>{dictionary.maxPayout}</FormLabel>
            <div
              className={cn(
                'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] wr-overflow-hidden max-reward'
              )}
            >
              {maxPayoutOptions?.icon ? (
                <img
                  src={maxPayoutOptions.icon}
                  alt={dictionary.maxPayout}
                  className="wr-mr-1 wr-h-5 wr-w-5"
                />
              ) : (
                <WagerCurrencyIcon />
              )}
              <span className={cn('wr-font-semibold wr-text-zinc-100')}>
                {typeof tokenPrefix !== 'undefined' ? tokenPrefix : '$'}
                {toFormatted(maxPayout, 2)}
              </span>
            </div>
          </div>
        )}
        {!hideTotalWagerInfo && (
          <div>
            <FormLabel>Total Wager</FormLabel>
            <TotalWager betCount={1} wager={form.getValues().wager} />
          </div>
        )}
      </div>

      <PreBetButton onLogin={onLogin}>
        <Button
          type="submit"
          disabled={!readyToPlay}
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
          {form.formState.isLoading || form.formState.isSubmitting ? (
            <BetLoader />
          ) : (
            dictionary.submitBtn
          )}
        </Button>
      </PreBetButton>
    </>
  );
};

export const PlinkoBetCountField: React.FC<{
  isDisabled?: boolean;
  minValue?: number;
  maxValue?: number;
  className?: string;
}> = ({ isDisabled, minValue, maxValue, className }) => {
  const form = useFormContext();
  const { dictionary } = useGameOptions();

  return (
    <FormField
      control={form.control}
      name="betCount"
      render={({ field }) => (
        <FormItem className={cn('wr-mb-3 lg:wr-mb-6', className)}>
          <FormLabel className="wr-leading-4 lg:wr-leading-6 wr-mb-3 lg:wr-mb-[6px]">
            {dictionary.betCount}
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
                onValueChange={(e: any) => {
                  form.setValue('betCount', e[0], { shouldValidate: true });
                }}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
          <FormItem className={cn('wr-mb-3 lg:wr-mb-6  plinko-input', className)}>
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
        if (props.onValueChange) {
          props.onValueChange(e);
        } else {
          form.setValue('plinkoSize', e[0], { shouldValidate: true });
        }
      }}
    >
      <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
        <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
      </Slider.Track>
      <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 wr-disabled:pointer-events-none wr-disabled:opacity-50" />
    </Slider.Root>
  );
};
