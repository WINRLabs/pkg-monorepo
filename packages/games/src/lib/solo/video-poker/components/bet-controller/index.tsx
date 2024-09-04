'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { AudioController } from '../../../../common/audio-controller';
import { BetControllerContainer } from '../../../../common/containers';
import { BetControllerTitle, WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toFormatted } from '../../../../utils/web3';
import useVideoPokerGameStore, { VideoPokerStatus } from '../../store';
import { VideoPokerForm } from '../../types';

interface Props {
  minWager: number;
  maxWager: number;
  maxPayout: number;
  onLogin?: () => void;
}

export const VideoPokerBetController: React.FC<Props> = ({
  maxPayout,
  maxWager,
  minWager,
  onLogin,
}) => {
  const form = useFormContext() as VideoPokerForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const { status } = useVideoPokerGameStore(['status', 'updateState']);

  const wager = form.watch('wager');

  return (
    <BetControllerContainer>
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="lg:wr-mb-3">
          <BetControllerTitle>Video Poker</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={form.formState.isSubmitting || form.formState.isLoading}
        />

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
            <TotalWager betCount={1} wager={wager} />
          </div>
        </div>
        <PreBetButton onLogin={onLogin}>
          <Button
            type="submit"
            variant={'success'}
            className="wr-w-full wr-uppercase"
            size={'xl'}
            onClick={() => clickEffect.play()}
            isLoading={form.formState.isSubmitting || form.formState.isLoading}
            disabled={
              !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading
            }
          >
            {status === VideoPokerStatus.Dealt ? 'Finish game' : 'Start game'}
          </Button>
        </PreBetButton>
      </div>

      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
