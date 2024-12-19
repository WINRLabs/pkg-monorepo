import * as Slider from '@radix-ui/react-slider';
import { useFormContext } from 'react-hook-form';

import { BetControllerContainer } from '../../../../common/containers';
import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { useGame } from '../../../../game-provider';
import { useAudioEffect } from '../../../../hooks/use-audio-effect';
import { SoundEffects } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form';
import { NumberInput } from '../../../../ui/number-input';
import { cn } from '../../../../utils/style';
import { MultiplayerGameStatus } from '../../../core/type';
import { useCrashGameStore } from '../../crash.store';
import { CrashForm } from '../../types';
import Participants from './participants';

interface CrashBetControllerProps {
  minWager: number;
  maxWager: number;

  onLogin?: () => void;
  isPinNotFound?: boolean;
}
export default function CrashBetController({ minWager, maxWager }: CrashBetControllerProps) {
  const { updateState, status, isGamblerParticipant } = useCrashGameStore((state) => ({
    updateState: state.updateState,
    status: state.status,
    isGamblerParticipant: state.isGamblerParticipant,
  }));
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const { readyToPlay } = useGame();
  const form: CrashForm = useFormContext();

  return (
    <BetControllerContainer>
      <div>
        <WagerFormField minWager={minWager} maxWager={maxWager} />
        <FormField
          control={form.control}
          name="multiplier"
          render={({ field }) => (
            <FormItem className="wr-mb-3 lg:wr-mb-6">
              <FormLabel>Multiplier (1.1-{100}) </FormLabel>

              <FormControl>
                <div>
                  <NumberInput.Root {...field}>
                    <NumberInput.Container
                      className={cn(
                        'wr-rounded-b-[6px] wr-border-none wr-bg-zinc-950 wr-px-2  wr-py-[10px] multiplier-input'
                      )}
                    >
                      <NumberInput.Input
                        className={cn(
                          'wr-rounded-none wr-border-none  wr-bg-transparent wr-px-0 wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0'
                        )}
                      />
                    </NumberInput.Container>
                  </NumberInput.Root>
                  <Slider.Root
                    className={cn(
                      'wr-relative -wr-mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center'
                    )}
                    min={1.1}
                    value={[field.value]}
                    max={100}
                    step={1}
                    onValueChange={(e: any) => {
                      form.setValue('multiplier', e[0], {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
                      <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
                    </Slider.Track>
                    <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex  wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-opacity-50" />
                  </Slider.Root>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <PreBetButton onLogin={() => null} isPinNotFound={false}>
          <Button
            type="submit"
            variant={'success'}
            className={cn(
              'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none'
            )}
            disabled={
              !readyToPlay ||
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              status === MultiplayerGameStatus.Finish ||
              isGamblerParticipant
            }
            size={'xl'}
            onClick={() => {
              updateState({ status: MultiplayerGameStatus.Start, finalMultiplier: 1.2 });
              clickEffect.play();
            }}
          >
            Start Game
          </Button>
        </PreBetButton>
        <Participants />
      </div>
    </BetControllerContainer>
  );
}
