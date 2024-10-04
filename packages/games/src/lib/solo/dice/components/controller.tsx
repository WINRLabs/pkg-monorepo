import { useFormContext } from 'react-hook-form';

import { cn } from '../../../../lib/utils/style';
import { IconPercentageCircle, IconSwitchHorizontal } from '../../../svgs';
import { Button } from '../../../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../ui/form';
import { NumberInput } from '../../../ui/number-input';
import { useDiceGameStore } from '..';
import { DiceForm } from '../types';

export interface RangeControllerProps {
  winMultiplier: number;
  disabled?: boolean;
}

const InputAppend = ({ children }: { children: React.ReactNode }) => {
  return <div className="wr-absolute wr-right-2">{children}</div>;
};

export const Controller: React.FC<RangeControllerProps> = ({ winMultiplier, disabled }) => {
  const form = useFormContext() as DiceForm;

  const { gameStatus } = useDiceGameStore(['gameStatus']);

  return (
    <div className="wr-relative wr-flex wr-gap-2 wr-bg-onyx-400 wr-rounded-lg wr-py-3.5 wr-px-[18px] wr-w-full">
      <FormItem className="!wr-mb-0 wr-flex-1">
        <FormControl>
          <NumberInput.Root
            className="wr-opacity-100 wr-pointer-events-none wr-cursor-default"
            value={winMultiplier}
            onChange={(val) => null}
          >
            <FormLabel className="wr-text-zinc-400 wr-font-normal">Multiplier</FormLabel>
            <NumberInput.Container
              className={cn(
                'wr-rounded-md wr-border wr-border-zinc-800 wr-bg-zinc-950 wr-py-[10px] wr-relative'
              )}
            >
              <NumberInput.Input
                decimalScale={2}
                className={cn(
                  'wr-border-none wr-bg-transparent wr-px-2 wr-py-2 wr-font-semibold wr-leading-5 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0'
                )}
              />
              {/* <InputAppend>
                <IconCloseCircle className="wr-h-5 wr-w-" />
              </InputAppend> */}
            </NumberInput.Container>
          </NumberInput.Root>
        </FormControl>
        <FormMessage className="wr-absolute wr-left-2 wr-top-20" />
      </FormItem>

      <FormField
        control={form.control}
        name="rollValue"
        render={({ field }) => (
          <FormItem className="!wr-mb-0 wr-flex-1 wr-relative">
            <FormControl>
              <NumberInput.Root
                {...field}
                isDisabled={
                  disabled ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == 'PLAYING'
                }
                onChange={(val) => {
                  field.onChange(val);

                  const { rollType } = form.getValues();

                  const newValue = rollType === 'UNDER' ? val : 100 - val;

                  form.setValue('winChance', newValue, {
                    shouldValidate: true,
                  });
                }}
              >
                <FormLabel className="wr-text-zinc-400 wr-font-normal">
                  Roll {form.getValues().rollType === 'OVER' ? 'Over' : 'Under'}
                </FormLabel>
                <NumberInput.Container
                  className={cn(
                    'wr-rounded-md wr-border wr-border-zinc-800 wr-bg-zinc-950 wr-py-[10px] wr-relative'
                  )}
                >
                  <NumberInput.Input
                    decimalScale={2}
                    className={cn(
                      'wr-border-none wr-bg-transparent wr-px-2 wr-py-2 wr-font-semibold wr-leading-5 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0'
                    )}
                  />
                  <Button
                    variant={'success'}
                    size={'sm'}
                    type="button"
                    className="wr-mb-1 wr-h-10 wr-w-10 wr-shrink-0 wr-bg-green-500 wr-p-0 hover:wr-bg-green-600 wr-absolute wr-right-0 wr-top-0"
                    onClick={() => {
                      const { rollType, winChance } = form.getValues();

                      const newRollType = rollType === 'OVER' ? 'UNDER' : 'OVER';

                      form.setValue('rollType', newRollType, {
                        shouldValidate: true,
                      });

                      form.setValue('winChance', 100 - winChance, {
                        shouldValidate: true,
                      });
                    }}
                    disabled={
                      disabled ||
                      form.formState.isSubmitting ||
                      form.formState.isLoading ||
                      gameStatus == 'PLAYING'
                    }
                  >
                    <IconSwitchHorizontal
                      className={cn(
                        'wr-h-5 wr-w-5 wr-text-zinc-100 wr-transition-all wr-duration-300 wr-rotate-90'
                      )}
                    />
                  </Button>
                </NumberInput.Container>
              </NumberInput.Root>
            </FormControl>

            <FormMessage className="wr-absolute wr-left-2 wr-top-20" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="winChance"
        render={({ field }) => (
          <FormItem className="!wr-mb-0 wr-flex-1 wr-relative">
            <FormControl>
              <NumberInput.Root
                {...field}
                isDisabled={
                  disabled ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  gameStatus == 'PLAYING'
                }
                onChange={(val) => {
                  field.onChange(val);

                  const { rollType } = form.getValues();

                  const newValue = rollType === 'UNDER' ? val : 100 - val;

                  form.setValue('rollValue', newValue, {
                    shouldValidate: true,
                  });
                }}
              >
                <FormLabel className="wr-text-zinc-400 wr-font-normal">Win Chance</FormLabel>
                <NumberInput.Container
                  className={cn(
                    'wr-rounded-md wr-border wr-border-zinc-800 wr-bg-zinc-950 wr-py-[10px] '
                  )}
                >
                  <NumberInput.Input
                    decimalScale={2}
                    className={cn(
                      'wr-border-none wr-bg-transparent wr-px-2 wr-py-2  wr-font-semibold wr-leading-5 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0'
                    )}
                  />
                  <InputAppend>
                    <IconPercentageCircle className="wr-size-5" />
                  </InputAppend>
                </NumberInput.Container>
              </NumberInput.Root>
            </FormControl>
            <FormMessage className="wr-absolute wr-left-2 wr-top-20" />
          </FormItem>
        )}
      />
    </div>
  );
};
