"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../../utils/style";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "wr-shrink-0 wr-bg-zinc-800 ",
        orientation === "horizontal"
          ? "wr-h-[1px] wr-w-full"
          : "wr-h-full wr-w-[1px]",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
