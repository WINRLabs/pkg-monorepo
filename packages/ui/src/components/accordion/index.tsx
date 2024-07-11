"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

import { ChevronDown } from "../../svgs";
import { cn } from "../../utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("wr-border-b", className)}
    {...props}
  />
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="wr-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "wr-flex wr-flex-1 wr-items-center wr-justify-between wr-py-4 wr-font-medium wr-transition-all [&[data-state=open]>svg]:wr-rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="wr-shrink-0 wr-transition-transform wr-duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "wr-overflow-hidden wr-text-sm wr-transition-all data-[state=closed]:wr-animate-accordion-up data-[state=open]:wr-animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="wr-p-0">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent,AccordionItem, AccordionTrigger };
