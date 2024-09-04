import React from 'react';
import { useFormContext } from 'react-hook-form';

import { ChipController } from '../../../../common/chip-controller';
import { Chip } from '../../../../common/chip-controller/types';
import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { CDN_URL } from '../../../../constants';
import { useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { NUMBER_INDEX_COUNT } from '../../constants';
import useRouletteGameStore from '../../store';
import { RouletteForm } from '../../types';

interface Props {
  isPrepared: boolean;
  selectedChip: Chip;
  minWager: number;
  maxWager: number;
  onSelectedChipChange: (c: Chip) => void;
  undoBet: () => void;
  onLogin?: () => void;
}

export const ManualController: React.FC<Props> = ({
  isPrepared,
  selectedChip,
  minWager,
  maxWager,
  onSelectedChipChange,
  undoBet,
  onLogin,
}) => {
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

  const { gameStatus } = useRouletteGameStore(['gameStatus']);

  return (
    <>
      <WagerFormField
        customLabel="Chip Value"
        minWager={minWager}
        maxWager={maxWager}
        isDisabled={
          form.formState.isSubmitting ||
          form.formState.isLoading ||
          gameStatus == 'PLAYING' ||
          isPrepared
        }
      />

      <ChipController
        chipAmount={wager}
        totalWager={totalWager}
        balance={account?.balanceAsDollar || 0}
        isDisabled={isPrepared}
        selectedChip={selectedChip}
        onSelectedChipChange={onSelectedChipChange}
        className="lg:wr-mb-6"
      />

      <div className="wr-hidden lg:wr-flex wr-w-full wr-items-center wr-gap-2 wr-mb-6">
        <Button
          type="button"
          disabled={isPrepared || form.getValues().totalWager === 0}
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
          disabled={isPrepared}
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

      <div className="wr-w-full lg:wr-mb-6">
        <PreBetButton onLogin={onLogin} totalWager={totalWager}>
          <Button
            type="submit"
            variant="success"
            size="xl"
            onClick={() => clickEffect.play()}
            className={cn(
              'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none',
              {
                'wr-cursor-default wr-pointer-events-none':
                  form.getValues().totalWager === 0 ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  isPrepared,
              }
            )}
          >
            Bet
          </Button>
        </PreBetButton>
      </div>
    </>
  );
};
