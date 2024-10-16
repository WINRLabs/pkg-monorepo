import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '../../../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../../ui/select';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { TowerForm } from '../../types';
import { BetLoader } from './bet-loader';

type Props = {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
};

export const ManualController: React.FC<Props> = ({ minWager, maxWager, onLogin }) => {
  const form = useFormContext() as TowerForm;

  const isFormInProgress = form.formState.isSubmitting || form.formState.isLoading;

  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const maxPayout = React.useMemo(() => {
    const { wager } = form.getValues();

    return toDecimals(wager, 2);
  }, [form.getValues().wager]);

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} isDisabled={isFormInProgress} />

      <FormField
        control={form.control}
        name="riskLevel"
        render={({ field }) => (
          <FormItem className="wr-mb-3 lg:wr-mb-6">
            <FormLabel>Risk</FormLabel>
            <Select {...field} value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="wr-bg-zinc-950 wr-border-zinc-800">
                  {field.value.charAt(0).toUpperCase() + field.value.slice(1) || 'Risk'}
                </SelectTrigger>
              </FormControl>

              <SelectContent className="wr-z-[400] wr-bg-zinc-800 wr-border-zinc-800">
                <SelectItem
                  className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                  value="easy"
                >
                  Easy
                </SelectItem>
                <SelectItem
                  className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                  value="medium"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                  value="hard"
                >
                  Hard
                </SelectItem>
                <SelectItem
                  className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                  value="expert"
                >
                  Expert
                </SelectItem>
                <SelectItem
                  className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                  value="master"
                >
                  Master
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rows"
        render={({ field }) => (
          <FormItem className="wr-mb-3 lg:wr-mb-6">
            <FormLabel>Rows</FormLabel>
            <Select
              value={String(field.value)}
              onValueChange={(val) => field.onChange(Number(val))}
            >
              <FormControl>
                <SelectTrigger className="wr-bg-zinc-950 wr-border-zinc-800">
                  {field.value || 'Rows'}
                </SelectTrigger>
              </FormControl>
              <SelectContent className="wr-z-[400] wr-bg-zinc-800 wr-border-zinc-800 ">
                {Array.from({ length: 10 }).map((_, index) => (
                  <SelectItem
                    key={index}
                    className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300 data-[selected=true]:wr-bg-zinc-700"
                    value={String(index + 1)}
                  >
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfBet"
        render={({ field }) => (
          <FormItem className="wr-mb-3 lg:wr-mb-6">
            <FormLabel>Number of Bet</FormLabel>
            <FormControl>
              <div>
                <Select value={String(field.value)} onValueChange={field.onChange}>
                  <SelectTrigger className="wr-bg-zinc-950 wr-border-zinc-800">
                    {field.value || 'Number of Bet'}
                  </SelectTrigger>
                  <SelectContent className="wr-z-[400] wr-bg-zinc-800 wr-border-zinc-800">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <SelectItem
                        key={index}
                        className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                        value={String(index + 1)}
                      >
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

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
          {form.formState.isLoading || form.formState.isSubmitting ? <BetLoader /> : 'Bet'}
        </Button>
      </PreBetButton>
    </>
  );
};
