"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory } from "@winrlabs/web3-games";
import dynamic from "next/dynamic";

const HorseRaceGame = dynamic(
  () => import("@winrlabs/web3-games").then((mod) => mod.HorseRaceGame),
  {
    ssr: false,
  }
);

const HorseRacePage = () => {
  return (
    <>
      <HorseRaceGame
        minWager={0.1}
        maxWager={2000}
        options={{
          scene: {
            loader: "/horse-race/loader.png",
            logo: "/horse-race/horse-race-logo.png",
          },
        }}
        buildedGameUrl={"https://jbassets.fra1.digitaloceanspaces.com"}
      />
      <BetHistory gameType={GameType.HORSE_RACE} />
    </>
  );
};

export default HorseRacePage;
