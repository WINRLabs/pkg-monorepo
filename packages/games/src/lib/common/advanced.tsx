"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface Props {
  children?: React.ReactNode;
}

export const Advanced: React.FC<Props> = ({ children }) => {
  const [accordionValue, setAccordionValue] = React.useState<string>("");

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={(val) => {
        setAccordionValue(val);
      }}
    >
      <AccordionItem value="advanced" className="wr-border-b-0">
        <AccordionPrimitive.Header className="wr-flex">
          <AccordionPrimitive.Trigger
            className={
              "wr-group wr-flex wr-flex-1 wr-items-center wr-justify-between wr-pb-4 wr-font-medium wr-transition-all"
            }
          >
            <Label className="wr-text-white">Advanced</Label>
            <Switch
              className="wr-h-5 wr-w-10 wr-rounded-md wr-bg-zinc-800 data-[state=checked]:wr-bg-lime-600"
              thumbClassName="wr-rounded-sm wr-bg-zinc-500 wr-h-5 wr-w-5 wr-border-zinc-500 data-[state=checked]:wr-border-white data-[state=checked]:wr-bg-white"
              id="advanced-switch"
              checked={accordionValue === "advanced"}
              onCheckedChange={(checked) => {
                if (checked) {
                  setAccordionValue("advanced");
                } else {
                  setAccordionValue("");
                }
              }}
            />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
