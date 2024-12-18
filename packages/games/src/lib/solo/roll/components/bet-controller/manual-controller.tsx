'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { useGame } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { RollForm } from '../../types';
import { BetLoader } from './bet-loader';

interface Props {
  minWager: number;
  maxWager: number;
  winMultiplier: number;
  isPinNotFound?: boolean;
  onLogin?: () => void;
}

export const ManualController: React.FC<Props> = ({
  minWager,
  maxWager,
  winMultiplier,
  isPinNotFound,
  onLogin,
}) => {
  const form = useFormContext() as RollForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const { readyToPlay } = useGame();

  const wager = form.watch('wager');

  const maxPayout = React.useMemo(() => {
    return toDecimals(wager * winMultiplier, 2);
  }, [wager, winMultiplier]);

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} />

      <div className="wr-mb-6 lg:wr-grid wr-hidden wr-grid-cols-2 wr-gap-2">
        <div>
          <FormLabel>Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] max-payout'
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
          <TotalWager betCount={1} wager={wager} />
        </div>
      </div>

      <PreBetButton onLogin={onLogin} isPinNotFound={isPinNotFound}>
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
          disabled={!readyToPlay}
        >
          {form.formState.isSubmitting || form.formState.isLoading ? <BetLoader /> : 'Bet'}
        </Button>
      </PreBetButton>
    </>
  );
};
