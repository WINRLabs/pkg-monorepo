import { GameControllerGlobalBetHistoryResponse } from '@winrlabs/api';
import dayjs from 'dayjs';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import { CDN_URL, GameType, wagerLevels } from '../../constants';
import useMediaQuery from '../../hooks/use-media-query';
import {
  IconBaccarat,
  IconCoinFlip,
  IconCrash,
  IconDice,
  IconHorseRace,
  IconKeno,
  IconLimbo,
  IconMines,
  IconPlinko,
  IconRange,
  IconRoulette,
  IconRps,
  IconSlot,
  IconSweetBonanza,
  IconSweetBonanza1000,
  IconVideoPoker,
  IconWheel,
  IconWinrOfOlympus,
  IconWinrPrincess,
  LinkIcon,
} from '../../svgs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { shorter } from '../../utils/string';
import { cn } from '../../utils/style';
import { toDecimals, toFormatted } from '../../utils/web3';
import { BetHistoryCurrencyList } from '.';

const gameMap: Record<
  GameType,
  {
    title: string;
    icon: React.ReactNode;
    smTitle?: string;
  }
> = {
  [GameType.BACCARAT]: {
    title: 'Baccarat',
    icon: <IconBaccarat className="wr-h-4 wr-w-4" />,
  },
  [GameType.BLACKJACK]: {
    title: 'Blackjack',
    icon: <IconVideoPoker className="wr-h-4 wr-w-4" />,
  },
  [GameType.COINFLIP]: {
    title: 'Coin Flip',
    icon: <IconCoinFlip className="wr-h-4 wr-w-4" />,
  },
  [GameType.DICE]: {
    title: 'Roll',
    icon: <IconDice className="wr-h-4 wr-w-4" />,
  },
  [GameType.HOLDEM_POKER]: {
    title: 'Holdem Poker',
    icon: <IconVideoPoker className="wr-h-4 wr-w-4" />,
  },
  [GameType.HORSE_RACE]: {
    title: 'Horse Race',
    icon: <IconHorseRace className="wr-h-4 wr-w-4" />,
  },
  [GameType.KENO]: {
    title: 'Keno',
    icon: <IconKeno className="wr-h-4 wr-w-4" />,
  },
  [GameType.LIMBO]: {
    title: 'Limbo',
    icon: <IconLimbo className="wr-h-4 wr-w-4" />,
  },
  [GameType.LOTTERY]: {
    title: 'Lottery',
    icon: <IconVideoPoker className="wr-h-4 wr-w-4" />,
  },
  [GameType.MINES]: {
    title: 'Mines',
    icon: <IconMines className="wr-h-4 wr-w-4" />,
  },
  [GameType.MOON]: {
    title: 'Crash',
    icon: <IconCrash className="wr-h-4 wr-w-4" />,
  },
  [GameType.ONE_HAND_BLACKJACK]: {
    title: 'Blackjack',
    icon: <IconVideoPoker className="wr-h-4 wr-w-4" />,
  },
  [GameType.PLINKO]: {
    title: 'Plinko',
    icon: <IconPlinko className="wr-h-4 wr-w-4" />,
  },
  [GameType.RANGE]: {
    title: 'Dice',
    icon: <IconRange className="wr-h-4 wr-w-4" />,
  },
  [GameType.ROULETTE]: {
    title: 'Roulette',
    icon: <IconRoulette className="wr-h-4 wr-w-4" />,
  },
  [GameType.RPS]: {
    title: 'RPS',
    icon: <IconRps className="wr-h-4 wr-w-4" />,
  },
  [GameType.SLOT]: {
    title: 'Slot',
    icon: <IconSlot className="wr-h-4 wr-w-4" />,
  },
  [GameType.VIDEO_POKER]: {
    title: 'Video Poker',
    icon: <IconVideoPoker className="wr-h-4 wr-w-4" />,
  },
  [GameType.WHEEL]: {
    title: 'Wheel',
    icon: <IconWheel className="wr-h-4 wr-w-4" />,
  },
  [GameType.WINR_BONANZA]: {
    title: 'WINR Bonanza',
    smTitle: 'Bonanza',
    icon: <IconSweetBonanza className="wr-h-4 wr-w-4" />,
  },
  [GameType.WINR_OLYMPUS]: {
    title: 'WINR of Olympus',
    smTitle: 'Olympus',
    icon: <IconWinrOfOlympus className="wr-h-4 wr-w-4 wr-text-white" />,
  },
  [GameType.WINR_PRINCESS]: {
    title: 'WINR Princess',
    smTitle: 'Princess',
    icon: <IconWinrPrincess className="wr-h-4 wr-w-4 wr-text-white" />,
  },
  [GameType.SINGLE_WHEEL]: {
    title: 'Wheel',
    icon: <IconWheel className="wr-h-4 wr-w-4" />,
  },
  [GameType.WINR_BONANZA_1000]: {
    title: 'Bonanza 1000x',
    smTitle: 'Bonanza 1000',
    icon: <IconSweetBonanza1000 className="wr-h-4 wr-w-4" />,
  },
  [GameType.WINR_OLYMPUS_1000]: {
    title: 'Olympus 1000x',
    smTitle: 'Olympus 1000',
    icon: <IconSweetBonanza1000 className="wr-h-4 wr-w-4" />,
  },
};

