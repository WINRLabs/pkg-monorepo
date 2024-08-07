import * as Tabs from "@radix-ui/react-tabs";
import { GameControllerBetHistoryResponse } from "@winrlabs/api";
import React, { useEffect, useState } from "react";

import { Document, Person } from "../../svgs";
import { AnimatedTabContent } from "../animated-tab-content";
import BetTable from "./bet-table";

export type BetHistoryCurrencyList = Record<
  string,
  {
    icon: string;
    symbol: string;
  }
>;

export type BetHistoryType = "bets" | "player";

export type BetHistoryFilter = {
  type?: BetHistoryType;
};

type BetHistoryTemplateProps = {
  betHistory: GameControllerBetHistoryResponse;
  loading?: boolean;
  onChangeFilter?: (filter: BetHistoryFilter) => void;
  currencyList: BetHistoryCurrencyList;
};

export const BetHistoryTemplate = ({
  betHistory,
  onChangeFilter,
  loading,
  currencyList,
}: BetHistoryTemplateProps) => {
  const [filter, setFilter] = useState<BetHistoryFilter>({
    type: "bets",
  });

  useEffect(() => {
    if (onChangeFilter) {
      onChangeFilter(filter);
    }
  }, [filter]);

  return (
    <div className="mt-6">
      <Tabs.Root
        defaultValue="bets"
        value={filter.type}
        onValueChange={(value) => {
          if (!value) return;
          setFilter({
            type: value as BetHistoryType,
          });
        }}
      >
        <Tabs.List className="wr-flex wr-w-full wr-items-center wr-border-b wr-border-zinc-800 wr-font-semibold wr-mt-1">
          <Tabs.Trigger
            className="wr-flex wr-items-center wr-gap-2 wr-px-3 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-border-b-2 data-[state=active]:wr-border-red-600 data-[state=active]:wr-text-white"
            value="bets"
          >
            <Document className="wr-h-5 wr-w-5" /> All Bets
          </Tabs.Trigger>
          <Tabs.Trigger
            className="wr-flex wr-items-center wr-gap-2 wr-px-3 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-border-b-2 data-[state=active]:wr-border-red-600 data-[state=active]:wr-text-white"
            value="player"
          >
            <Person className="wr-size-5" /> My Bets
          </Tabs.Trigger>
        </Tabs.List>

        {loading ? (
          <p className="wr-font-semibold wr-my-3">Loading...</p>
        ) : (
          <>
            <AnimatedTabContent value="bets">
              <BetTable betHistory={betHistory} currencyList={currencyList} />
            </AnimatedTabContent>
            <AnimatedTabContent value="player">
              <BetTable betHistory={betHistory} currencyList={currencyList} />
            </AnimatedTabContent>
          </>
        )}
      </Tabs.Root>
    </div>
  );
};
