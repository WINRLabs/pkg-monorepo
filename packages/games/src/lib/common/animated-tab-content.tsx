"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

import { cn } from "../utils/style";

export const AnimatedTabContent = ({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  return (
    <TabsContent
      value={value}
      className="group grid grid-cols-1 items-center transition-all duration-500 data-[state=active]:translate-y-[0px] data-[state=inactive]:-translate-y-[50px] data-[state=active]:opacity-100 data-[state=inactive]:opacity-0 motion-safe:animate-in"
    >
      <div className={cn(className)}>{children}</div>
    </TabsContent>
  );
};
