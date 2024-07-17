import { GameControllerBetHistoryResponse } from "@winrlabs/api";
import dayjs from "dayjs";
import React from "react";

import { Eye } from "../../svgs";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { shorter } from "../../utils/string";
import { cn } from "../../utils/style";
import { toDecimals, toFormatted } from "../../utils/web3";
import { BetHistoryCurrencyList } from ".";

const BetTable = ({
  betHistory,
  currencyList,
}: {
  betHistory: GameControllerBetHistoryResponse;
  currencyList: BetHistoryCurrencyList;
}) => {
  return (
    <Table className="max-lg:wr-min-w-[700px] max-md:wr-overflow-scroll max-md:wr-scrollbar-none ">
      <TableHeader>
        <TableRow>
          <TableHead className="max-lg:wr-w-[150px]">Transaction</TableHead>
          <TableHead>Player</TableHead>
          {/* {!isGameHistory && (
            <TableHead className="text-center lg:text-left">Game</TableHead>
          )} */}
          <TableHead className="wr-text-center lg:wr-text-left">Bet</TableHead>
          <TableHead>Wager</TableHead>
          <TableHead>Payout</TableHead>
          <TableHead>Multiplier</TableHead>
          <TableHead>Profit</TableHead>
          <TableHead className="wr-text-center">Currency</TableHead>
          <TableHead className="wr-w-12 wr-text-right">Share</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {betHistory?.map((bet, i) => {
          return (
            <TableRow key={i}>
              <TableCell className="max-lg:wr-w-[150px]">
                {dayjs(bet.createdAt * 1000).format("DD-MM-YY, HH:mm")}
              </TableCell>
              <TableCell>
                {bet.username.length > 41
                  ? shorter(bet.username, 2)
                  : bet.username}
              </TableCell>
              <TableCell className="wr-text-center lg:wr-text-left">
                {bet.playedGameCount}
              </TableCell>
              <TableCell>$ {toFormatted(bet.wagerInDollar, 2)}</TableCell>
              <TableCell>$ {toFormatted(bet.payoutInDollar, 2)}</TableCell>
              <TableCell>
                <div
                  className={cn(
                    "wr-w-max wr-rounded-full wr-bg-zinc-700 wr-px-2 wr-py-[6px] wr-font-semibold wr-leading-4",
                    {
                      "wr-bg-green-500": bet.multiplier > 2,
                    }
                  )}
                >
                  x{toDecimals(bet.multiplier, 2)}
                </div>
              </TableCell>
              <TableCell
                className={cn({
                  "wr-text-green-500": bet.won === true,
                  "wr-text-red-600": bet.won === false,
                })}
              >
                {`${bet.won ? "+" : "-"}$${toFormatted(
                  bet.won ? bet.profitInDollar : bet.lossInDollar,
                  2
                )}`}
              </TableCell>
              <TableCell>
                <div className="wr-flex wr-items-center wr-justify-center">
                  <img
                    src={currencyList[bet.token]?.icon}
                    alt={currencyList[bet.token]?.symbol}
                    width={20}
                    height={20}
                  />
                </div>
              </TableCell>
              <TableCell className="wr-w-12 wr-text-right">
                <Button
                  variant={"outline"}
                  className="wr-h-[30px] wr-w-[30px]  disabled:wr-bg-zinc-700"
                  type="button"
                  disabled={bet.profitInDollar <= 0}
                >
                  <Eye className="wr-h-4 wr-w-4 wr-shrink-0 wr-text-zinc-500" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BetTable;
