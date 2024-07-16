"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, WheelGame } from "@winrlabs/web3-games";

export default function WheelPage() {
  return (
    <>
      <WheelGame minWager={2} maxWager={2000} options={{}} />
      <BetHistory gameType={GameType.WHEEL} />
    </>
  );
}
