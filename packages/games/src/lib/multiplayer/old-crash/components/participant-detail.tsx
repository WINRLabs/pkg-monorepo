import React from 'react';

import { walletShorter } from '../../../utils/string';
import { Participant } from '../types';
const CrashParticipantDetail: React.FC<Participant> = ({ avatar, bet, name }) => {
  return (
    <div className="wr-mb-1.5 wr-flex wr-items-center wr-justify-between wr-rounded-[100px] wr-bg-[#FFFFFF1F] wr-p-1 wr-pr-[55px] wr-text-[13px] wr-font-semibold wr-px-4">
      <div className="wr-flex wr-items-center wr-gap-2 ">{walletShorter(name)}</div>
      <div className="wr-flex wr-items-center wr-gap-1.5">
        <span className="wr-text-green-500">$</span>
        {bet}
      </div>
    </div>
  );
};

export default CrashParticipantDetail;
