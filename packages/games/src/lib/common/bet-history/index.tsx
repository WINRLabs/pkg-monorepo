import * as Tabs from '@radix-ui/react-tabs';
import React, { useEffect, useState } from 'react';

import { Document, IconCoin, Person } from '../../svgs';
import { AnimatedTabContent } from '../animated-tab-content';
import BetTable from './bet-table';

export type BetHistoryCurrencyList = Record<
  string,
  {
    icon: string;
    symbol: string;
  }
>;

export type BetHistoryType = 'bets' | 'player';

export type BetHistoryFilter = {
  type?: BetHistoryType;
};

type BetHistoryTemplateProps = {
  betHistory: any;
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
    type: 'bets',
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
        <div className="wr-flex wr-justify-between wr-items-center wr-w-full">
          <div className="wr-flex wr-items-center wr-gap-1.5 wr-text-md wr-font-bold">
            <IconCoin className="wr-h-5 wr-w-5 wr-text-white" />
            Bets
          </div>
          <Tabs.List className="wr-flex wr-items-center wr-border-none wr-font-semibold wr-mt-1">
            <Tabs.Trigger
              className="wr-flex wr-items-center wr-gap-1.5 wr-pl-0 wr-px-2.5 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-text-white"
              value="bets"
            >
              <Document className="wr-h-5 wr-w-5" /> All Bets
            </Tabs.Trigger>
            <Tabs.Trigger
              className="wr-flex wr-items-center wr-gap-1.5 wr-px-2.5 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-text-white"
              value="player"
            >
              <Person className="wr-size-5" /> My Bets
            </Tabs.Trigger>
          </Tabs.List>
        </div>

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
