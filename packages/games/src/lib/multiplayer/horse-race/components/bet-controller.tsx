import * as Radio from '@radix-ui/react-radio-group';
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
import { FormControl, FormField, FormItem, FormLabel } from '../../../ui/form';
import { cn } from '../../../utils/style';
import { toFormatted } from '../../../utils/web3';
import { Horse, HorseRaceStatus } from '../constants';
import useHorseRaceGameStore from '../store';
import { HorseRaceForm } from '../types';

interface Props {
  minWager: number;
  maxWager: number;
  maxPayout: number;
  isGamblerParticipant: boolean;
  logo?: string;
  onLogin?: () => void;
}

export const HorseRaceBetController: React.FC<Props> = ({
  minWager,
  maxWager,
  maxPayout,
  isGamblerParticipant,
  logo,
  onLogin,
}) => {
  const form = useFormContext() as HorseRaceForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const countdownEffect = useAudioEffect(SoundEffects.COUNTDOWN);

  const { updateState, startTime, status, finishTime, resetState } = useHorseRaceGameStore([
    'finishTime',
    'startTime',
    'status',
    'updateState',
    'resetState',
  ]);

  const selectedHorse = form.watch('horse');

  useCountdown(startTime, () => {
    updateState({ status: HorseRaceStatus.Race });
  });

  const finishTimeLeft = useCountdown(finishTime, () => {
    resetState();
  });

  const handleTimeLeftChange = (timeLeft: CountdownContextState) =>
    timeLeft.seconds == 3 && countdownEffect.play();

  return (
    <UnityBetControllerContainer className="wr-top-[276px] wr-z-[50] wr-h-full wr-w-full md:wr-top-0 md:!wr-w-[264px]">
      <div className="wr-mb-3 wr-flex wr-flex-col">
        <div className="wr-mb-3 wr-hidden md:!wr-block">
          <BetControllerTitle>
            {logo && <img src={logo} width={140} height={60} alt="game_logo" />}
          </BetControllerTitle>
        </div>
        <div className="wr-mb-4 wr-flex wr-flex-col wr-gap-3 max-md:wr-mt-[40px]">
          <span className="wr-text-unity-white-50">Next round in</span>

          {startTime > 0 ? (
            <CountdownProvider
              targetDate={new Date(startTime * 1000)?.toISOString()}
              onTimeLeftChange={handleTimeLeftChange}
            >
              <section className="wr-flex wr-items-center wr-gap-2">
                <div className="wr-text-[64px] wr-font-bold wr-leading-[64px] wr-text-white max-md:wr-text-[32px] max-md:wr-leading-[32px]">
                  <Minutes />
                </div>
                <div className="wr-text-[64px] wr-font-bold wr-leading-[64px] wr-text-white max-md:wr-text-[32px] max-md:wr-leading-[32px]">
                  :
                </div>
                <div className="wr-text-[64px] wr-font-bold wr-leading-[64px] wr-text-white max-md:wr-text-[32px] max-md:wr-leading-[32px]">
                  <Seconds />
                </div>
              </section>
            </CountdownProvider>
          ) : (
            <span className="wr-text-[64px] wr-font-bold wr-leading-[64px] wr-text-white max-md:wr-text-[32px] max-md:wr-leading-[32px]">
              Waiting...
            </span>
          )}
        </div>
        <UnityWagerFormField
          minWager={minWager}
          maxWager={maxWager}
          className="wr-order-2 md:wr-order-[unset]"
        />
        <FormField
          control={form.control}
          name="horse"
          render={({ field }) => (
            <FormItem className="wr-order-2 md:wr-order-[unset]">
              <FormLabel className="wr-text-unity-white-50">Choose</FormLabel>
              <FormControl>
                <Radio.RadioGroup
                  onValueChange={(e) => {
                    clickEffect.play();
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                  className="wr-grid wr-grid-cols-5 wr-grid-rows-1 wr-gap-[6px]"
                >
                  <FormItem className="wr-mb-0">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          'wr-h-full wr-w-full wr-rounded-md wr-bg-white/80 wr-py-[10px] wr-text-center wr-text-white wr-transition-all wr-duration-150 wr-hover:text-white wr-font-semibold',
                          {
                            'wr-bg-white/70 wr-text-white': field.value === Horse.ONE,
                          }
                        )}
                        value={Horse.ONE}
                      >
                        2x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="wr-mb-0">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          'wr-h-full wr-w-full wr-rounded-md wr-bg-yellow-400/80 wr-py-[10px] wr-text-center wr-text-yellow-300 wr-transition-all wr-duration-150 wr-hover:text-white wr-font-semibold',
                          {
                            'wr-bg-yellow-600 wr-text-white': field.value === Horse.TWO,
                          }
                        )}
                        value={Horse.TWO}
                      >
                        3x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="wr-mb-0">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          'wr-h-full wr-w-full wr-rounded-md wr-bg-blue-600/70 wr-py-[10px] wr-text-center wr-text-blue-300 wr-font-semibold',
                          {
                            'wr-bg-blue-600 wr-text-white': field.value === Horse.THREE,
                          }
                        )}
                        value={Horse.THREE}
                      >
                        8x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="wr-mb-0 ">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          'wr-h-full wr-w-full wr-rounded-md wr-bg-green-500/80 wr-py-[10px] wr-text-center wr-text-green-300 wr-font-semibold',
                          {
                            'wr-bg-green-500 wr-text-white': field.value === Horse.FOUR,
                          }
                        )}
                        value={Horse.FOUR}
                      >
                        15x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                  <FormItem className="wr-mb-0 ">
                    <FormControl>
                      <Radio.Item
                        className={cn(
                          'wr-h-full wr-w-full wr-rounded-md wr-bg-red-600/80 wr-py-[10px] wr-text-center wr-text-red-300 wr-font-semibold',
                          {
                            'wr-bg-red-600 wr-text-white': field.value === Horse.FIVE,
                          }
                        )}
                        value={Horse.FIVE}
                      >
                        60x
                      </Radio.Item>
                    </FormControl>
                  </FormItem>
                </Radio.RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="wr-order-2 wr-mb-3 wr-w-full md:wr-order-[unset]">
          <FormLabel className="wr-text-unity-white-50">Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]',
              'wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md'
            )}
          >
            <WagerCurrencyIcon />
            <span className={cn('wr-font-semibold wr-text-zinc-100')}>
              ${toFormatted(maxPayout, 2)}
            </span>
          </div>
        </div>
        <PreBetButton
          onLogin={onLogin}
          variant="horse-race"
          className="wr-mb-4 md:wr-mb-0 wr-uppercase"
        >
          <Button
            type="submit"
            variant="horse-race"
            className={cn('wr-order-1 wr-mb-4 wr-w-full md:wr-order-[unset] md:wr-mb-0', {
              'wr-text-sm': finishTimeLeft > 0 && status === HorseRaceStatus.Finished,
            })}
            size={'xl'}
            onClick={() => clickEffect.play()}
            disabled={
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              status === HorseRaceStatus.Race ||
              (finishTimeLeft > 0 && status == HorseRaceStatus.Finished) ||
              isGamblerParticipant ||
              selectedHorse === Horse.IDLE
            }
          >
            {form.formState.isSubmitting || form.formState.isLoading
              ? 'Placing bet...'
              : finishTimeLeft > 0 && status === HorseRaceStatus.Finished
                ? `Next game in ${finishTimeLeft} seconds`
                : 'Place bet'}
          </Button>
        </PreBetButton>
      </div>
      <footer className="wr-absolute wr-bottom-[14px] wr-left-[14px] wr-mt-auto wr-flex wr-items-center wr-justify-between">
        <UnityAudioController />
      </footer>
    </UnityBetControllerContainer>
  );
};
