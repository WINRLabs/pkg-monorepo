import { cn } from '../../../../lib/utils/style';
import { LastBetsContainer } from '../../../common/last-bets-container';
import useMediaQuery from '../../../hooks/use-media-query';
import { useDiceGameStore } from '..';

export const RangeLastBets: React.FC = () => {
  const { lastBets } = useDiceGameStore(['lastBets']);
  const isMobile = useMediaQuery('(max-width:1024px)');
  const lastFiveBets = lastBets?.slice(isMobile ? -4 : -8);

  return (
    <LastBetsContainer>
      {lastFiveBets?.map((result, index) => {
        return (
          <div
            key={index}
            className={cn(
              'wr-flex wr-h-7 wr-w-[53px] wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700 wr-font-semibold wr-text-zinc-100',
              {
                'wr-bg-green-500': result.payout > 0,
              }
            )}
          >
            <div className="wr-text-zinc-100">{result.resultNumber}</div>
          </div>
        );
      })}
    </LastBetsContainer>
  );
};
