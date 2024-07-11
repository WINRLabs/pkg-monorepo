"use client";

import React from "react";
import { useSwipeable } from "react-swipeable";

import { useOutsideClick } from "../../hooks/use-outside-click";
import { AlignLeft, WinrCoin } from "../../svgs";
import { cn, toFormatted } from "../../utils";
import { Button } from "../button";
import { useSidebarStore } from "./sidebar.store";

export interface SidebarProps {
  sidebarItems?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
}

export const Sidebar = ({ sidebarItems, sidebarFooter }: SidebarProps) => {
  const { isOpen, setIsOpen } = useSidebarStore();

  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => setIsHydrated(true), []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    function handleResize() {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsOpen(false),
  });

  const handleClickOverlay = () => window.innerWidth < 1024 && setIsOpen(false);

  const ref = useOutsideClick(handleClickOverlay);

  if (!isHydrated) return null;

  return (
    <div
      {...handlers}
      className={cn(
        "wr-relative wr-z-50 wr-h-[calc(100dvh_-_64px)] wr-w-full wr-max-w-[240px] wr-transition-all wr-duration-300 max-lg:wr-fixed lg:wr-h-[100dvh]",
        {
          "lg:wr-min-w-16 wr-w-0 wr-min-w-0 wr-border-r max-md:wr-opacity-0 lg:wr-w-16":
            !isOpen,
          "wr-border-r wr-border-zinc-800 max-lg:wr-left-0": isOpen,
        }
      )}
    >
      <aside
        ref={ref}
        className={cn(
          "no-scrollbar wr-fixed wr-flex wr-h-[calc(100dvh_-_64px)] wr-w-60 wr-flex-col wr-items-center wr-justify-between wr-overflow-y-scroll wr-bg-zinc-950 wr-p-0 wr-transition-all wr-duration-300 lg:wr-h-[100dvh]  lg:wr-px-4 lg:wr-pb-4 lg:wr-pt-2",
          {
            "wr-w-0 wr-border-r wr-border-zinc-800 wr-p-0 max-md:wr-opacity-0 lg:wr-w-16 lg:wr-px-2":
              !isOpen,
            "wr-border-r wr-border-zinc-800": isOpen,
          }
        )}
      >
        <>
          <menu className="wr-w-full">
            <section
              className={cn(
                "wr-flex wr-items-center wr-justify-between wr-px-2 wr-py-4",
                {
                  "wr-border-b wr-border-zinc-800 wr-px-0": !isOpen,
                }
              )}
            >
              <div
                className={cn("wr-flex wr-items-center wr-gap-2", {
                  "wr-hidden": !isOpen,
                })}
              >
                <WinrCoin />
                <div>
                  <h6 className="wr-text-sm wr-font-semibold wr-text-zinc-100">
                    WINR
                  </h6>
                  <p className="wr-font-semibold wr-text-zinc-500">
                    ${toFormatted(0.14233 || 0, 4)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className={cn({ "wr-pl-3 wr-pr-2": isOpen })}
              >
                <AlignLeft
                  className={cn("wr-transition-all wr-duration-300", {
                    "wr-rotate-180": !isOpen,
                  })}
                />
              </Button>
            </section>

            {sidebarItems}
          </menu>
          {sidebarFooter}
        </>
      </aside>
    </div>
  );
};
