"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, RouletteGame } from "@winrlabs/web3-games";

export default function RoulettePage() {
  return (
    <>
      <RouletteGame minWager={0.1} maxWager={2000} options={{}} />
      <BetHistory gameType={GameType.ROULETTE} />
    </>
  );
}
