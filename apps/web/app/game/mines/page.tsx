"use client";

import { GameType, MinesGameResult, MinesTemplate } from "@winrlabs/games";
import { BetHistory, MinesGame } from "@winrlabs/web3-games";
import React, { useState } from "react";

const MinesPage = () => {
  const [results, setResults] = useState<MinesGameResult[]>([]);
  return (
    <div>
      <MinesGame
        maxWager={100}
        minWager={1}
        onAnimationCompleted={() => {
          setResults([]);
          console.log("game completed");
        }}
      />

      <BetHistory gameType={GameType.MINES} />
    </div>
  );
};

export default MinesPage;
