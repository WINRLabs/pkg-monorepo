"use client";

import { HorseRaceGame } from "@winrlabs/web3-games";
import React from "react";

const HorseRacePage = () => {
  return (
    <HorseRaceGame
      minWager={0.1}
      maxWager={2000}
      options={{
        scene: {
          loader: "/horse-race/loader.png",
          logo: "/horse-race/horse-race-logo.png",
        },
      }}
      buildedGameUrl={process.env.NEXT_PUBLIC_BASE_CDN_URL || ""}
    />
  );
};

export default HorseRacePage;
