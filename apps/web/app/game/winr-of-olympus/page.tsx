"use client";

import { Web3GamesModals } from "@winrlabs/web3-games";
import dynamic from "next/dynamic";

const WinrOfOlympusGame = dynamic(
  () => import("@winrlabs/web3-games").then((mod) => mod.WinrOfOlympusGame),
  {
    ssr: false,
  }
);
const CDN_URL = process.env.NEXT_PUBLIC_BASE_CDN_URL || "";

export default function WinrOfOlympusPage() {
  return (
    <>
      <WinrOfOlympusGame
        buildedGameUrl={`${CDN_URL}/builded-games/winr-of-olympus`}
        buildedGameUrlMobile={`${CDN_URL}/builded-games/winr-of-olympus`}
      />
      <Web3GamesModals />
    </>
  );
}
