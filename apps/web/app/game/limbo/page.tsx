"use client";

import React from "react";
import { BetHistory, LimboGame } from "@winrlabs/web3-games";
import { GameType } from "@winrlabs/games";

const LimboPage = () => {
  return (
    <>
      <LimboGame
        options={{
          scene: {
            backgroundImage: "url(/coin-flip/coin-flip-bg.png)",
          },
        }}
        minWager={0.1}
        maxWager={2000}
      />
      <BetHistory gameType={GameType.LIMBO} />
    </>
  );
};

export default LimboPage;
