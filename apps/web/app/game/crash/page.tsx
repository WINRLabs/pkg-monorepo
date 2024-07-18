"use client";

import dynamic from "next/dynamic";

const CrashGame = dynamic(
  () => import("@winrlabs/web3-games").then((mod) => mod.CrashGame),
  {
    ssr: false,
  }
);

const CrashPage = () => {
  return (
    <CrashGame
      minWager={2}
      maxWager={2000}
      options={{
        scene: {
          loader: "/horse-race/loader.png",
          logo: "/horse-race/horse-race-logo.png",
        },
      }}
      buildedGameUrl={"https://jbassets.fra1.digitaloceanspaces.com"}
    />
  );
};

export default CrashPage;
