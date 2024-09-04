import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
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
import { FormControl, FormField, FormItem } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { ALL_RPS_CHOICES } from '../../constant';
import { RPSForm } from '../../types';
import { RPSChoiceRadio } from './manual-controller';

interface AutoControllerProps {
  winMultiplier: number;
  isGettingResults?: boolean;
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
  const form = useFormContext() as RPSForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  return (
    <div className="wr-flex wr-flex-col">
      <WagerFormField
        minWager={minWager}
        maxWager={maxWager}
        className="wr-order-0 lg:!wr-mb-3"
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <FormField
        control={form.control}
        name="rpsChoice"
        render={({ field }) => (
          <FormItem className="wr-mb-3 lg:wr-mb-3">
            <FormControl>
              <RadioGroupPrimitive.Root
                {...field}
                disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
                onValueChange={(e) => {
                  digitalClickEffect.play();
                  field.onChange(e);
                }}
                className={cn(
                  'wr-grid wr-w-full wr-grid-cols-3 wr-grid-rows-1 wr-items-center wr-justify-between wr-gap-1',
                  {
                    'wr-cursor-default wr-pointer-events-none':
                      form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode,
                  }
                )}
              >
                {ALL_RPS_CHOICES.map((item) => (
                  <FormItem className="wr-mb-0 wr-cursor-pointer" key={item}>
                    <FormControl>
                      <RPSChoiceRadio
                        disabled={
                          form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode
                        }
                        choice={item}
                      />
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroupPrimitive.Root>
            </FormControl>
          </FormItem>
        )}
      />

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

      <div className="wr-order-3 lg:wr-order-none wr-flex wr-gap-2">
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
                !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading,
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
