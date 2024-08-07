"use client";

import { LiveResults, Web3GamesModals } from "@winrlabs/web3-games";
import dynamic from "next/dynamic";
const CDN_URL = process.env.NEXT_PUBLIC_BASE_CDN_URL || "";

const CrashGame = dynamic(
  () => import("@winrlabs/web3-games").then((mod) => mod.CrashGame),
  {
    ssr: false,
  }
);

const CrashPage = () => {
  return (
    <>
      <CrashGame
        minWager={0.1}
        maxWager={2000}
        gameUrl={`${CDN_URL}/builded-games/crash`}
        options={{
          scene: {
            loader: "/crash/loader.png",
            logo: "/crash/game-logo.svg",
          },
        }}
      />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
};

export default CrashPage;
