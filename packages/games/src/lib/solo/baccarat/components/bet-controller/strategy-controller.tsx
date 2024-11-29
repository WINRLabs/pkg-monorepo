import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ChipController } from '../../../../common/chip-controller';
import { Chip } from '../../../../common/chip-controller/types';
import {
  AutoBetCountFormField,
  StrategySelector,
  WagerFormField,
} from '../../../../common/controller';
import { useWeb3GamesModalsStore } from '../../../../common/modals';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { useGame, useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { useCustomBetStrategistStore } from '../../../../hooks/use-custom-bet-strategist/store';
import { NormalizedStrategyStruct } from '../../../../strategist';
import { StrategyProps } from '../../../../types';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { BaccaratForm } from '../../types';
import Control from '../control';
import { BetLoader } from './bet-loader';

interface StrategyControllerProps {
  totalWager: number;
  maxPayout: number;
  selectedChip: Chip;
  isDisabled: boolean;
  minWager: number;
  maxWager: number;
  onLogin?: () => void;
  onSelectedChipChange: (chip: Chip) => void;
  undoBet: () => void;
  isAutoBetMode: boolean;
  isPinNotFound?: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;

  strategy: StrategyProps;
}

export const StrategyController = ({
  totalWager,
  isDisabled,
  selectedChip,
  minWager,
  maxWager,
  isAutoBetMode,
  isPinNotFound,
  onLogin,
  onSelectedChipChange,
  undoBet,
  onAutoBetModeChange,
  strategy,
}: StrategyControllerProps) => {
  const { readyToPlay } = useGame();
  const form = useFormContext() as BaccaratForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const { account } = useGameOptions();
  const wager = form.watch('wager');

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

      <ChipController
        chipAmount={wager}
        totalWager={totalWager}
        balance={account?.balanceAsDollar || 0}
        isDisabled={
          isDisabled || form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode
        }
        selectedChip={selectedChip}
        onSelectedChipChange={onSelectedChipChange}
        className="lg:wr-mb-3"
      />

      <Control
        totalWager={totalWager}
        isDisabled={
          isDisabled || form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode
        }
        undoBet={undoBet}
        reset={form.reset}
        className="wr-mb-3 lg:wr-mb-3"
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

      <PreBetButton onLogin={onLogin} isPinNotFound={isPinNotFound} className="wr-mb-3 lg:wr-mb-0">
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
