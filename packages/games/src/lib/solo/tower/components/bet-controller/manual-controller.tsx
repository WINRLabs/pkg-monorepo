import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { TowerForm } from '../../types';
import { BetLoader } from './bet-loader';
import NumberOfCBetController from './number-of-bets-controller';
import RiskController from './risk-controller';
import RowsController from './rows-controller';

type Props = {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
};

export const ManualController: React.FC<Props> = ({ minWager, maxWager, onLogin }) => {
  const form = useFormContext() as TowerForm;

  const isFormInProgress = form.formState.isSubmitting || form.formState.isLoading;

  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const maxPayout = React.useMemo(() => {
    const { wager } = form.getValues();

    return toDecimals(wager, 2);
  }, [form.getValues().wager]);

  return (
    <>
      <WagerFormField
        className="lg:wr-mb-3"
        minWager={minWager}
        maxWager={maxWager}
        isDisabled={isFormInProgress}
      />
      <RiskController />
      <RowsController />
      <NumberOfCBetController />
      <div className="wr-mb-6 lg:!wr-grid wr-grid-cols-2 wr-gap-2 wr-hidden">
        <div>
          <FormLabel>Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]'
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
          <TotalWager betCount={1} wager={form.getValues().wager} />
        </div>
      </div>
      <PreBetButton onLogin={onLogin}>
        <Button
          type="submit"
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading,
            }
          )}
          size={'xl'}
          onClick={() => clickEffect.play()}
        >
          {form.formState.isLoading || form.formState.isSubmitting ? <BetLoader /> : 'Bet'}
        </Button>
      </PreBetButton>
    </>
  );
};
