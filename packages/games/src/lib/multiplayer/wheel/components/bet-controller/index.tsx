import * as Radio from '@radix-ui/react-radio-group';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { AudioController } from '../../../../common/audio-controller';
import { BetControllerContainer } from '../../../../common/containers';
import { BetControllerTitle, WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { WagerCurrencyIcon } from '../../../../common/wager';
import { useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import useCountdown from '../../../../hooks/use-time-left';
// import useWheelGameStore from "../../_store/game-info-store";
// import useCountdown from "@/hooks/use-time-left";
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import { MultiplayerGameStatus } from '../../../core/type';
import { colorMultipliers, participantMapWithStore, WheelColor } from '../../constants';
import { useWheelTheme } from '../../providers/theme';
import { useWheelGameStore } from '../../store';
import { WheelForm } from '../../types';

interface Props {
  minWager: number;
  maxWager: number;
  isPinNotFound?: boolean;
  onLogin?: () => void;
}

const BetController: React.FC<Props> = ({ minWager, maxWager, isPinNotFound, onLogin }) => {
  const {
    cooldownFinish,
    status,
    resetState,
    resetWheelParticipant,
    isGamblerParticipant,
    setIsGamblerParticipant,
    submitDisabled,
  } = useWheelGameStore([
    'cooldownFinish',
    'status',
    'resetState',
    'resetWheelParticipant',
    'isGamblerParticipant',
    'setIsGamblerParticipant',
    'submitDisabled',
  ]);

  const { dictionary } = useGameOptions();
  const {
    hideWager,
    tokenPrefix,
    controllerHeader,
    hideMaxPayout,
    controllerFooter,
    betControllerBackground,
  } = useWheelTheme();

  const form = useFormContext() as WheelForm;

  const betClickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const chosenColor = form.watch('color');

  const currentWager = form.watch('wager');

  const maxPayout = React.useMemo(() => {
    return toDecimals(colorMultipliers[chosenColor as WheelColor] * currentWager);
  }, [chosenColor, currentWager]);

  const timeLeft = useCountdown(cooldownFinish, () => {
    resetState();
    resetWheelParticipant();
    setIsGamblerParticipant(false);
  });

  return (
    <BetControllerContainer
      data-wheel-bet-controller
      style={{ backgroundColor: betControllerBackground || '' }}
    >
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        {controllerHeader ? (
          controllerHeader
        ) : (
          <div className="lg:wr-mb-3">
            <BetControllerTitle>Wheel</BetControllerTitle>
          </div>
        )}

        {!hideWager && (
          <WagerFormField
            minWager={minWager}
            maxWager={maxWager}
            isDisabled={form.formState.isSubmitting || form.formState.isLoading}
          />
        )}
        <div className="wr-mb-3 lg:wr-mb-6">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="wr-mb-0">
                <FormLabel className="wr-text-white/50 lg:!wr-block wr-hidden">Choose</FormLabel>
                <FormControl>
                  <Radio.RadioGroup
                    onValueChange={(e) => {
                      clickEffect.play();
                      field.onChange(e);
                    }}
                    defaultValue={field.value}
                    className="wr-grid wr-h-9 wr-w-full wr-grid-cols-4 wr-grid-rows-1 wr-gap-[6px]"
                  >
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            'wr-h-full wr-w-full wr-rounded-md wr-bg-white/25 wr-text-zinc-200 wr-transition-all wr-ease-in data-[state=checked]:wr-bg-white  data-[state=checked]:wr-text-zinc-600 wr-font-semibold'
                          )}
                          value={WheelColor.GREY}
                          data-wheel-controller-multiplier={
                            participantMapWithStore[WheelColor.GREY]
                          }
                        >
                          2x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            'wr-h-full wr-w-full wr-rounded-md wr-bg-blue-500/25 wr-text-blue-400 wr-transition-all wr-ease-in data-[state=checked]:wr-bg-blue-500 data-[state=checked]:wr-text-zinc-100 wr-font-semibold'
                          )}
                          value={WheelColor.BLUE}
                          data-wheel-controller-multiplier={
                            participantMapWithStore[WheelColor.BLUE]
                          }
                        >
                          3x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            'wr-h-full wr-w-full wr-rounded-md wr-bg-green-500/25  wr-text-green-500 wr-transition-all wr-ease-in data-[state=checked]:wr-bg-green-500 data-[state=checked]:wr-text-zinc-100 wr-font-semibold'
                          )}
                          value={WheelColor.GREEN}
                          data-wheel-controller-multiplier={
                            participantMapWithStore[WheelColor.GREEN]
                          }
                        >
                          6x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                    <FormItem className="wr-mb-0">
                      <FormControl>
                        <Radio.Item
                          className={cn(
                            'wr-h-full wr-w-full wr-rounded-md wr-bg-red-600/25 wr-text-red-600  wr-transition-all wr-ease-in data-[state=checked]:wr-bg-red-600 data-[state=checked]:wr-text-zinc-100 wr-font-semibold'
                          )}
                          value={WheelColor.RED}
                          data-wheel-controller-multiplier={participantMapWithStore[WheelColor.RED]}
                        >
                          48x
                        </Radio.Item>
                      </FormControl>
                    </FormItem>
                  </Radio.RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {!hideMaxPayout && (
          <div className="wr-mb-6 lg:!wr-block wr-hidden ">
            <div>
              <FormLabel>{dictionary.maxPayout}</FormLabel>
              <div
                className={cn(
                  'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] max-reward'
                )}
              >
                <WagerCurrencyIcon />
                <span className={cn('wr-font-semibold wr-text-zinc-100')}>
                  {tokenPrefix}
                  {toFormatted(maxPayout, 2)}
                </span>
              </div>
            </div>
          </div>
        )}
        <PreBetButton onLogin={onLogin} isPinNotFound={isPinNotFound}>
          <Button
            type="submit"
            variant={'success'}
            className="wr-w-full wr-uppercase"
            size={'xl'}
            onClick={() => betClickEffect.play()}
            isLoading={form.formState.isSubmitting || form.formState.isLoading}
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              (timeLeft > 0 && status === MultiplayerGameStatus.Wait && isGamblerParticipant) ||
              isGamblerParticipant ||
              (timeLeft > 0 && status === MultiplayerGameStatus.Finish) ||
              chosenColor === WheelColor.IDLE ||
              submitDisabled
            }
          >
            {timeLeft >= 0 && status === MultiplayerGameStatus.Finish
              ? `Next game in ${timeLeft} seconds`
              : chosenColor !== WheelColor.IDLE
                ? dictionary.submitBtn
                : 'CHOOSE COLOR'}
          </Button>
        </PreBetButton>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
        {controllerFooter}
      </footer>
    </BetControllerContainer>
  );
};

export default BetController;
