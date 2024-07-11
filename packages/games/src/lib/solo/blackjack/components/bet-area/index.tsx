"use client";

import React from "react";

import { renderChipIcon } from "../../../../common/chip-controller/utils";
import { CDN_URL } from "../../../../constants";
import { cn } from "../../../../utils/style";
import styles from "./bet-area.module.css";

interface BetAreaProps {
  onClick: () => void;
  isDisabled: boolean;
  isDouble?: boolean;
  chipAmount: number;
  isInsured: boolean | undefined;
  isTurn: boolean;
  className?: string;
}

export const BetArea: React.FC<BetAreaProps> = ({
  chipAmount,
  isDouble,
  isInsured,
  isDisabled,
  isTurn,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "wr-absolute wr-z-[6] wr-h-[85px] wr-w-[85px] wr-cursor-pointer wr-rounded-full wr-border-2 wr-border-[#396C4C] wr-bg-[#0F311E] wr-transition-all hover:wr-border-yellow-400",
        isDisabled &&
          "wr-pointer-events-none wr-cursor-default wr-border-zinc-700",
        !isTurn && "wr-duration-300",
        isTurn && "wr-animate-blackjack-highlight wr-border-transparent",
        className && className
      )}
    >
      {chipAmount > 0 ? (
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[1] -wr-translate-x-1/2 -wr-translate-y-1/2">
          {renderChipIcon(chipAmount, 40, 40)}
          <span
            className={cn(
              "wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-font-bold",
              styles.chipAmount
            )}
          >
            {chipAmount ? chipAmount : ""}
          </span>
        </div>
      ) : (
        ""
      )}

      {isDouble ? (
        <div className="wr-absolute -wr-bottom-2 -wr-left-2">
          {renderChipIcon(chipAmount, 35, 35)}
          <span
            className={cn(
              "wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-text-[12px] wr-font-bold",
              styles.chipAmount
            )}
          >
            {chipAmount ? chipAmount : ""}
          </span>
        </div>
      ) : (
        ""
      )}

      {isInsured ? (
        <div className="wr-absolute -wr-bottom-2 -wr-right-2">
          {renderChipIcon(chipAmount / 2, 35, 35)}
          <span
            className={cn(
              "wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-text-[12px] wr-font-bold",
              styles.chipAmount
            )}
          >
            {chipAmount ? chipAmount / 2 : ""}
          </span>
        </div>
      ) : (
        ""
      )}

      <img
        width={32}
        height={36}
        alt="Justbet Blackjack"
        src={`${CDN_URL}/blackjack/logo.svg`}
        className={cn(
          "wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[0] wr-h-[36px] wr-w-[32px] -wr-translate-x-1/2 -wr-translate-y-1/2",
          isDisabled && "wr-opacity-50"
        )}
      />
    </div>
  );
};
