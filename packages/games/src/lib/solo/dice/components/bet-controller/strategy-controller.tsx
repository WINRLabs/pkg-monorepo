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
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { DiceForm, StrategyProps } from '../../types';
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
  const form = useFormContext() as DiceForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const { openModal } = useWeb3GamesModalsStore();
  const { allStrategies, selectedStrategy, setSelectedStrategy } = useCustomBetStrategistStore([
    'allStrategies',
    'selectedStrategy',
    'setSelectedStrategy',
  ]);

  const handleRemoveStrategy = async () => {
    console.log('HANDLE REMOVE');
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
