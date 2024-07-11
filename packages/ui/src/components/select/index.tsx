"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { IconChevronDown } from "../../svgs";
import { cn } from "../../utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "wr-border-input wr-bg-background wr-ring-offset-background wr-placeholder:text-muted-foreground wr-group wr-flex wr-h-10 wr-w-full wr-items-center wr-justify-between wr-rounded-md wr-border wr-px-3 wr-py-2 wr-text-sm  wr-font-semibold wr-text-white disabled:wr-cursor-not-allowed disabled:wr-opacity-50",

      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <IconChevronDown className="wr-h-5 w-5 wr-transition-all wr-duration-300 group-data-[state=open]:wr-rotate-180 max-md:h-4 max-md:w-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "wr-bg-popover wr-text-popover-foreground wr-relative wr-z-50 wr-min-w-[8rem] wr-overflow-hidden wr-rounded-md wr-border wr-border-zinc-800 wr-shadow-md wr-outline-none data-[state=open]:wr-animate-in data-[state=closed]:wr-animate-out data-[state=closed]:wr-fade-out-0 data-[state=open]:wr-fade-in-0 data-[state=closed]:wr-zoom-out-95 data-[state=open]:wr-zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:wr-translate-y-1 data-[side=left]:-wr-translate-x-1 data-[side=right]:wr-translate-x-1 data-[side=top]:-wr-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "wr-p-1",
          position === "popper" &&
            "wr-h-[var(--radix-select-trigger-height)] wr-w-full wr-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "wr-py-1.5 wr-pl-8 wr-pr-2 wr-text-sm wr-font-semibold",
      className
    )}
    {...props}
  />
));

SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "wr-relative wr-flex wr-w-full wr-cursor-pointer wr-select-none wr-items-center wr-rounded-sm wr-py-1.5 wr-pl-1 wr-pr-2 wr-text-sm wr-outline-none data-[disabled]:wr-pointer-events-none data-[disabled]:wr-opacity-50 wr-hover:wr-bg-zinc-800",
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("wr-bg-muted -mx-1 wr-my-1 wr-h-px", className)}
    {...props}
  />
));

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
