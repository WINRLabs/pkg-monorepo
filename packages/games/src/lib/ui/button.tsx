"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/style";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "focus-visible:wr-ring-ring wr-inline-flex wr-h-2 wr-items-center wr-justify-center wr-rounded-md wr-px-3 wr-py-0 wr-text-[15px] wr-font-semibold wr-leading-4 wr-transition wr-duration-300 wr-ease-out hover:wr-ease-in focus-visible:wr-outline-none focus-visible:wr-ring-2 focus-visible:wr-ring-offset-2 disabled:wr-pointer-events-none disabled:wr-cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "wr-bg-red-600 wr-text-white wr-transition-all wr-duration-200 hover:wr-bg-red-700 disabled:wr-bg-red-950 disabled:wr-text-zinc-500",
        secondary:
          "wr-bg-zinc-800 wr-text-zinc-100 hover:wr-bg-zinc-700 disabled:wr-bg-zinc-800 disabled:wr-text-zinc-500",
        third:
          "wr-bg-unity-white-15 wr-font-semibold wr-text-unity-white-50 wr-backdrop-blur-md hover:wr-bg-unity-white-50 hover:wr-text-white disabled:wr-bg-unity-white-5",
        outline:
          "wr-border wr-border-zinc-800 wr-bg-transparent wr-text-zinc-100 hover:wr-bg-zinc-800 disabled:wr-text-zinc-500",
        success:
          "wr-bg-green-500 wr-transition-all wr-duration-200 hover:wr-bg-green-600 disabled:wr-bg-green-800 disabled:wr-text-zinc-400 disabled:wr-opacity-90",
        coinflip:
          // eslint-disable-next-line
          "wr-bg-gradient-to-t wr-from-unity-coinflip-purple-700 wr-to-unity-coinflip-purple-400 bg-[size:wr-_200%] bg-[position:wr-_0%_0%] wr-font-furore wr-transition-all wr-duration-300 hover:wr-from-unity-coinflip-purple-400 hover:wr-to-unity-coinflip-purple-700 hover:wr-bg-[position",
        "horse-race":
          // eslint-disable-next-line
          "wr-bg-horse-race-bet-button-bg bg-[size:wr-100%] wr-bg-no-repeat wr-font-barlowCondensed wr-text-[22px] wr-font-[900] wr-uppercase wr-italic wr-leading-8 wr-tracking-wider wr-transition-all wr-duration-300 [text-shadow:wr-_0px_2px_0px_#054352] hover:wr-scale-110 hover:wr-ease-in disabled:wr-bg-horse-race-bet-button-bg-disabled md:wr-bg-contain",
        crash:
          "bg-[#5B6CFF] transition-all duration-300 hover:bg-[#3C4DE1] disabled:bg-zinc-700",
        plinko: `!wr-rounded-none wr-bg-plinko-button bg-[size:wr-100%] wr-bg-no-repeat wr-font-furore wr-text-2xl wr-leading-6 wr-transition-all wr-duration-300 [text-shadow:wr-_0px_2px_0px_#054352] [box-shadow:wr-0px_2.7px_0px_0px_#004265] hover:wr-scale-110 hover:wr-ease-in disabled:wr-bg-plinko-button-disabled lg:wr-bg-contain`,
      },
      size: {
        sm: "wr-h-7 wr-rounded-sm",
        md: "wr-h-9 wr-rounded-md",
        lg: "wr-h-10 wr-rounded-md",
        xl: "wr-h-12 wr-rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withIcon?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      withIcon = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          "wr-flex wr-items-center wr-gap-2": withIcon,
        })}
        ref={ref}
        {...props}
      >
        {isLoading ? <Spinner /> : props.children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
