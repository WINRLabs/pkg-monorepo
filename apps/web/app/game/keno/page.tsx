"use client";

import { GameType } from "@winrlabs/games";
import { BetHistory, KenoGame } from "@winrlabs/web3-games";
import React from "react";

const KenoPage = () => {
  return (
    <>
      <KenoGame minWager={0.1} maxWager={2000} options={{}} />;
      <BetHistory gameType={GameType.KENO} />
    </>
  );
};

export default KenoPage;
