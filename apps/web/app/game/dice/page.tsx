"use client";

import { DiceGame } from "@winrlabs/web3-games";

export default function DicePage() {
  return (
    <DiceGame
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