const BetTable = ({
  betHistory,
  currencyList,
}: {
  betHistory: GameControllerGlobalBetHistoryResponse;
  currencyList: BetHistoryCurrencyList;
}) => {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const [items, setItems] = React.useState<GameControllerGlobalBetHistoryResponse>([]);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (betHistory && betHistory?.length) updateItems(betHistory || []);
  }, [betHistory]);

  const updateItems = (newItems: GameControllerGlobalBetHistoryResponse) => {
    if (!newItems) return;

    const updatedItems = [...newItems.slice(0, 11)];
    setIsAnimating(true);
    setItems(updatedItems);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  return (
    <>
      <AnimatePresence>
        <Table className="max-lg:wr-max-w-full max-md:wr-overflow-scroll max-md:wr-scrollbar-none wr-overflow-y-hidden wr-border-separate wr-border-spacing-x-0 wr-border-spacing-y-[6px] after:wr-pointer-events-none after:wr-absolute after:wr-bottom-0 after:wr-left-0 after:wr-z-0 after:wr-h-[30%] after:wr-w-full after:wr-bg-gradient-to-b after:wr-from-[rgba(26,29,41,0)_0%] after:wr-to-[#090909_75%] bet-table">
          <TableHeader className="wr-bg-onyx-700 wr-relative wr-z-10 table-header">
            <TableRow>
              <TableHead className="wr-pl-4 wr-rounded-[9px_0_0_9px] wr-w-[50px] lg:wr-w-[200px] wr-text-left table-head table-head-first">
                {isMobile ? 'TX' : 'Transaction'}
              </TableHead>
              <TableHead className="wr-text-center lg:wr-text-left wr-table-cell table-head">
                Game
              </TableHead>
              <TableHead className="wr-text-center lg:wr-text-left table-head">Player</TableHead>
              <TableHead className="wr-hidden lg:wr-table-cell table-head">Wager</TableHead>
              <TableHead className="wr-hidden lg:wr-table-cell table-head">Multiplier</TableHead>
              <TableHead className="wr-text-right lg:wr-text-left wr-pr-4 lg:wr-pr-0 wr-rounded-[0_9px_9px_0] lg:wr-rounded-none table-head">
                Payout
              </TableHead>
              {/* <TableHead className="wr-text-right lg:wr-text-left wr-pr-4 lg:wr-pr-0">
                Profit
              </TableHead> */}
              <TableHead className="wr-w-[80px] wr-hidden lg:wr-table-cell wr-pr-4 wr-text-right wr-rounded-[0_9px_9px_0] table-head table-head-last">
                Currency
              </TableHead>
              {/* <TableHead className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right">
                Share
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="wr-overflow-hidden table-body">
            {items &&
              items.map((bet, i) => {
                return (
                  <TableRow
                    className={`wr-border-black wr-bg-onyx-700 wr-transition-transform wr-duration-500 wr-ease-out table-row ${
                      isAnimating ? 'wr-animate-slide-down-first' : ''
                    }`}
                    key={i}
                  >
                    <TableCell className="wr-w-[50px] lg:wr-w-[150px] wr-pl-4 wr-rounded-[9px_0_0_9px] bet-history-table-cell bet-history-table-cell-first">
                      {/* TODO: ADD DYNAMIC ROUTE TO EXPLORER */}
                      <a target="_blank" href={`https://explorer.winr.games/tx/${bet.hash}`}>
                        <div className="wr-flex wr-gap-2 wr-items-center wr-justify-start">
                          <span className="wr-rounded-sm wr-bg-onyx-400 wr-p-1.5">
                            <LinkIcon className="wr-h-4 wr-w-5 wr-text-zinc-500" />
                          </span>
                          <span className="wr-hidden lg:wr-flex">
                            {dayjs(bet.time * 1000).format('HH:mm')}
                          </span>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell className="wr-text-center lg:wr-text-left wr-table-cell bet-history-table-cell">
                      <div className="wr-flex wr-items-center wr-gap-2 md:wr-justify-normal wr-justify-center">
                        {gameMap[bet.game]?.icon}
                        {isMobile && gameMap[bet.game].smTitle
                          ? gameMap[bet.game].smTitle
                          : gameMap[bet.game]?.title}
                      </div>
                    </TableCell>
                    <TableCell className="wr-text-center lg:wr-text-left bet-history-table-cell">
                      <a
                        href={`/profile/${bet.player}`}
                        style={{
                          // @ts-ignore - BE TYPE MISMATCH
                          color: wagerLevels[bet.level - 1]?.levelColor || '#fff',
                        }}
                        className="wr-flex wr-gap-1 wr-items-center wr-justify-center md:wr-justify-start"
                      >
                        {bet.level > 0 && (
                          <img
                            src={`${CDN_URL}/icons/level/${wagerLevels[bet.level - 1]?.levelIcon}.svg`}
                            alt="Justbet WINR Labs"
                            width={16}
                            height={16}
                          />
                        )}
                        {bet?.username?.length ? bet.username : shorter(bet.player, 2)}
                      </a>
                    </TableCell>
                    <TableCell className="wr-hidden lg:wr-table-cell bet-history-table-cell">
                      ${toFormatted(bet.wagerInDollar, 2)}
                    </TableCell>
                    <TableCell className="wr-hidden lg:wr-table-cell bet-history-table-cell">
                      <div
                        className={cn('wr-w-max wr-font-semibold wr-leading-4', {
                          'wr-text-green-500': bet.multiplier > 1,
                        })}
                      >
                        x{toDecimals(bet.multiplier, 2)}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'wr-text-right lg:wr-text-left wr-pr-4 lg:wr-pr-0 wr-rounded-[0_9px_9px_0] lg:wr-rounded-none bet-history-table-cell',
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
                    <TableCell className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right wr-pr-4 wr-rounded-[0_9px_9px_0] bet-history-table-cell bet-history-table-cell-last">
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
