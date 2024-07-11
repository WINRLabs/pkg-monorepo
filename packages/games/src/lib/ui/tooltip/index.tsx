"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "../../utils/style";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "wr-z-50 wr-overflow-hidden wr-rounded-md wr-border wr-border-zinc-800 wr-bg-zinc-900 wr-px-3 wr-py-1.5 wr-text-sm wr-text-white wr-shadow-md wr-animate-in wr-fade-in-0 wr-zoom-in-95 data-[state=closed]:wr-animate-out data-[state=closed]:wr-fade-out-0 data-[state=closed]:wr-zoom-out-95 data-[side=bottom]:wr-slide-in-from-top-2 data-[side=left]:wr-slide-in-from-right-2 data-[side=right]:wr-slide-in-from-left-2 data-[side=top]:wr-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider,TooltipTrigger };
