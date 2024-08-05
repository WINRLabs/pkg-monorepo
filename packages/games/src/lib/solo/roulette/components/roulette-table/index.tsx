import React from "react";
import { useFormContext } from "react-hook-form";

import { Chip } from "../../../../common/chip-controller/types";
import { renderChipIcon } from "../../../../common/chip-controller/utils";
import { cn } from "../../../../utils/style";
import {
  actions,
  miniActions,
  redNumbers,
  rouletteNumbers,
} from "../../constants";
import { RouletteForm } from "../../types";

export interface RouletteTableProps {
  selectedChip: Chip;
  winningNumber: number | null;
  isPrepared: boolean;
  addWager: (n: number, wager: Chip) => void;
}

export const RouletteTable: React.FC<RouletteTableProps> = ({
  selectedChip,
  winningNumber,
  isPrepared,
  addWager,
}) => {
  const [hoveredNumbers, setHoveredNumbers] = React.useState<number[]>([]);

  const form = useFormContext() as RouletteForm;

  const selectedNumbers = form.watch("selectedNumbers");

  return (
    <div
      className={cn(
        "wr-h-[250px] max-md:wr-absolute md:wr-relative md:wr-w-full wr-max-w-[742px] wr-transition-all wr-duration-500 max-md:wr-h-[225px] max-md:wr-w-[575px] max-md:wr-rotate-90 max-lg:-wr-translate-y-[45%]",
        {
          "md:wr-top-0 wr-z-10 wr-blur-0 max-lg:wr-absolute max-lg:wr-top-1/2":
            !isPrepared,
          "wr-top-1/2 lg:wr-top-[250px] wr-blur-[4px] md:wr-top-[150px] md:wr-z-0":
            isPrepared,
        }
      )}
    >
      <div className="wr-relative wr-m-auto wr-grid wr-h-full wr-w-full wr-select-none wr-grid-cols-[repeat(14,1fr)] wr-grid-rows-5 wr-items-center wr-justify-center wr-justify-items-center wr-gap-[6px] wr-transition-all">
        <TableItem
          label={0}
          isHovered={hoveredNumbers.includes(0)}
          isLosingNumber={winningNumber !== null && winningNumber !== 0}
          isWinningNumber={winningNumber !== null && winningNumber === 0}
          onClick={() => addWager(0, selectedChip)}
          totalWager={selectedNumbers[0] as number}
          className="wr-col-[1] wr-row-start-1 wr-row-end-4 wr-bg-green-500 hover:wr-border-zinc-50"
        />

        {rouletteNumbers.map((n, idx) => {
          if (idx < 12) {
            const gridValue = idx + 2;

            return (
              <TableItem
                key={n}
                label={n}
                onClick={() => addWager(n, selectedChip)}
                isHovered={hoveredNumbers.includes(n)}
                isWinningNumber={winningNumber !== null && winningNumber === n}
                isLosingNumber={winningNumber !== null && winningNumber !== n}
                className={cn("hover:wr-border-zinc-50", {
                  "wr-bg-red-600": redNumbers.includes(n),
                })}
                gridArea={`1 / ${gridValue} / auto / auto`}
                totalWager={selectedNumbers[n] as number}
              />
            );
          }

          if (idx > 10 && idx < 24) {
            const gridValue = idx - 10;

            return (
              <TableItem
                key={n}
                label={n}
                onClick={() => addWager(n, selectedChip)}
                isHovered={hoveredNumbers.includes(n)}
                isWinningNumber={winningNumber !== null && winningNumber === n}
                isLosingNumber={winningNumber !== null && winningNumber !== n}
                className={cn("hover:wr-border-zinc-50", {
                  "wr-bg-red-600": redNumbers.includes(n),
                })}
                gridArea={`2 / ${gridValue} / auto / auto`}
                totalWager={selectedNumbers[n] as number}
              />
            );
          }

          if (idx > 23) {
            const gridValue = idx - 22;

            return (
              <TableItem
                key={n}
                label={n}
                onClick={() => addWager(n, selectedChip)}
                isHovered={hoveredNumbers.includes(n)}
                isWinningNumber={winningNumber !== null && winningNumber === n}
                isLosingNumber={winningNumber !== null && winningNumber !== n}
                className={cn("hover:wr-border-zinc-50", {
                  "wr-bg-red-600": redNumbers.includes(n),
                })}
                gridArea={`3 / ${gridValue} / auto / auto`}
                totalWager={selectedNumbers[n] as number}
              />
            );
          }
        })}

        {actions.map((a, idx) => (
          <TableItem
            key={idx}
            label={a.label}
            onClick={() => addWager(a.index, selectedChip)}
            className={cn(
              "wr-z-[1] wr-border wr-border-[#396C4C] wr-bg-[#0F311E] wr-transition-all wr-duration-300 hover:wr-border-zinc-50",
              a.styles
            )}
            gridArea={a.gridArea}
            totalWager={selectedNumbers[a.index] as number}
            onMouseEnter={() => setHoveredNumbers(a.numbers)}
            onMouseLeave={() => setHoveredNumbers([])}
          />
        ))}

        {miniActions.map((a, idx) => (
          <TableItem
            key={idx}
            label=""
            onClick={() => addWager(a.index, selectedChip)}
            className={cn(
              "wr-relative wr-z-[2] wr-flex wr-h-[16%] wr-w-[16%] wr-cursor-pointer wr-border-transparent wr-bg-transparent wr-transition-all wr-duration-300",
              a.styles
            )}
            gridArea={a.gridArea}
            totalWager={selectedNumbers[a.index] as number}
            onMouseEnter={() => setHoveredNumbers(a.numbers)}
            onMouseLeave={() => setHoveredNumbers([])}
          />
        ))}
      </div>
    </div>
  );
};

interface TableItemProps {
  label: string | number;
  isHovered?: boolean;
  isLosingNumber?: boolean;
  isWinningNumber?: boolean;
  gridArea?: string;
  totalWager: number;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const TableItem: React.FC<TableItemProps> = ({
  label,
  isHovered,
  isLosingNumber,
  isWinningNumber,
  gridArea,
  totalWager,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "wr-relative wr-z-[2] wr-flex wr-h-full wr-w-full wr-cursor-pointer wr-select-none wr-items-center wr-justify-center wr-rounded-sm wr-border wr-border-transparent wr-bg-zinc-800 wr-p-0 wr-font-bold wr-transition-all wr-duration-300",
        className && className,
        {
          "wr-border-yellow-500": isWinningNumber,
          "wr-blur-[1px]": isLosingNumber,
          "wr-border-zinc-50": isHovered,
        }
      )}
      style={{
        gridArea: gridArea && gridArea,
      }}
    >
      {label}
      <AddedChips totalWager={totalWager} />
    </div>
  );
};

const AddedChips: React.FC<{ totalWager: number }> = ({ totalWager }) => {
  return (
    <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-flex -wr-translate-x-1/2 -wr-translate-y-1/2 wr-items-center wr-justify-center wr-text-white">
      {renderChipIcon(totalWager)}
      <span className="wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 wr-translate-y-[-55%] wr-text-xs">
        {totalWager ? totalWager : ""}
      </span>
    </div>
  );
};
