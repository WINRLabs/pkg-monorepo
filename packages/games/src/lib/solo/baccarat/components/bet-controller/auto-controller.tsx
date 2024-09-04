import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ChipController } from '../../../../common/chip-controller';
import { Chip } from '../../../../common/chip-controller/types';
import {
  AutoBetCountFormField,
  AutoBetIncreaseOnLoss,
  AutoBetIncreaseOnWin,
  AutoBetStopGainFormField,
  AutoBetStopLossFormField,
  WagerFormField,
} from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { BaccaratForm } from '../../types';
import Control from '../control';

interface AutoControllerProps {
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
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AutoController = ({
  totalWager,
  isDisabled,
  selectedChip,
  minWager,
  maxWager,
  isAutoBetMode,
  onLogin,
  onSelectedChipChange,
  undoBet,
  onAutoBetModeChange,
}: AutoControllerProps) => {
  const form = useFormContext() as BaccaratForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const { account } = useGameOptions();

  const wager = form.watch('wager');

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

      <PreBetButton onLogin={onLogin} totalWager={totalWager} className="wr-mb-3 lg:wr-mb-0">
        <Button
          type={!isAutoBetMode ? 'button' : 'submit'}
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-3 lg:wr-mb-0 wr-order-1 lg:wr-order-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                totalWager === 0 || form.formState.isSubmitting || form.formState.isLoading,
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
