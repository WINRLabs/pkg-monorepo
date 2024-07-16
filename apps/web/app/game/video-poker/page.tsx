"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, VideoPokerGame } from "@winrlabs/web3-games";

export default function VideoPokerPage() {
  return (
    <>
      <VideoPokerGame minWager={0.1} maxWager={2000} />;
      <BetHistory gameType={GameType.ROULETTE} />
    </>
  );
}
