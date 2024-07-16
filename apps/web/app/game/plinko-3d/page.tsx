"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, Plinko3DGame } from "@winrlabs/web3-games";
import React from "react";

const Plinko3d = () => {
  return (
    <>
      <Plinko3DGame
        buildedGameUrl={"https://jbassets.fra1.digitaloceanspaces.com"}
        options={{
          scene: {
            loader: "/plinko-3d/loader.png",
          },
          betController: {
            logo: "/plinko-3d/plinko.png",
          },
        }}
        minWager={0.1}
        maxWager={100}
      />

      <BetHistory gameType={GameType.PLINKO} />
    </>
  );
};

export default Plinko3d;
