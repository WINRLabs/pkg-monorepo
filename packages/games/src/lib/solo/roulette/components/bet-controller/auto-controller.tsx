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
import { CDN_URL } from '../../../../constants';
import { useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { NUMBER_INDEX_COUNT } from '../../constants';
import { RouletteForm } from '../../types';

interface AutoControllerProps {
  isPrepared: boolean;
  selectedChip: Chip;
  minWager: number;
  maxWager: number;
  onSelectedChipChange: (c: Chip) => void;
  undoBet: () => void;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

export const AutoController = ({
  isPrepared,
  selectedChip,
  minWager,
  maxWager,
  isAutoBetMode,
  onSelectedChipChange,
  undoBet,
  onAutoBetModeChange,
  onLogin,
}: AutoControllerProps) => {
  const form = useFormContext() as RouletteForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);
  const { account } = useGameOptions();

  const wager = form.watch('wager');
  const selectedNumbers = form.watch('selectedNumbers');
  const totalWager = React.useMemo(() => {
    const totalChipCount = selectedNumbers.reduce((acc, cur) => acc + cur, 0);
    return totalChipCount * wager;
  }, [selectedNumbers, wager]);

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
          className="wr-flex wr-w-full wr-items-center wr-gap-1"
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
          className="wr-flex wr-w-full wr-items-center wr-gap-1"
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
        >
          {isAutoBetMode ? 'Stop Autobet' : 'Start Autobet'}
        </Button>
      </PreBetButton>
    </div>
  );
};
