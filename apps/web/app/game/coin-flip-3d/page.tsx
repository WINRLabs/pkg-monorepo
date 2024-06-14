"use client";

import { CoinFlip3DTemplateWithWeb3 } from "@winrlabs/web3-games";

export default function CoinFlip3DPage() {
  return (
    <CoinFlip3DTemplateWithWeb3
      minWager={0.1}
      maxWager={100}
      options={{
        scene: {
          loader: "/coin-flip-3d/loader.png",
          logo: "/coin-flip-3d/coin-flip-logo.png",
        },
      }}
      buildedGameUrl={process.env.NEXT_PUBLIC_BASE_CDN_URL || ""}
    />
  );
}
