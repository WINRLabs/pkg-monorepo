'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '../../utils/style';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root className={cn('wr-grid wr-gap-2', className)} {...props} ref={ref} />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'wr-border-primary wr-text-primary focus-visible:wr-ring-ring disabled:cursor-not-allowed disabled:opacity-50 wr-aspect-square wr-h-4 wr-w-4 wr-rounded-full wr-border-2 wr-shadow focus:wr-outline-none focus-visible:wr-ring-1',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="wr-relative wr-flex wr-h-full wr-w-full wr-items-center wr-justify-center">
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-h-2.5 wr-w-2.5 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-rounded-full wr-bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
