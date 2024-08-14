import * as Slider from '@radix-ui/react-slider';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { UnityAudioController } from '../../../common/audio-controller';
import { UnityBetControllerContainer } from '../../../common/containers';
import { BetControllerTitle, UnityWagerFormField } from '../../../common/controller';
import { PreBetButton } from '../../../common/pre-bet-button';
import { WagerCurrencyIcon } from '../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import useCountdown from '../../../hooks/use-time-left';
import { Button } from '../../../ui/button';
import { CountdownContextState, CountdownProvider, Minutes, Seconds } from '../../../ui/countdown';
import { FormControl, FormField, FormLabel, FormMessage } from '../../../ui/form';
import { NumberInput } from '../../../ui/number-input';
import { cn } from '../../../utils/style';
import { toFormatted } from '../../../utils/web3';
import { MultiplayerGameStatus } from '../../core/type';
import { useCrashGameStore } from '../store';
import { CrashForm } from '../types';

interface CrashBetControllerProps {
  minWager: number;
  maxWager: number;
  options?: {
    scene?: {
      loader?: string;
      logo?: string;
    };
  };
}

export const CrashBetController: React.FC<CrashBetControllerProps> = ({
  minWager,
  maxWager,
  options,
}) => {
  const form: CrashForm = useFormContext();
  const wager = form.watch('wager');
  const multiplier = form.watch('multiplier');
  const sliderEffect = useAudioEffect(SoundEffects.SPIN_TICK_1X);
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const countdownEffect = useAudioEffect(SoundEffects.COUNTDOWN);

  const maxPayout = wager * multiplier;

  const { status, joiningFinish, cooldownFinish, resetState, isGamblerParticipant } =
    useCrashGameStore([
      'joiningFinish',
      'status',
      'updateState',
      'resetState',
      'cooldownFinish',
      'isGamblerParticipant',
    ]);

  const timeLeft = useCountdown(cooldownFinish, () => {
    resetState();
  });

  const handleTimeLeftChange = (timeLeft: CountdownContextState) =>
    timeLeft.seconds == 3 && countdownEffect.play();

  return (
    <UnityBetControllerContainer className="wr-top-[600px] wr-z-[15] wr-w-full md:wr-top-0 md:!wr-w-[264px]">
      <div className="wr-mb-2">
        <div className="wr-mb-3 wr-hidden md:!wr-block">
          <BetControllerTitle>
            <img src={options?.scene?.logo} width={140} height={60} alt="game_logo" />
          </BetControllerTitle>
        </div>

        <div
          className={cn(
            'wr-mb-3 wr-flex wr-flex-col wr-gap-3 wr-font-dewi max-md:wr-absolute max-md:wr-left-2.5 max-md:wr-top-[-590px]',
            {
              'wr-invisible': status === MultiplayerGameStatus.Finish,
            }
          )}
        >
          <span className="wr-text-[12px] wr-uppercase wr-text-unity-white-50">Next round in</span>

          {joiningFinish > 0 ? (
            <CountdownProvider
              targetDate={new Date(joiningFinish * 1000)?.toISOString()}
              onTimeLeftChange={handleTimeLeftChange}
            >
              <section className="wr-flex wr-items-center wr-gap-2 ">
                <div className="wr-text-[48px] wr-font-bold wr-leading-[64px] wr-text-white">
                  <Minutes />
                </div>
                <div className="wr-text-[48px] wr-font-bold wr-leading-[64px] wr-text-white">:</div>
                <div className="wr-text-[48px] wr-font-bold wr-leading-[64px] wr-text-white">
                  <Seconds />
                </div>
              </section>
            </CountdownProvider>
          ) : (
            <span className="wr-text-[48px] wr-font-bold wr-leading-[64px] wr-text-white">
              Waiting...
            </span>
          )}
        </div>

        <UnityWagerFormField minWager={minWager} maxWager={maxWager} />

        <FormField
          control={form.control}
          name="multiplier"
          render={({ field }) => (
            <div className="wr-mb-3 wr-w-full">
              <FormLabel className="wr-text-unity-white-50">Multiplier</FormLabel>
              <FormControl className="relative">
                <>
                  <NumberInput.Root {...field} isDisabled={false}>
                    <NumberInput.Container
                      className={cn(
                        'wr-rounded-b-none wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-pl-2 wr-backdrop-blur-md',
                        {
                          ['wr-border wr-border-solid wr-border-red-600']:
                            !!form.formState.errors.multiplier,
                        }
                      )}
                    >
                      <NumberInput.Input
                        className={cn(
                          'wr-rounded-none wr-border-none wr-bg-transparent wr-px-0 py-2 wr-font-semibold leading-5 outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
                        )}
                      />
                    </NumberInput.Container>
                  </NumberInput.Root>
                  <Slider.Root
                    className={cn(
                      'wr-relative wr--mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center'
                    )}
                    value={[field.value]}
                    min={1.01}
                    max={100}
                    step={0.01}
                    onValueChange={(e) => {
                      sliderEffect.play();
                      form.setValue('multiplier', e[0]!, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Slider.Track className="wr-relative wr-h-1 wr-w-full wr-grow wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
                      <Slider.Range className="wr-absolute wr-h-full wr-bg-[#5B6CFF]" />
                    </Slider.Track>
                    <Slider.Thumb className="wr-border-primary wr-ring-offset-background wr-focus-visible:ring-ring wr-flex  wr-h-2 wr-w-2 wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-opacity-50" />
                  </Slider.Root>
                </>
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        <div className="wr-mb-3 wr-w-full">
          <FormLabel className="wr-text-unity-white-50">Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] ',
              'wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md'
            )}
          >
            <WagerCurrencyIcon />
            <span className={cn('wr-font-semibold wr-text-zinc-100')}>
              ${toFormatted(maxPayout, 2)}
            </span>
          </div>
        </div>
        <PreBetButton>
          <Button
            type="submit"
            variant={'crash'}
            className="wr-w-full wr-uppercase"
            size={'xl'}
            onClick={() => clickEffect.play()}
            disabled={
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              status === MultiplayerGameStatus.Finish ||
              isGamblerParticipant
            }
          >
            {form.formState.isSubmitting || form.formState.isLoading
              ? 'Placing bet...'
              : timeLeft > 0 && status === MultiplayerGameStatus.Finish
                ? `Next game in ${timeLeft} seconds`
                : 'Place a bet'}
          </Button>
        </PreBetButton>

        <footer className="wr-hidden wr-mt-3 lg:wr-flex wr-items-center wr-justify-between max-md:wr-absolute max-md:wr-top-14">
          <UnityAudioController />
        </footer>
      </div>
    </UnityBetControllerContainer>
  );
};
