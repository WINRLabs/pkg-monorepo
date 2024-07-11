"use client";

import React from "react";

import { INumberInputContext, NumberInput } from "../ui/number-input";
import { cn } from "../utils/style";

interface Props extends INumberInputContext {
  children?: React.ReactNode;
  hasError?: boolean;
  className?: string;
  containerClassName?: string;
}

export const StopGainLossInput = ({
  className,
  hasError,
  containerClassName,
  ...rest
}: Props) => {
  return (
    <NumberInput.Root {...rest}>
      <NumberInput.Container
        className={cn(
          "wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px]",
          {
            ["wr-border wr-border-solid wr-border-red-600"]: !!hasError,
          },
          containerClassName
        )}
      >
        <NumberInput.Input
          className={cn(
            "wr-border-none wr-bg-transparent wr-px-0 wr-py-2 wr-text-xl wr-leading-5 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0",
            className
          )}
        />
      </NumberInput.Container>
    </NumberInput.Root>
  );
};
