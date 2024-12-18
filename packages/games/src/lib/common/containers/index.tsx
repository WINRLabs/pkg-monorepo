import * as Slider from '@radix-ui/react-slider';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { SoundEffects, useAudioEffect } from '../../hooks/use-audio-effect';
import { cn } from '../../utils/style';

interface Props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const SceneContainer: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <section
      id="animationScene"
      className={cn(
        'wr-relative wr-flex wr-w-full wr-flex-col wr-items-center wr-justify-between wr-rounded-lg wr-bg-cover wr-bg-no-repeat wr-p-3.5 lg:wr-px-16 lg:wr-pb-12 lg:wr-pt-[14px] wr-bg-onyx-700',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export const GameContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={cn('wr-flex wr-gap-3 max-lg:wr-flex-col-reverse', className)}>{children}</div>
  );
};

export const BetControllerContainer: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <section
      className={cn(
        'wr-flex wr-flex-shrink-0 wr-flex-col wr-justify-between wr-rounded-lg wr-bg-onyx-700 wr-px-4 wr-py-3 lg:wr-py-3 lg:wr-w-[340px] bet-controller',
        className
      )}
      data-bet-controller
      {...props}
    >
      {children}
    </section>
  );
};

export const BetCountSlider = ({ ...props }) => {
  const form = useFormContext();
  const sliderEffect = useAudioEffect(SoundEffects.SPIN_TICK_1X);
  const betCount = form.watch('betCount');
  const debouncedBetCount = useDebounce(betCount, 25);

  React.useEffect(() => {
    sliderEffect.play();
  }, [debouncedBetCount[0]]);

  return (
    <Slider.Root
      className={cn(
        'wr-relative -wr-mt-2 wr-flex wr-w-full wr-touch-none wr-select-none wr-items-center',
        {
          'wr-cursor-none wr-pointer-events-none wr-opacity-60': props.disabled,
        }
      )}
      min={props.minValue || 1}
      value={[props.value]}
      max={props.maxValue}
      onValueChange={(e) => {
        form.setValue('betCount', e[0], { shouldValidate: true });
      }}
    >
      <Slider.Track className="wr-relative wr-h-[6px] wr-w-full wr-grow wr-cursor-pointer wr-overflow-hidden wr-rounded-full wr-rounded-tl-md wr-rounded-tr-md wr-bg-zinc-600">
        <Slider.Range className="wr-absolute wr-h-full wr-bg-red-600" />
      </Slider.Track>
      <Slider.Thumb className="wr-border-primary wr-ring-offset-background focus-visible:wr-ring-ring wr-flex wr-h-[10px] wr-w-[10px] wr-cursor-pointer wr-items-center wr-justify-center wr-rounded-full wr-border-2 wr-bg-white wr-text-[12px] wr-font-medium wr-text-zinc-900 wr-transition-colors focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 wr-disabled:pointer-events-none wr-disabled:opacity-50" />
    </Slider.Root>
  );
};

export const UnityGameContainer: React.FC<Props & { id?: string }> = ({
  children,
  className,
  id,
}) => {
  return (
    <section className={cn('wr-relative wr-w-full wr-p-0', className)} id="animationScene">
      {children}
    </section>
  );
};

export const UnityBetControllerContainer: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <section
      className={cn('wr-absolute wr-left-0 wr-top-0 wr-w-[264px] wr-p-[14px]', className)}
      {...props}
    >
      {children}
    </section>
  );
};

export const UnitySceneContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <section
      className={cn(
        'wr-absolute wr-left-0 wr-top-0 wr-flex wr-h-full wr-w-full wr-flex-col wr-items-center wr-justify-between wr-pb-8 wr-pt-[14px]',
        className
      )}
    >
      {children}
    </section>
  );
};
