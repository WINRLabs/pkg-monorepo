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
import { BetLoader } from './bet-loader';

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
            className={cn(
              'wr-w-full wr-uppercase wr-flex wr-gap-1 wr-items-center wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none',
              {
                'wr-cursor-default wr-pointer-events-none':
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading,
              }
            )}
            size={'xl'}
            onClick={() => clickEffect.play()}
          >
            {status === VideoPokerStatus.Dealt ? 'Finish game' : 'Start game'}
            {(form.formState.isSubmitting || form.formState.isLoading) && <BetLoader />}
          </Button>
        </PreBetButton>
      </div>

      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
