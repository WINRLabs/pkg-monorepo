import { useFormContext } from "react-hook-form";
import { BetCount } from "./bet-count";
import { BetCountSlider } from "./containers";
import { StopGainLossInput } from "./stop-gain-loss-input";
import {
  WagerBalance,
  WagerCurrency,
  WagerInput,
  WagerSetterButtons,
} from "./wager";
import * as React from "react";
import { cn } from "../utils/style";
import {
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "../ui/form";

interface WagerFormFieldProps {
  minWager: number;
  maxWager: number;
  isDisabled?: boolean;
  className?: string;
}

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const BetControllerTitle: React.FC<Props> = ({
  children,
  className,
}) => {
  return (
    <h1 className={cn("wr-text-lg wr-font-bold", className)}>{children}</h1>
  );
};

export const BetCountFormField: React.FC<{
  isDisabled?: boolean;
  maxValue?: number;
}> = ({ isDisabled = false, maxValue = 100 }) => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="betCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Multiple Bets (1-{maxValue}) </FormLabel>

            <FormControl>
              <div>
                <BetCount
                  isDisabled={isDisabled}
                  maxValue={maxValue}
                  {...field}
                />
                <BetCountSlider
                  disabled={isDisabled}
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

export const StopGainFormField = ({
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
        <FormItem>
          <FormLabel className={cn(labelClassName)}>Stop Gain</FormLabel>

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

export const StopLossFormField = ({
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
        <FormItem>
          <FormLabel className={cn(labelClassName)}>Stop Loss</FormLabel>

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

export const WagerFormField: React.FC<WagerFormFieldProps> = ({
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
          <FormLabel>
            Wager
            <div>
              <WagerBalance className="wr-text-zinc-100" />
              <WagerCurrency />
            </div>
          </FormLabel>

          <FormControl>
            <>
              <WagerInput
                {...field}
                hasError={!!form.formState.errors.wager}
                isDisabled={isDisabled}
              />
              <WagerSetterButtons
                isDisabled={isDisabled}
                form={form}
                minWager={minWager}
                maxWager={maxWager}
                currentWager={field.value}
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
              <WagerBalance className="wr-text-zinc-100" />
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
                  "wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md"
                )}
              />
              <WagerSetterButtons
                form={form}
                minWager={minWager}
                maxWager={maxWager}
                currentWager={field.value}
                className={cn("wr-bg-unity-white-15 wr-backdrop-blur-md")}
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
          <FormLabel className="wr-text-unity-white-50">
            Bet Count {children}
          </FormLabel>

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
