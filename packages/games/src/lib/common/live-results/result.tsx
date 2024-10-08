import React from 'react';
import { useGameOptions } from '../../game-provider';
import { CardContent } from '../../ui/card';
import { cn } from '../../utils/style';
import { useLiveResultStore } from './store';

const Result = () => {
  const { currency } = useGameOptions();
  const { currentProfit, lossCount, wonCount, totalWager, isMultiplayer } = useLiveResultStore([
    'currentProfit',
    'wonCount',
    'lossCount',
    'totalWager',
    'isMultiplayer',
  ]);

  return (
    <>
      <CardContent>
        <div className="wr-rounded-md wr-bg-onyx-400 wr-p-[14px] wr-font-semibold">
          <div
            className={cn('wr-grid wr-grid-cols-2', {
              'wr-grid-cols-1': isMultiplayer,
            })}
          >
            <div
              className={cn('wr-flex wr-flex-col wr-gap-2', {
                'wr-border-zinc-800 wr-border-r': !isMultiplayer,
                'wr-grid wr-grid-cols-2': isMultiplayer,
              })}
            >
              <div
                className={cn('wr-flex wr-flex-col wr-items-start wr-gap-0.5', {
                  'wr-border-zinc-800 wr-border-r': isMultiplayer,
                })}
              >
                <span className="wr-text-zinc-500">Profit</span>
                <div className="wr-flex wr-items-center wr-gap-1 wr-font-semibold">
                  {currentProfit > 0 ? (
                    <span className="wr-text-green-500">+${currentProfit}</span>
                  ) : currentProfit === 0 ? (
                    <span className="wr-text-zinc-100">$0</span>
                  ) : (
                    <span className="wr-text-red-500">-${currentProfit * -1}</span>
                  )}
                  <img alt="token_image" src={currency.icon} width={16} height={16} />
                </div>
              </div>

              <div
                className={cn('wr-flex wr-flex-col wr-items-start wr-gap-0.5', {
                  'wr-pl-3': isMultiplayer,
                })}
              >
                <span className="wr-text-zinc-500">Wager</span>${totalWager}
              </div>
            </div>
            {!isMultiplayer && (
              <div className="wr-flex wr-flex-col wr-gap-2 wr-pl-4">
                <div className="wr-flex wr-flex-col wr-items-start wr-gap-0.5">
                  <span className={'wr-text-zinc-500'}>Wins</span>
                  <span
                    className={cn({
                      'wr-text-green-600': wonCount > 0,
                    })}
                  >
                    {wonCount}
                  </span>
                </div>
                <div className="wr-flex wr-flex-col wr-items-start wr-gap-0.5">
                  <span className="wr-text-zinc-500">Losses</span>
                  <span
                    className={cn({
                      'wr-text-red-500': lossCount > 0,
                    })}
                  >
                    {lossCount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default Result;
