"use client";

import { RollTemplateWithWeb3 } from "@winrlabs/web3-games";
import React from "react";

const RollPage = () => {
  return (
    <RollTemplateWithWeb3
      options={{
        scene: {
          backgroundImage: "url(/coin-flip/coin-flip-bg.png)",
        },
      }}
      minWager={0.1}
      maxWager={2000}
    />
  );
};

export default RollPage;
