"use client";

import { VideoPokerGame } from "@winrlabs/web3-games";

export default function VideoPokerPage() {
  return <VideoPokerGame minWager={0.1} maxWager={2000} />;
}
