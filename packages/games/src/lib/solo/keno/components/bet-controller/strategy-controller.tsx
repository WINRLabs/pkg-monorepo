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
import { IconMagicStick, IconTrash } from '../../../../svgs';
import { StrategyProps } from '../../../../types';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { kenoMultipliers } from '../../constants';
import useKenoGameStore from '../../store';
import { KenoForm } from '../../types';
import { BetLoader } from './bet-loader';

interface StrategyControllerProps {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  strategy: StrategyProps;
  isPinNotFound?: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

export const StrategyController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  strategy,
  isPinNotFound,
  onAutoBetModeChange,
  onLogin,
}: StrategyControllerProps) => {
  const { readyToPlay } = useGame();
  const form = useFormContext() as KenoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const { openModal } = useWeb3GamesModalsStore();
  const { allStrategies, selectedStrategy, setSelectedStrategy } = useCustomBetStrategistStore([
    'allStrategies',
    'selectedStrategy',
    'setSelectedStrategy',
  ]);

  const wager = form.watch('wager');
  const selections = form.watch('selections');

  const { updateKenoGameResults } = useKenoGameStore([
    'gameStatus',
    'updateKenoGameResults',
    'kenoGameResults',
  ]);

  const currentMultipliers = kenoMultipliers[selections.length] || [];
  const maxMultiplier = Math.max(...currentMultipliers);
  const maxPayout = wager * maxMultiplier;

  const clearBetHandler = () => {
    digitalClickEffect.play();
    form.setValue('selections', []);
    updateKenoGameResults([]);
  };

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const autoPickHandler = () => {
    digitalClickEffect.play();
    clearBetHandler();

    var randomNumbers: number[] = [];

    for (var i = 0; i < 10; i++) {
      var randomNumber;

      do {
        randomNumber = getRandomNumber(1, 40);
      } while (randomNumbers.includes(randomNumber));

      randomNumbers.push(randomNumber);
    }

    form.setValue('selections', randomNumbers);
  };

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

      <div className="wr-mb-3 wr-grid wr-grid-cols-2 wr-gap-2">
        <Button
          size={'xl'}
          variant={'secondary'}
          type="button"
          disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          onClick={autoPickHandler}
          className="button"
        >
          <IconMagicStick className="wr-mr-1 wr-h-5 wr-w-5" />
          Auto Pick
        </Button>
        <Button
          size={'xl'}
          variant={'secondary'}
          type="button"
          onClick={clearBetHandler}
          disabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          className="button"
        >
          <IconTrash className="wr-mr-1 wr-h-5 wr-w-5" />
          Clear
        </Button>
      </div>

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
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                maxPayout == 0,
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
