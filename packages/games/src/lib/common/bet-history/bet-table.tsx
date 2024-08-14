import { GameControllerBetHistoryResponse } from '@winrlabs/api';
import dayjs from 'dayjs';

import { GameType } from '../../constants';
import useMediaQuery from '../../hooks/use-media-query';
import { Eye, LinkIcon } from '../../svgs';
import { Button } from '../../ui/button';
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
  return (
    <Table className="max-lg:wr-max-w-full max-md:wr-overflow-scroll max-md:wr-scrollbar-none">
      <TableHeader>
        <TableRow>
          <TableHead className="wr-w-[50px] lg:wr-w-[150px] wr-text-left">
            {isMobile ? 'TX' : 'Transaction'}
          </TableHead>
          <TableHead className="wr-text-center lg:wr-text-left wr-table-cell lg:wr-hidden">
            Game
          </TableHead>
          <TableHead className="wr-text-center lg:wr-text-left">Player</TableHead>
          <TableHead className="wr-hidden lg:wr-table-cell lg:wr-text-left">Bet</TableHead>
          <TableHead className="wr-hidden lg:wr-table-cell">Wager</TableHead>
          <TableHead className="wr-hidden lg:wr-table-cell wr-text-left">Payout</TableHead>
          <TableHead className="wr-hidden lg:wr-table-cell">Multiplier</TableHead>
          <TableHead className="wr-text-right lg:wr-text-left">Profit</TableHead>
          <TableHead className="wr-hidden lg:wr-table-cell">Currency</TableHead>
          <TableHead className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right">Share</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {betHistory.data?.map((bet, i) => {
          return (
            <TableRow key={i}>
              <TableCell className="wr-w-[50px] lg:wr-w-[150px]">
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
              <TableCell className="wr-hidden lg:wr-table-cell wr-text-center lg:wr-text-left">
                {bet.playedGameCount}
              </TableCell>
              <TableCell className="wr-hidden lg:wr-table-cell">
                ${toFormatted(bet.wagerInDollar, 2)}
              </TableCell>
              <TableCell className="wr-hidden lg:wr-table-cell wr-text-center lg:wr-text-left">
                ${toFormatted(bet.payoutInDollar, 2)}
              </TableCell>
              <TableCell className="wr-hidden lg:wr-table-cell">
                <div
                  className={cn(
                    'wr-w-max wr-rounded-full wr-bg-zinc-700 wr-px-2 wr-py-[6px] wr-font-semibold wr-leading-4',
                    {
                      'wr-bg-green-500': bet.multiplier >= 2,
                    }
                  )}
                >
                  x{toDecimals(bet.multiplier, 2)}
                </div>
              </TableCell>
              <TableCell
                className={cn('wr-text-right lg:wr-text-left', {
                  'wr-text-green-500': bet.won === true,
                  'wr-text-red-600': bet.won === false,
                })}
              >
                {`${bet.won ? '+' : '-'}$${toFormatted(
                  bet.won ? bet.profitInDollar : bet.lossInDollar,
                  2
                )}`}
              </TableCell>
              <TableCell className="wr-hidden lg:wr-table-cell">
                <div className="wr-flex wr-items-center wr-justify-start">
                  <img
                    src={currencyList[bet.token]?.icon}
                    alt={currencyList[bet.token]?.symbol}
                    width={20}
                    height={20}
                  />
                </div>
              </TableCell>
              <TableCell className="wr-hidden lg:wr-table-cell wr-w-12 wr-text-right">
                <Button
                  variant={'outline'}
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
