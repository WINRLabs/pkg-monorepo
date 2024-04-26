"use client";

import {
  CoinFlipTemplate,
  CoinFlipGameResult,
  CoinSide,
} from "@winrlabs/games";
import { useState } from "react";

export default function CoinFlipPage() {
  const [results, setResults] = useState<CoinFlipGameResult[]>([]);

  return (
    <div>
      <CoinFlipTemplate
        options={{
          scene: {
            backgroundImage: "url(/coin-flip/coin-flip-bg.png)",
          },
        }}
        onSubmit={(data) => {
          console.log(data, "data");
          // send request
          // get results

          setResults([
            {
              payout: 0,
              payoutInUsd: 0,
              coinSide: CoinSide.HEADS,
            },
            {
              payout: 2,
              payoutInUsd: 2,
              coinSide: CoinSide.HEADS,
            },
            {
              payout: 3,
              payoutInUsd: 3,
              coinSide: CoinSide.TAILS,
            },
            {
              payout: 0,
              payoutInUsd: 0,
              coinSide: CoinSide.TAILS,
            },
            {
              payout: 3,
              payoutInUsd: 3,
              coinSide: CoinSide.HEADS,
            },
            {
              payout: 3,
              payoutInUsd: 3,
              coinSide: CoinSide.TAILS,
            },
          ]);
        }}
        onAnimationStep={(e) => {
          console.log("STEP", e);
        }}
        onAnimationCompleted={() => {
          setResults([]);
          console.log("game completed");
        }}
        gameResults={results}
      />
    </div>
  );
}