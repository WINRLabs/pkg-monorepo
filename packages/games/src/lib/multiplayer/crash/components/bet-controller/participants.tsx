import { IconUser } from '../../../../svgs';
import ParticipantItem from './pariticpant-item';

export default function Participants() {
  return (
    <div className="wr-h-[300px] wr-overflow-hidden">
      <div className="wr-flex wr-justify-between wr-items-center wr-py-3">
        <div className="wr-flex wr-items-center">
          <IconUser />
          <span className="wr-font-semibold">4</span>
        </div>
        <div className="wr-flex wr-items-center">
          <span className="wr-font-semibold">545</span>
        </div>
      </div>
      <div className="wr-overflow-y-scroll wr-scrollbar-none wr-h-full wr-space-y-1">
        {new Array(100).fill(0).map((_, i) => (
          <ParticipantItem key={i} />
        ))}
      </div>
    </div>
  );
}
