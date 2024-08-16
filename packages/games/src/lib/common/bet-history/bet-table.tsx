import { GameControllerBetHistoryResponse } from '@winrlabs/api';
import dayjs from 'dayjs';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import { GameType } from '../../constants';
import useMediaQuery from '../../hooks/use-media-query';
import { LinkIcon } from '../../svgs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { shorter } from '../../utils/string';
import { cn } from '../../utils/style';
import { toDecimals, toFormatted } from '../../utils/web3';
import { BetHistoryCurrencyList } from '.';

const gameMap: Record<GameType, string> = {
  [GameType.BACCARAT]: 'Baccarat',
  [GameType.BLACKJACK]: 'Blackjack',
  [GameType.COINFLIP]: 'Coin Flip',
  [GameType.DICE]: 'Roll',
  [GameType.HOLDEM_POKER]: 'Holdem Poker',
  [GameType.HORSE_RACE]: 'Horse Race',
  [GameType.KENO]: 'Keno',
  [GameType.LIMBO]: 'Limbo',
  [GameType.LOTTERY]: 'Lottery',
  [GameType.MINES]: 'Mines',
  [GameType.MOON]: 'Crash',
  [GameType.ONE_HAND_BLACKJACK]: 'Blackjack',
  [GameType.PLINKO]: 'Plinko',
  [GameType.RANGE]: 'Dice',
  [GameType.ROULETTE]: 'Roulette',
  [GameType.RPS]: 'RPS',
  [GameType.SLOT]: 'Slot',
  [GameType.VIDEO_POKER]: 'Video Poker',
  [GameType.WHEEL]: 'Wheel',
  [GameType.WINR_BONANZA]: 'Winr Bonanza',
};

const BetTable = ({
  betHistory,
  currencyList,
}: {
  betHistory: GameControllerBetHistoryResponse;
  currencyList: BetHistoryCurrencyList;
}) => {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const [items, setItems] = React.useState<GameControllerBetHistoryResponse['data']>([]);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (betHistory.data && betHistory.data.length) updateItems(betHistory?.data || []);
  }, [betHistory.data]);

  const updateItems = (newItems: GameControllerBetHistoryResponse['data']) => {
    if (!newItems) return;

    const updatedItems = [...newItems.slice(0, 10)];
    setIsAnimating(true);
    setItems(updatedItems);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <>
      <AnimatePresence>
        <Table className="max-lg:wr-max-w-full max-md:wr-overflow-scroll max-md:wr-scrollbar-none wr-overflow-y-hidden wr-border-separate wr-border-spacing-x-0 wr-border-spacing-y-[6px]">
          <TableHeader className="wr-bg-zinc-900 wr-relative wr-z-10">
            <TableRow>
              <TableHead className="wr-pl-4 wr-rounded-[9px_0_0_9px] wr-w-[50px] lg:wr-w-[150px] wr-text-left">
                {isMobile ? 'TX' : 'Transaction'}
              </TableHead>
              <TableHead className="wr-text-center lg:wr-text-left wr-table-cell lg:wr-hidden">
                Game
              </TableHead>
              <TableHead className="wr-text-center lg:wr-text-left">Player</TableHead>
              <TableHead className="wr-hidden lg:wr-table-cell">Wager</TableHead>
              <TableHead className="wr-hidden lg:wr-table-cell">Multiplier</TableHead>
              <TableHead className="wr-text-right lg:wr-text-left wr-pr-4 lg:wr-pr-0 wr-rounded-[0_9px_9px_0] lg:wr-rounded-none">
                Payout
              </TableHead>
              {/* <TableHead className="wr-text-right lg:wr-text-left wr-pr-4 lg:wr-pr-0">
                Profit
              </TableHead> */}
              <TableHead className="wr-w-[80px] wr-hidden lg:wr-table-cell wr-pr-4 wr-text-right wr-rounded-[0_9px_9px_0]">
                Currency
              </TableHead>
              {/* <TableHead className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right">
                Share
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="wr-overflow-hidden">
            {items &&
              items.map((bet, i) => {
                return (
                  <TableRow
                    className={`wr-border-black wr-bg-zinc-900 wr-transition-transform wr-duration-500 wr-ease-out ${
                      isAnimating ? 'wr-animate-slide-down-first' : ''
                    }`}
                    key={i}
                  >
                    <TableCell className="wr-w-[50px] lg:wr-w-[150px] wr-pl-4 wr-rounded-[9px_0_0_9px]">
                      {/* TODO: ADD DYNAMIC ROUTE TO EXPLORER */}
                      <a target="_blank" href={`https://explorer.winr.games/tx/${bet.hash}`}>
                        <div className="wr-flex wr-gap-2 wr-items-center wr-justify-start">
                          <span className="wr-p-1 wr-border wr-border-zinc-800 wr-rounded-sm">
                            <LinkIcon className="wr-w-4 wr-h-4 wr-text-zinc-500" />
                          </span>
                          <span className="wr-hidden lg:wr-flex">
                            {dayjs(bet.createdAt * 1000).format('HH:mm')}
                          </span>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell className="wr-text-center lg:wr-text-left wr-table-cell lg:wr-hidden">
                      {gameMap[bet.game]}
                    </TableCell>
                    <TableCell className="wr-text-center lg:wr-text-left">
                      <a href={`/profile/${bet.username}`}>
                        {bet.username.length > 41 ? shorter(bet.username, 2) : bet.username}
                      </a>
                    </TableCell>
                    <TableCell className="wr-hidden lg:wr-table-cell">
                      ${toFormatted(bet.wagerInDollar, 2)}
                    </TableCell>
                    <TableCell className="wr-hidden lg:wr-table-cell">
                      <div
                        className={cn(
                          'wr-w-max wr-rounded-full wr-bg-zinc-700 wr-px-2 wr-py-[6px] wr-font-semibold wr-leading-4',
                          {
                            'wr-bg-green-500': bet.multiplier > 1,
                          }
                        )}
                      >
                        x{toDecimals(bet.multiplier, 2)}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'wr-text-right lg:wr-text-left wr-pr-4 lg:wr-pr-0 wr-rounded-[0_9px_9px_0] lg:wr-rounded-none',
                        {
                          'wr-text-green-500': bet.payoutInDollar > 0,
                        }
                      )}
                    >
                      ${toFormatted(bet.payoutInDollar, 2)}
                    </TableCell>
                    {/* <TableCell
                      className={cn('wr-text-right lg:wr-text-left', {
                        'wr-text-green-500': bet.won === true,
                        'wr-text-red-600': bet.won === false,
                      })}
                    >
                      {`${bet.won ? '+' : '-'}$${toFormatted(
                        bet.won ? bet.profitInDollar : bet.lossInDollar,
                        2
                      )}`}
                    </TableCell> */}
                    <TableCell className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right wr-pr-4 wr-rounded-[0_9px_9px_0]">
                      <div className="wr-flex wr-items-center wr-justify-end">
                        <img
                          src={currencyList[bet.token]?.icon}
                          alt={currencyList[bet.token]?.symbol}
                          width={20}
                          height={20}
                        />
                      </div>
                    </TableCell>
                    {/* <TableCell className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right">
                      <Button
                        variant={'outline'}
                        className="wr-h-[30px] wr-w-[30px]  disabled:wr-bg-zinc-700"
                        type="button"
                        disabled={bet.profitInDollar <= 0}
                      >
                        <Eye className="wr-h-4 wr-w-4 wr-shrink-0 wr-text-zinc-500" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </AnimatePresence>
    </>
  );
};

export default BetTable;
