'use client';

import * as Tabs from '@radix-ui/react-tabs';
import React, { useEffect, useState } from 'react';

import { Document, IconCoin, IconStar, IconStars, Person } from '../../svgs';
import { AnimatedTabContent } from '../animated-tab-content';
import BetTable from './bet-table';
import Loading from './loading';

export type BetHistoryCurrencyList = Record<
  string,
  {
    icon: string;
    symbol: string;
  }
>;

export type BetHistoryType = 'bets' | 'player' | 'high' | 'lucky';

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
    <div className="mt-6 bet-history">
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
        <div className="wr-flex wr-justify-between wr-items-center wr-w-full bet-history-tabs">
          <div className="wr-flex wr-items-center wr-gap-1.5 wr-text-md wr-font-bold">
            <IconCoin className="wr-h-5 wr-w-5 wr-text-white" />
            Bets
          </div>
          <Tabs.List className="wr-flex wr-items-center wr-border-none wr-font-semibold wr-mt-1 bet-history-tabs-list">
            <Tabs.Trigger
              className="wr-flex wr-items-center wr-gap-1 wr-pl-0 wr-px-2.5 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-text-white bet-history-tab-trigger"
              value="bets"
            >
              <Document className="wr-h-5 wr-w-5" /> All{' '}
              <span className="wr-hidden md:wr-block">Bets</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              className="wr-flex wr-items-center wr-gap-1 wr-px-2.5 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-text-white bet-history-tab-trigger"
              value="player"
            >
              <Person className="wr-size-5" /> My{' '}
              <span className="wr-hidden md:wr-block">Bets</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              className="wr-flex wr-items-center wr-gap-1 wr-px-2.5 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-text-white bet-history-tab-trigger"
              value="high"
            >
              <IconStar className="wr-size-5" /> High{' '}
              <span className="wr-hidden md:wr-block">Rollers</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              className="wr-flex wr-items-center wr-gap-1 wr-px-2.5 wr-py-3 wr-text-zinc-500 data-[state=active]:wr-text-white bet-history-tab-trigger"
              value="lucky"
            >
              <IconStars className="wr-size-5" /> Lucky{' '}
              <span className="wr-hidden md:wr-block">Winners</span>
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <AnimatedTabContent value="bets">
              <BetTable betHistory={betHistory} currencyList={currencyList} />
            </AnimatedTabContent>
            <AnimatedTabContent value="player">
              <BetTable betHistory={betHistory} currencyList={currencyList} />
            </AnimatedTabContent>
            <AnimatedTabContent value="high">
              <BetTable betHistory={betHistory} currencyList={currencyList} />
            </AnimatedTabContent>
            <AnimatedTabContent value="lucky">
              <BetTable betHistory={betHistory} currencyList={currencyList} />
            </AnimatedTabContent>
          </>
        )}
      </Tabs.Root>
    </div>
  );
};
