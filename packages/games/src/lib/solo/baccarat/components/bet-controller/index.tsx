import { useFormContext } from 'react-hook-form';

import { AudioController } from '../../../../common/audio-controller';
import { ChipController } from '../../../../common/chip-controller';
import { Chip } from '../../../../common/chip-controller/types';
import { BetControllerContainer } from '../../../../common/containers';
import { BetControllerTitle, WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toFormatted } from '../../../../utils/web3';
import { BaccaratForm } from '../../types';
import Control from '../control';

export interface Props {
  totalWager: number;
  maxPayout: number;
  selectedChip: Chip;
  isDisabled: boolean;
  minWager: number;
  maxWager: number;
  onSelectedChipChange: (chip: Chip) => void;
  undoBet: () => void;
}

export const BetController: React.FC<Props> = ({
  minWager,
  maxWager,
  isDisabled,
  totalWager,
  selectedChip,
  maxPayout,
  onSelectedChipChange,
  undoBet,
}) => {
  const { account } = useGameOptions();
  const form = useFormContext() as BaccaratForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const wager = form.watch('wager');

  return (
    <BetControllerContainer>
      <div className="wr-flex-col wr-flex lg:wr-block lg:wr-flex-row">
        <div className="lg:wr-mb-3">
          <BetControllerTitle>Baccarat</BetControllerTitle>
        </div>

        <WagerFormField
          customLabel="Chip Value"
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isDisabled}
        />

        <ChipController
          chipAmount={wager}
          totalWager={totalWager}
          balance={account?.balanceAsDollar || 0}
          isDisabled={isDisabled}
          selectedChip={selectedChip}
          onSelectedChipChange={onSelectedChipChange}
        />

        <Control
          totalWager={totalWager}
          isDisabled={isDisabled}
          undoBet={undoBet}
          reset={form.reset}
        />
        <div className="wr-mb-6 lg:!wr-grid wr-hidden wr-grid-cols-2 wr-gap-2">
          <div>
            <FormLabel>Max Payout</FormLabel>
            <div
              className={cn(
                'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] wr-overflow-hidden'
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
            <TotalWager betCount={1} wager={totalWager} />
          </div>
        </div>

        <div className="wr-w-full lg:wr-order-none lg:wr-mb-6">
          <PreBetButton>
            <Button
              type="submit"
              variant="success"
              size="xl"
              onClick={() => clickEffect.play()}
              disabled={
                totalWager === 0 ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                isDisabled
              }
              isLoading={form.formState.isSubmitting || form.formState.isLoading}
              className="wr-w-full wr-uppercase"
            >
              Deal
            </Button>
          </PreBetButton>
        </div>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between lg:wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
