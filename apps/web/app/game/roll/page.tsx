"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, RollGame } from "@winrlabs/web3-games";
import React from "react";

const RollPage = () => {
  return (
    <>
      <RollGame
        options={{
          scene: {
            backgroundImage: "url(/coin-flip/coin-flip-bg.png)",
          },
        }}
        minWager={0.1}
        maxWager={2000}
      />
      {/* <BetHistory gameType={GameType.DICE} /> */}
    </>
  );
};

export default RollPage;
