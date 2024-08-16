import { CDN_URL } from '../../../constants';
import { cn } from '../../../utils/style';
import { CoinFlipGameResult, CoinSide, useCoinFlipGameStore } from '..';
import useMediaQuery from '../../../hooks/use-media-query';

const LastBet = ({ result }: { result: CoinFlipGameResult }) => {
  return (
    <div
      className={cn(
        'wr-flex wr-h-7 wr-w-[75px] wr-flex-shrink-0 wr-items-center wr-justify-center wr-rounded-[1000px] wr-bg-zinc-700 wr-font-semibold wr-text-zinc-100',
        {
          'wr-bg-green-500': result.payout > 0,
        }
      )}
    >
      {Number(result.coinSide) === CoinSide.HEADS ? (
        <img src={`${CDN_URL}/coin-flip-2d/doge.png`} width={20} height={20} alt="doge_icon" />
      ) : (
        <img src={`${CDN_URL}/coin-flip-2d/pepe.png`} width={20} height={20} alt="pepe_icon" />
      )}
      <div className="wr-ml-1 wr-text-zinc-100">
        {Number(result.coinSide) === CoinSide.HEADS ? 'DOGE' : 'PEPE'}
      </div>
    </div>
  );
};

export const CoinFlipLastBets: React.FC = () => {
  const { lastBets } = useCoinFlipGameStore(['lastBets']);
  const isMobile = useMediaQuery('(max-width:1024px)');
  const lastFiveBets = lastBets?.slice(isMobile ? -4 : -8);

  return (
    <section className="wr-absolute wr-left-1/2 wr-top-3 lg:wr-top-5 wr-flex wr-max-w-full -wr-translate-x-1/2 wr-items-center wr-justify-end wr-gap-[6px] wr-overflow-hidden max-md:wr-scale-75">
      {lastFiveBets?.map((result, index) => {
        return <LastBet result={result} key={index} />;
      })}
    </section>
  );
};
