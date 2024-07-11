"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "../utils/style";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    thumbClassName?: string;
  }
>(({ className, thumbClassName, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "focus-visible:wr-ring-offset-background data-[state=unchecked]:wr-bg-input wr-border-transparen focus-visible:wr-ring-ring wr-peer wr-inline-flex wr-h-[16px] wr-w-[32px] wr-shrink-0 wr-cursor-pointer wr-items-center wr-rounded-full wr-border-2 wr-border-none wr-bg-zinc-700 wr-transition-colors data-[state=checked]:wr-bg-red-600 focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-cursor-not-allowed disabled:wr-opacity-50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "wr-bg-background wr-pointer-events-none -wr-ml-[1px] wr-block wr-h-[16px] wr-w-[16px] wr-rounded-full wr-border-2 wr-bg-white wr-shadow-lg wr-ring-0 wr-transition-transform data-[state=checked]:wr-translate-x-5 data-[state=unchecked]:wr-translate-x-0 data-[state=checked]:wr-border-white",
        thumbClassName
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
