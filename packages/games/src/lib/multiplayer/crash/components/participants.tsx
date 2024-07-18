"use client";

import { Coins } from "../../../svgs";
import useCrashGameStore from "../store";
import { Participant } from "../types";
import CrashParticipantDetail from "./participant-detail";

const CrashParticipant = () => {
  const { participants } = useCrashGameStore(["participants"]);

  const showParticipants = (participants: Participant[]) => {
    if (participants.length > 10) {
      return (
        <>
          {participants.slice(-10).map((participant, i) => (
            <CrashParticipantDetail key={i} {...participant} />
          ))}
          <div className="wr-mb-1.5 wr-flex wr-items-center wr-justify-center wr-rounded-[100px] wr-bg-[#FFFFFF1F] wr-p-1 wr-text-[13px] wr-font-semibold">
            +{participants.length - 10}more
          </div>
        </>
      );
    }

    return (
      <>
        {participants.map((participant, i) => (
          <CrashParticipantDetail key={i} {...participant} />
        ))}
      </>
    );
  };

  return (
    <>
      <div className="wr-absolute wr-right-0 wr-top-[990px] wr-z-10 wr-w-full wr-px-[14px] wr-font-dewi wr-font-light md:wr-right-8 md:wr-top-10 md:wr-max-w-[288px] md:wr-px-0">
        <div className="wr-mb-[23px] wr-flex wr-items-center wr-justify-between wr-rounded-md wr-bg-[#FFFFFF14] wr-p-1.5 wr-pr-[23px] wr-text-[13px]">
          <div className="wr-flex wr-items-center wr-gap-1.5 ">
            <Coins />
            Total bank
          </div>
          <div className="wr-flex wr-items-center wr-gap-1.5">
            <span className="wr-text-sm wr-text-green-500">$</span>
            {participants.reduce((acc, cur) => acc + cur.bet, 0)}
          </div>
        </div>
        <div className="wr-mb-3 wr-flex wr-justify-between wr-pr-[78px] wr-text-xs ">
          <div>USER</div>
          <div>BET</div>
        </div>
        {participants.length ? (
          showParticipants(participants)
        ) : (
          <>
            <div className="wr-flex wr-items-center wr-justify-center wr-rounded-[100px] wr-bg-[#FFFFFF1F] wr-p-1 wr-text-[13px] wr-font-semibold wr-leading-6">
              Waiting for the bets...
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CrashParticipant;
