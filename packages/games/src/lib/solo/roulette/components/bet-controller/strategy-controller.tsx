import React from 'react';
import { useFormContext } from 'react-hook-form';

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
import { RouletteForm } from '../../types';
import { BetLoader } from './bet-loader';
import { ChipController } from '../../../../common/chip-controller';
import { NUMBER_INDEX_COUNT } from '../../constants';
import { CDN_URL } from '../../../../constants';

interface StrategyControllerProps {
  isPrepared: boolean;
  selectedChip: Chip;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  strategy: StrategyProps;
  onSelectedChipChange: (c: Chip) => void;
  undoBet: () => void;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

export const StrategyController = ({
  isPrepared,
  selectedChip,
  minWager,
  maxWager,
  isAutoBetMode,
  strategy,
  onSelectedChipChange,
  undoBet,
  onAutoBetModeChange,
  onLogin,
}: StrategyControllerProps) => {
  const { readyToPlay } = useGame();
  const { account } = useGameOptions();
  const form = useFormContext() as RouletteForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const wager = form.watch('wager');
  const selectedNumbers = form.watch('selectedNumbers');
  const totalWager = React.useMemo(() => {
    const totalChipCount = selectedNumbers.reduce((acc, cur) => acc + cur, 0);
    return totalChipCount * wager;
  }, [selectedNumbers, wager]);

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
        isDisabled={isPrepared || isAutoBetMode}
        selectedChip={selectedChip}
        onSelectedChipChange={onSelectedChipChange}
        className="lg:wr-mb-3"
      />

      <div className="wr-hidden lg:wr-flex wr-w-full wr-items-center wr-gap-2 wr-mb-3">
        <Button
          type="button"
          disabled={isPrepared || isAutoBetMode || form.getValues().totalWager === 0}
          onClick={() => {
            undoBet();
            digitalClickEffect.play();
          }}
          variant="secondary"
          size="xl"
          className="wr-flex wr-w-full wr-items-center wr-gap-1 button"
        >
          <img
            src={`${CDN_URL}/icons/icon-undo.svg`}
            width={20}
            height={20}
            alt="Justbet Decentralized Casino"
          />
          <span className="max-lg:wr-hidden">Undo</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="xl"
          className="wr-flex wr-w-full wr-items-center wr-gap-1 button"
          disabled={isPrepared || isAutoBetMode}
          onClick={() => {
            digitalClickEffect.play();
            form.setValue('selectedNumbers', new Array(NUMBER_INDEX_COUNT).fill(0));
          }}
        >
          <img
            src={`${CDN_URL}/icons/icon-trash.svg`}
            width={20}
            height={20}
            alt="Justbet Decentralized Casino"
          />
          <span className="max-lg:wr-hidden">Clear</span>
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

      <PreBetButton onLogin={onLogin} totalWager={totalWager} className="wr-mb-3 lg:wr-mb-0">
        <Button
          type={!isAutoBetMode ? 'button' : 'submit'}
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-3 lg:wr-mb-0 wr-order-1 lg:wr-order-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                form.getValues().totalWager === 0 ||
                form.formState.isSubmitting ||
                form.formState.isLoading,
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
            <div className="wr-flex wr-items-center wr-gap-1.5">
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
