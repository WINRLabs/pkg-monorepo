import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../../constants';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { FormControl, FormField, FormItem } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { CoinSide } from '../../constants';
import useCoinFlipGameStore from '../../store';
import { CoinFlipForm } from '../../types';

export const CoinFlipController = ({ className }: { className?: string }) => {
  const form = useFormContext() as CoinFlipForm;
  const clickEffect = useAudioEffect(SoundEffects.LIMBO_TICK);

  const { gameStatus } = useCoinFlipGameStore(['gameStatus']);

  return (
    <FormField
      control={form.control}
      name="coinSide"
      render={({ field }) => (
        <FormItem className={cn('wr-h-10 wr-w-full coin-flip-controller', className)}>
          <FormControl>
            <RadioGroupPrimitive.Root
              onValueChange={(v) => {
                clickEffect.play();
                field.onChange(v);
              }}
              className="wr-grid wr-h-full wr-w-full wr-grid-cols-2 wr-items-center wr-justify-center wr-gap-0 wr-rounded-md wr-bg-unity-white-15 wr-font-semibold"
              defaultValue={field.value as unknown as string}
              disabled={
                form.formState.isSubmitting || form.formState.isLoading || gameStatus == 'PLAYING'
              }
            >
              <FormItem className="wr-mb-0 wr-h-full wr-text-center">
                <FormControl>
                  <>
                    <RadioGroupPrimitive.Item
                      value={CoinSide.HEADS as unknown as string}
                      className="wr-relative wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-text-unity-white-50"
                    >
                      <img
                        src={`${CDN_URL}/coin-flip-2d/doge.png`}
                        width={20}
                        height={20}
                        alt="doge_icon"
                      />
                      DOGE
                      <RadioGroupPrimitive.Indicator className="wr-absolute wr-left-0 wr-top-0 wr-flex wr-h-10 wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-rounded-md wr-bg-gradient-to-t wr-bg-green-500 wr-text-zinc-100">
                        <img
                          src={`${CDN_URL}/coin-flip-2d/doge.png`}
                          width={20}
                          height={20}
                          alt="doge_icon"
                        />
                        DOGE
                      </RadioGroupPrimitive.Indicator>
                    </RadioGroupPrimitive.Item>
                    {/* <span
                        className={cn(
                          'wr-relative wr-top-2 lg:!wr-flex wr-items-center wr-justify-center wr-gap-1 wr-text-zinc-100 wr-hidden',
                          {
                            'wr-text-lime-500': field.value === CoinSide.HEADS,
                            'wr-text-red-500': field.value === CoinSide.TAILS,
                          }
                        )}
                      >
                        {field.value === CoinSide.HEADS
                          ? `+$${toFormatted(wager * WIN_MULTIPLIER, 3)}`
                          : `-$${toFormatted(wager, 3)}`}
                      </span> */}
                  </>
                </FormControl>
              </FormItem>
              <FormItem className="wr-mb-0 wr-h-full">
                <>
                  <FormControl>
                    <RadioGroupPrimitive.Item
                      value={CoinSide.TAILS as unknown as string}
                      className="wr-relative wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-text-unity-white-50 "
                    >
                      <img
                        src={`${CDN_URL}/coin-flip-2d/pepe.png`}
                        width={20}
                        height={20}
                        alt="pepe_icon"
                      />
                      PEPE
                      <RadioGroupPrimitive.Indicator className="wr-h-10 wr-absolute wr-left-0 wr-top-0 wr-flex wr-w-full wr-items-center wr-justify-center wr-gap-1 wr-rounded-md wr-bg-gradient-to-t wr-bg-green-500 wr-text-zinc-100">
                        <img
                          src={`${CDN_URL}/coin-flip-2d/pepe.png`}
                          width={20}
                          height={20}
                          alt="pepe_icon"
                        />
                        PEPE
                      </RadioGroupPrimitive.Indicator>
                    </RadioGroupPrimitive.Item>
                  </FormControl>
                  {/* <span
                      className={cn(
                        'wr-relative wr-top-2 lg:!wr-flex wr-items-center wr-justify-center wr-gap-1 wr-text-zinc-100 wr-hidden',
                        {
                          'wr-text-lime-500': field.value === CoinSide.TAILS,
                          'wr-text-red-500': field.value === CoinSide.HEADS,
                        }
                      )}
                    >
                      {field.value === CoinSide.TAILS
                        ? `+$${toFormatted(wager * WIN_MULTIPLIER, 3)}`
                        : `-$${toFormatted(wager, 3)}`}
                    </span> */}
                </>
              </FormItem>
            </RadioGroupPrimitive.Root>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
