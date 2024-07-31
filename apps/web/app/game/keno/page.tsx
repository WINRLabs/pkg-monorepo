"use client";

import { KenoGame, LiveResults, Web3GamesModals } from "@winrlabs/web3-games";
import React from "react";

const KenoPage = () => {
  return (
    <>
      <KenoGame minWager={0.1} maxWager={2000} options={{}} />;
      <LiveResults />
      <Web3GamesModals />
    </>
  );
};

export default KenoPage;
