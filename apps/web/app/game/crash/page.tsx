"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory } from "@winrlabs/web3-games";
import dynamic from "next/dynamic";

const CrashGame = dynamic(
  () => import("@winrlabs/web3-games").then((mod) => mod.CrashGame),
  {
    ssr: false,
  }
);

const CrashPage = () => {
  return (
    <>
      <CrashGame minWager={2} maxWager={2000} />
      <BetHistory gameType={GameType.MOON} />
    </>
  );
};

export default CrashPage;
