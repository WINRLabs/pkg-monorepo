"use client";

import { VideoPokerTemplateWithWeb3 } from "@winrlabs/web3-games";

export default function VideoPokerPage() {
  return <VideoPokerTemplateWithWeb3 minWager={0.1} maxWager={2000} />;
}
