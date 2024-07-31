"use client";

import { Plinko3DGame, Web3GamesModals } from "@winrlabs/web3-games";
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
      <Web3GamesModals />
    </>
  );
};

export default Plinko3d;
