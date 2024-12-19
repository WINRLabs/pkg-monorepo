import { IconUser } from '../../../../svgs';
import { useCrashGameStore } from '../../crash.store';
import ParticipantItem from './pariticpant-item';

export default function Participants() {
  const participants = useCrashGameStore((state) => state.participants);

  return (
    <div className="wr-h-[300px] wr-overflow-hidden">
      <div className="wr-flex wr-justify-between wr-items-center wr-py-3 wr-px-3">
        <div className="wr-flex wr-items-center">
          <span className="wr-font-semibold wr-flex wr-gap-1">
            <IconUser className="wr-size-5 wr-text-zinc-500" /> {participants.length}
          </span>
        </div>
        <div className="wr-flex wr-items-center">
          <span className="wr-font-semibold">
            $ {participants.reduce((acc, cur) => acc + cur.bet, 0)}
          </span>
        </div>
      </div>
      <div className="wr-overflow-y-scroll wr-scrollbar-none wr-h-full wr-space-y-1">
        {participants.map((p) => (
          <ParticipantItem key={p.name} multipler={p.multiplier} bet={p.bet} name={p.name} />
        ))}
        {new Array(20).fill(0).map((_, i) => (
          <div
            className="wr-h-[30px] wr-rounded-full wr-w-full wr-bg-zinc-900 wr-grid wr-grid-cols-3 wr-font-semibold wr-px-3 wr-items-center"
            key={i}
          ></div>
        ))}
      </div>
    </div>
  );
}
