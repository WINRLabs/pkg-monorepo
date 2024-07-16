"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, RpsGame } from "@winrlabs/web3-games";

const RpsPage = () => {
  return (
    <>
      <RpsGame
        options={{
          scene: {
            backgroundImage: "url(/coin-flip/coin-flip-bg.png)",
          },
        }}
        minWager={0.1}
        maxWager={2000}
      />
      <BetHistory gameType={GameType.RPS} />
    </>
  );
};

export default RpsPage;
