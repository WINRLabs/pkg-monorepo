"use client";

import { PlinkoGame } from "@winrlabs/web3-games";

export default function PlinkoPage() {
  return (
    <PlinkoGame
      options={{
        scene: {
          backgroundImage: "url(/coin-flip/coin-flip-bg.png)",
        },
      }}
      minWager={0.1}
      maxWager={2000}
    />
  );
}
