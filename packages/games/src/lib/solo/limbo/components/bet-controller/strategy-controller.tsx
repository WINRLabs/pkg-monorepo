import * as Slider from '@radix-ui/react-slider';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AutoBetCountFormField,
  StrategySelector,
  WagerFormField,
} from '../../../../common/controller';
import { useWeb3GamesModalsStore } from '../../../../common/modals';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { useGame } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { useCustomBetStrategistStore } from '../../../../hooks/use-custom-bet-strategist/store';
import { NormalizedStrategyStruct } from '../../../../strategist';
import { StrategyProps } from '../../../../types';
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form';
import { NumberInput } from '../../../../ui/number-input';
import { cn } from '../../../../utils/style';
import { LimboForm } from '../../types';
import { BetLoader } from './bet-loader';

interface StrategyControllerProps {
  winMultiplier: number;
  isGettingResults?: boolean;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  strategy: StrategyProps;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

export const StrategyController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  strategy,
  onAutoBetModeChange,
  onLogin,
}: StrategyControllerProps) => {
  const { readyToPlay } = useGame();
  const form = useFormContext() as LimboForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const { openModal } = useWeb3GamesModalsStore();
  const { allStrategies, selectedStrategy, setSelectedStrategy } = useCustomBetStrategistStore([
    'allStrategies',
    'selectedStrategy',
    'setSelectedStrategy',
  ]);

  const handleRemoveStrategy = async () => {
    const idx = allStrategies.findIndex((s) => s.strategyId === selectedStrategy?.strategyId);
    await strategy.remove(selectedStrategy?.strategyId || 0);
    setSelectedStrategy((allStrategies[idx - 1] || allStrategies[0]) as NormalizedStrategyStruct);
  };

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
        name="limboMultiplier"
        render={({ field }) => (
          <FormItem className="wr-mb-3 lg:wr-mb-3">
            <FormLabel>Multiplier (1.1-{100}) </FormLabel>

            <FormControl>
              <div>
                <NumberInput.Root
                  {...field}
                  isDisabled={
                    form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode
                  }
                >
                  <NumberInput.Container
                    className={cn(
                      'wr-rounded-b-[6px] wr-border-none wr-bg-zinc-950 wr-px-2  wr-py-[10px] multiplier-input'
                    )}
                  >
                    <NumberInput.Input
                      className={cn(
                        'wr-rounded-none wr-border-none  wr-bg-transparent wr-px-0 wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0'
                      )}
                    />
                  </NumberInput.Container>
                </NumberInput.Root>
                <Slider.Root
                  className={cn(
                    'wr-relative -wr-mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center'
                  )}
                  min={1.1}
                  value={[field.value]}
                  max={100}
                  step={1}
                  disabled={
                    form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode
                  }
                  onValueChange={(e: any) => {
                    form.setValue('limboMultiplier', e[0], {
                      shouldValidate: true,
                    });
                  }}
                >
                  <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
                    <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
                  </Slider.Track>
                  <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex  wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-opacity-50" />
                </Slider.Root>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AutoBetCountFormField
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <StrategySelector
        selectedStrategy={selectedStrategy}
        onChange={setSelectedStrategy}
        strategies={allStrategies}
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <Button
        type="button"
        variant="secondary"
        size="xl"
        className="wr-mb-3 wr-uppercase"
        disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        onClick={() => {
          openModal('createStrategy', {
            createStrategy: {
              createStrategy: strategy.create,
            },
          });
        }}
      >
        Create Strategy
      </Button>

      {!selectedStrategy?.isPredefined && (
        <Button
          type="button"
          variant="secondary"
          size="xl"
          className="wr-mb-3 wr-uppercase"
          disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          onClick={() => {
            openModal('editStrategy', {
              editStrategy: {
                addDefaultCondition: strategy.addDefaultCondition,
                removeCondition: strategy.removeCondition,
                updateBetCondition: strategy.updateBetCondition,
                updateProfitCondition: strategy.updateProfitCondition,
                withoutExternalOption: true,
              },
            });
          }}
        >
          Edit Strategy
        </Button>
      )}

      {!selectedStrategy?.isPredefined && (
        <Button
          type="button"
          variant="secondary"
          size="xl"
          className="wr-mb-3 wr-uppercase"
          disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          onClick={handleRemoveStrategy}
        >
          Delete Strategy
        </Button>
      )}

      <PreBetButton onLogin={onLogin} className="wr-mb-3 lg:wr-mb-0">
        <Button
          type={!isAutoBetMode ? 'button' : 'submit'}
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-3 lg:wr-mb-0 -wr-order-1 md:wr-order-1 lg:wr-order-none',
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
          disabled={!readyToPlay}
        >
          {isAutoBetMode ? (
            <div className="wr-flex wr-gap-1.5 wr-items-center">
              Stop Autobet <BetLoader />
            </div>
          ) : (
            'Start Autobet'
          )}
        </Button>
      </PreBetButton>
    </div>
  );
};
