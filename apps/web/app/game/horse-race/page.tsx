"use client";

import { LiveResults, Web3GamesModals } from "@winrlabs/web3-games";
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
      <LiveResults />
      <Web3GamesModals />
    </>
  );
};

export default HorseRacePage;
