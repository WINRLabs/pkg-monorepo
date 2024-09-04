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

interface Props {
  totalWager: number;
  maxPayout: number;
  selectedChip: Chip;
  isDisabled: boolean;
  minWager: number;
  maxWager: number;
  onLogin?: () => void;
  onSelectedChipChange: (chip: Chip) => void;
  undoBet: () => void;
}

export const ManualController: React.FC<Props> = ({
  minWager,
  maxWager,
  isDisabled,
  totalWager,
  selectedChip,
  maxPayout,
  onLogin,
  onSelectedChipChange,
  undoBet,
}) => {
  const { account } = useGameOptions();
  const form = useFormContext() as BaccaratForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const wager = form.watch('wager');

  return (
    <>
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
        <PreBetButton onLogin={onLogin} totalWager={totalWager}>
          <Button
            type="submit"
            variant="success"
            size="xl"
            onClick={() => clickEffect.play()}
            className={cn(
              'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-0 wr-order-1 lg:wr-order-none',
              {
                'wr-cursor-default wr-pointer-events-none':
                  totalWager === 0 ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  isDisabled,
              }
            )}
          >
            Deal
          </Button>
        </PreBetButton>
      </div>
    </>
  );
};
