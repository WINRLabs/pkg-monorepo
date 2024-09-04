import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../constants';
import { Button } from '../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { cn } from '../utils/style';
import { BetCount } from './bet-count';
import { BetCountSlider } from './containers';
import { StopGainLossInput } from './stop-gain-loss-input';
import { WagerBalance, WagerCurrency, WagerInput, WagerSetterButtons } from './wager';
import { IncreaseByInput } from './increase-by-input';
import useMediaQuery from '../hooks/use-media-query';

interface WagerFormFieldProps {
  customLabel?: string;
  minWager: number;
  maxWager: number;
  isDisabled?: boolean;
  className?: string;
}

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const BetControllerTitle: React.FC<Props> = ({ children, className }) => {
  return (
    <h1 className={cn('wr-text-lg wr-font-bold  lg:wr-flex wr-hidden', className)}>{children}</h1>
  );
};

export const BetCountFormField: React.FC<{
  isDisabled?: boolean;
  maxValue?: number;
  hideSm?: boolean;
}> = ({ isDisabled = false, maxValue = 100, hideSm = false }) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="betCount"
        render={({ field }) => (
          <FormItem
            className={cn('wr-mb-3 lg:wr-mb-6', {
              'wr-hidden lg:!wr-block': hideSm,
            })}
          >
            <FormLabel className={cn('wr-leading-4 wr-mb-3 lg:wr-mb-[6px] lg:wr-leading-6')}>
              Multiple Bets (1-{maxValue}){' '}
            </FormLabel>

            <FormControl>
              <div>
                <BetCount isDisabled={isDisabled} maxValue={maxValue} {...field} />
                <BetCountSlider disabled={isDisabled} maxValue={maxValue} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export const AutoBetCountFormField: React.FC<{
  isDisabled?: boolean;
  maxValue?: number;
}> = ({ isDisabled = false, maxValue = 100 }) => {
  const form = useFormContext();
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <>
      <FormField
        control={form.control}
        name="betCount"
        render={({ field }) => (
          <FormItem className={cn('wr-mb-3')}>
            <FormLabel>{isMobile ? '#' : 'Number'} of Bets</FormLabel>

            <FormControl>
              <div className="wr-relative wr-w-full">
                <BetCount isDisabled={isDisabled} maxValue={maxValue} {...field} />
                {form.getValues('betCount') == 0 && (
                  <span className="wr-absolute wr-right-3 wr-text-3xl wr-text-zinc-500 -wr-translate-y-1/2 wr-top-1/2 wr-font-bold">
                    ∞
                  </span>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export const AutoBetStopGainFormField = ({
  inputContainerClassName,
  labelClassName,
  isDisabled = false,
}: {
  inputContainerClassName?: string;
  labelClassName?: string;
  isDisabled?: boolean;
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="stopGain"
      render={({ field }) => (
        <FormItem className="lg:wr-mb-3 wr-mb-0 wr-w-full">
          <FormLabel className={cn(labelClassName)}>Stop on Profit</FormLabel>
          <FormControl>
            <StopGainLossInput
              {...field}
              isDisabled={isDisabled}
              hasError={!!form.formState.errors.stopGain}
              containerClassName={cn(inputContainerClassName)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const AutoBetStopLossFormField = ({
  inputContainerClassName,
  labelClassName,
  isDisabled = false,
}: {
  inputContainerClassName?: string;
  labelClassName?: string;
  isDisabled?: boolean;
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="stopLoss"
      render={({ field }) => (
        <FormItem className="lg:wr-mb-3 wr-mb-0 wr-w-full">
          <FormLabel className={cn(labelClassName)}>Stop on Loss</FormLabel>
          <FormControl>
            <StopGainLossInput
              {...field}
              isDisabled={isDisabled}
              hasError={!!form.formState.errors.stopLoss}
              containerClassName={cn(inputContainerClassName)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const AutoBetIncreaseOnWin = ({
  inputContainerClassName,
  labelClassName,
  isDisabled = false,
  showSm = false,
}: {
  inputContainerClassName?: string;
  labelClassName?: string;
  isDisabled?: boolean;
  showSm?: boolean;
}) => {
  const form = useFormContext();
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <FormField
      control={form.control}
      name="increaseOnWin"
      render={({ field }) => (
        <FormItem className="wr-mb-3">
          <FormLabel className={cn(labelClassName)}>On Win</FormLabel>
          <FormControl>
            <div className="wr-flex wr-w-full wr-bg-zinc-800 wr-rounded-md wr-py-0.5 wr-px-2 wr-pr-0.5 wr-items-center">
              <span
                className={cn(
                  'wr-flex wr-items-center wr-gap-1.5 wr-font-semibold wr-w-full wr-text-zinc-500 wr-max-w-[15px] md:wr-max-w-[120px]',
                  {
                    'wr-max-w-[15px] md:wr-max-w-[15px]': showSm,
                  }
                )}
              >
                {isMobile || showSm ? (
                  '+'
                ) : (
                  <>
                    <img src={`${CDN_URL}/icons/icon-spin.svg`} width={22} height={22} />
                    Increase By:
                  </>
                )}
              </span>
              <IncreaseByInput
                {...field}
                minValue={-100}
                maxValue={100}
                isDisabled={isDisabled}
                containerClassName={cn('wr-h-[36px] md:wr-h-[40px]', inputContainerClassName, {
                  'wr-h-[36px] md:wr-h-[36px]': showSm,
                })}
                className="wr-w-full wr-max-w-full"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const AutoBetIncreaseOnLoss = ({
  inputContainerClassName,
  labelClassName,
  isDisabled = false,
  showSm = false,
}: {
  inputContainerClassName?: string;
  labelClassName?: string;
  isDisabled?: boolean;
  showSm?: boolean;
}) => {
  const form = useFormContext();
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <FormField
      control={form.control}
      name="increaseOnLoss"
      render={({ field }) => (
        <FormItem className="wr-mb-3">
          <FormLabel className={cn(labelClassName)}>On Loss</FormLabel>
          <FormControl>
            <div className="wr-flex wr-w-full wr-bg-zinc-800 wr-rounded-md wr-py-0.5 wr-px-2 wr-pr-0.5 wr-items-center">
              <span
                className={cn(
                  'wr-flex wr-items-center wr-gap-1.5 wr-font-semibold wr-w-full wr-text-zinc-500 wr-max-w-[15px] md:wr-max-w-[120px]',
                  {
                    'wr-max-w-[15px] md:wr-max-w-[15px]': showSm,
                  }
                )}
              >
                {isMobile || showSm ? (
                  '+'
                ) : (
                  <>
                    <img src={`${CDN_URL}/icons/icon-spin.svg`} width={22} height={22} />
                    Increase By:
                  </>
                )}
              </span>
              <IncreaseByInput
                {...field}
                minValue={-100}
                maxValue={100}
                isDisabled={isDisabled}
                containerClassName={cn('wr-h-[36px] md:wr-h-[40px]', inputContainerClassName, {
                  'wr-h-[36px] md:wr-h-[36px]': showSm,
                })}
                className="wr-w-full wr-max-w-full"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const WagerFormField: React.FC<WagerFormFieldProps> = ({
  customLabel,
  minWager,
  maxWager,
  isDisabled,
  className,
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="wager"
      render={({ field }) => (
        <FormItem className={cn(className, 'wr-mb-3 lg:wr-mb-6')}>
          <FormLabel className={cn('wr-leading-4 wr-mb-3 lg:wr-mb-[6px] lg:wr-leading-6')}>
            {customLabel ? customLabel : 'Wager'}
            <div>
              <WagerBalance maxWager={maxWager} className="wr-text-zinc-100" />
              <WagerCurrency />
            </div>
          </FormLabel>

          <FormControl>
            <>
              <WagerInput
                {...field}
                hasError={!!form.formState.errors.wager}
                isDisabled={isDisabled}
                minWager={minWager}
                maxWager={maxWager}
                form={form}
                showWagerSetter
              />
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const UnityWagerFormField: React.FC<WagerFormFieldProps> = ({
  minWager,
  maxWager,
  isDisabled,
  className,
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="wager"
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel className="wr-text-unity-white-50">
            Wager
            <div>
              <WagerBalance maxWager={maxWager} className="wr-text-zinc-100" />
              <WagerCurrency />
            </div>
          </FormLabel>

          <FormControl>
            <>
              <WagerInput
                {...field}
                isDisabled={isDisabled || field.disabled}
                hasError={!!form.formState.errors.wager}
                containerClassName={cn(
                  'wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md'
                )}
                minWager={minWager}
                maxWager={maxWager}
                form={form}
              />
              <WagerSetterButtons
                form={form}
                minWager={minWager}
                maxWager={maxWager}
                currentWager={field.value}
                className={cn('wr-bg-unity-white-15 wr-backdrop-blur-md wr-hidden lg:wr-block')}
              />
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const UnityBetCountFormField: React.FC<{
  children?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
}> = ({ children, className, isDisabled = false }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="betCount"
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel className="wr-text-unity-white-50">Bet Count {children}</FormLabel>

          <FormControl>
            <BetCount
              containerClassName="wr-relative wr-border wr-border-solid wr-rounded-[10px]  wr-border-unity-white-15 wr-bg-unity-white-15 wr-px-2 wr-py-[10px] wr-backdrop-blur-md"
              isDisabled={isDisabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const UnityFullscreenButton: React.FC<{
  isFullscreen: boolean;
  className?: string;
  onChange: (state: boolean) => void;
}> = ({ isFullscreen, className, onChange }) => {
  return (
    <Button
      onClick={() => onChange(!isFullscreen)}
      variant="secondary"
      type="button"
      className={cn('wr-h-9 wr-w-9 wr-p-0 max-lg:wr-hidden', className && className)}
    >
      <img src={`${CDN_URL}/icons/icon-fullscreen.svg`} width={24} height={24} />
    </Button>
  );
};
