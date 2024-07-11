"use client";

import { MinesGameResult, MinesTemplate } from "@winrlabs/games";
import { MinesGame } from "@winrlabs/web3-games";
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
    </div>
  );
};

export default MinesPage;
