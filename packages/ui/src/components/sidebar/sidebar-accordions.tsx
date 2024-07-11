import React from "react";

import { cn } from "../../utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import { Separator } from "../separator";
import { useSidebarStore } from "./sidebar.store";
import { SidebarItem } from "./sidebar-item";

type Game = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isNew?: boolean;
};

type AccordionSection = {
  value: string;
  label: string;
  games: Game[];
};

interface SidebarAccordionsProps {
  defaultValues: string[];
  sections: AccordionSection[];
}

export const SidebarAccordions: React.FC<SidebarAccordionsProps> = ({
  defaultValues,
  sections,
}) => {
  const { isOpen } = useSidebarStore();

  return (
    <Accordion
      type="multiple"
      className="wr-w-full"
      defaultValue={defaultValues}
    >
      {sections.map((section) => (
        <React.Fragment key={section.value}>
          <AccordionItem className="wr-border-none" value={section.value}>
            <AccordionTrigger className="wr-px-3 wr-py-3">
              <span className="wr-flex wr-items-center wr-gap-2 wr-text-zinc-500">
                <span className={cn({ "xl:wr-hidden": !isOpen })}>
                  {section.label}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="wr-mb-3">
              {section.games.map((g) => (
                <SidebarItem
                  key={`/game${g.href}`}
                  href={`/game${g.href}`}
                  className={cn("wr-relative", {
                    "wr-text-white": false,
                  })}
                >
                  {g.icon}
                  <span className={cn({ "lg:wr-hidden": !isOpen })}>
                    {" "}
                    {g.label}{" "}
                  </span>
                  {g.isNew && (
                    <div
                      className={cn(
                        "wr-absolute wr-right-3 wr-top-[50%] wr-translate-y-[-50%] wr-rounded-sm wr-bg-red-600 wr-px-2 wr-py-[3px] wr-text-[11px] wr-uppercase wr-text-white md:wr-right-0",
                        { "lg:wr-hidden": !isOpen }
                      )}
                    >
                      New
                    </div>
                  )}
                </SidebarItem>
              ))}
            </AccordionContent>
          </AccordionItem>
          <Separator />
        </React.Fragment>
      ))}
    </Accordion>
  );
};
