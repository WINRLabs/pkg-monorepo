import React from 'react';

import { LastBetsContainer } from '../../../common/last-bets-container';
import useMediaQuery from '../../../hooks/use-media-query';
import { FormLabel } from '../../../ui/form';
import { cn } from '../../../utils/style';
import useRollGameStore from '../store';
import { miniDotPosition } from './dice';

type DiceResultIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const LastBets = () => {
  const { lastBets } = useRollGameStore(['lastBets']);
  const isMobile = useMediaQuery('(max-width:1024px)');
  const maxItems = isMobile ? 5 : 9;
  const [displayBets, setDisplayBets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newBet = lastBets?.[lastBets.length - 1];

    if (newBet) {
      setDisplayBets((prev) => {
        const updatedBets = [
          ...prev.map((bet) => ({ ...bet, animation: '' })),
          { ...newBet, animation: 'fade-in' },
        ];
        if (updatedBets.length > maxItems) {
          updatedBets.shift();
        }

        return updatedBets;
      });
    }
  }, [lastBets, maxItems]);

  return (
    <LastBetsContainer className="h-12">
      {displayBets?.map((result, index) => {
        return (
          <div
            className={cn(
              'wr-relative wr-aspect-square wr-h-9 wr-w-9 wr-rounded-md wr-border-2 wr-border-zinc-800 wr-bg-black wr-transition-all wr-duration-500',
              {
                'wr-bg-green-500': result.payout > 0,
                'wr-animate-fade-in': result.animation === 'fade-in',
                'wr-animate-fade-out':
                  (isMobile ? displayBets.length == 5 : displayBets.length == 9) && index == 0,
              }
            )}
            key={`dot-${index}-${result.dice}`}
          >
            {miniDotPosition?.[(result.dice - 1) as DiceResultIndex]?.map((dot, i) => (
              <div
                key={i}
                className={cn(
                  'wr-absolute wr-h-2 wr-w-2 wr-shrink-0 wr-rounded-full wr-border-2 wr-border-[#EDEDF1] wr-bg-dice wr-transition-all',
                  dot
                )}
              />
            ))}
          </div>
        );
      })}
    </LastBetsContainer>
  );
};

export const RollController: React.FC<{
  multiplier: number;
  winChance: number;
}> = ({ multiplier, winChance }) => {
  return (
    <section className="wr-z-10 wr-grid wr-w-[255px] lg:wr-w-[280px] wr-grid-cols-2 wr-items-center wr-gap-2 wr-rounded-xl wr-bg-onyx-400 wr-p-[14px]">
      <div>
        <FormLabel className="wr-leading-4 lg:wr-leading-6">Multiplier</FormLabel>
        <div className="wr-rounded-md wr-bg-zinc-800 wr-p-3 wr-font-semibold">{multiplier}x</div>
      </div>
      <div>
        <FormLabel className="wr-leading-4 lg:wr-leading-6">Win Chance</FormLabel>
        <div className="wr-rounded-md wr-bg-zinc-800 wr-p-3 wr-font-semibold">{winChance}%</div>
      </div>
    </section>
  );
};
