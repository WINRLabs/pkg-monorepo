import { WagerCurrencyIcon } from '../../../../common/wager';
import { walletShorter } from '../../../../utils/string';
import { toFormatted } from '../../../../utils/web3';

interface ParticipantItemProps {
  multipler: number;
  bet: number;
  name: string;
}

export default function ParticipantItem(props: ParticipantItemProps) {
  return (
    <div className="wr-h-[30px] wr-rounded-full wr-w-full wr-bg-zinc-700 wr-grid wr-grid-cols-3 wr-font-semibold wr-px-3 wr-items-center">
      <span>{walletShorter(props.name)}</span>
      <span className="wr-text-center">{props.multipler}</span>
      <div className="wr-flex wr-justify-end wr-items-center wr-gap-1">
        <WagerCurrencyIcon />
        {props.bet && <span>${toFormatted(props.bet)}</span>}
      </div>
    </div>
  );
}
