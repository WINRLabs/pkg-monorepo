"use client";

import {
  ActiveGameHands,
  BlackjackGameStatus,
  BlackjackTemplate,
  GameStruct,
  GameType,
} from "@winrlabs/games";
import { BetHistory, BlackjackGame } from "@winrlabs/web3-games";
import React, { useState } from "react";

const defaultActiveGameHands = {
  dealer: {
    cards: null,
    hand: null,
  },
  firstHand: {
    cards: null,
    hand: null,
  },
  secondHand: {
    cards: null,
    hand: null,
  },
  thirdHand: {
    cards: null,
    hand: null,
  },
  splittedFirstHand: {
    cards: null,
    hand: null,
  },
  splittedSecondHand: {
    cards: null,
    hand: null,
  },
  splittedThirdHand: {
    cards: null,
    hand: null,
  },
};

const defaultGameData = {
  activeHandIndex: 0,
  canInsure: false,
  status: BlackjackGameStatus.NONE,
};

const mockActiveGameHands = {
  dealer: {
    cards: {
      cards: [13, 6, 4, 2, 11, 0, 0, 0],
      amountCards: 1,
      totalCount: 13,
      isSoftHand: false,
      canSplit: false,
    },
    hand: null,
  },
  firstHand: {
    cards: {
      cards: [13, 9, 0, 0, 0, 0, 0, 0],
      amountCards: 2,
      totalCount: 22,
      isSoftHand: false,
      canSplit: false,
    },
    hand: {
      chipsAmount: 12,
      isInsured: false,
      status: 1,
      isDouble: false,
      isSplitted: false,
      splittedHandIndex: 0,
    },
    handId: 1143,
    isCompleted: true,
  },
  secondHand: {
    cards: {
      cards: [2, 6, 0, 0, 0, 0, 0, 0],
      amountCards: 2,
      totalCount: 8,
      isSoftHand: false,
      canSplit: false,
    },
    hand: {
      chipsAmount: 10,
      isInsured: false,
      status: 1,
      isDouble: false,
      isSplitted: false,
      splittedHandIndex: 0,
    },
    handId: 1144,
    isCompleted: true,
  },
  thirdHand: {
    cards: {
      cards: [11, 11, 0, 0, 0, 0, 0, 0],
      amountCards: 2,
      totalCount: 22,
      isSoftHand: false,
      canSplit: true,
    },
    hand: {
      chipsAmount: 10,
      isInsured: false,
      status: 1,
      isDouble: false,
      isSplitted: false,
      splittedHandIndex: 0,
    },
    handId: 1145,
    isCompleted: true,
  },
  splittedFirstHand: {
    cards: null,
    hand: null,
  },
  splittedSecondHand: {
    cards: null,
    hand: null,
  },
  splittedThirdHand: {
    cards: null,
    hand: null,
  },
};

const mockGameData = {
  activeHandIndex: 1143,
  canInsure: false,
  status: 1,
};

export default function BlackjackPage() {
  // const [activeGameData, setActiveGameData] =
  //   React.useState<GameStruct>(defaultGameData);
  // const [activeGameHands, setActiveGameHands] = React.useState<ActiveGameHands>(
  //   defaultActiveGameHands
  // );
  // const [initialDataFetched, setInitialDataFetched] = React.useState(false);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setActiveGameData(mockGameData);
  //     setActiveGameHands(mockActiveGameHands);

  //     setInitialDataFetched(true);
  //     setTimeout(() => setInitialDataFetched(false), 500);
  //   }, 2000);
  // }, []);
  return (
    <>
      <BlackjackGame minWager={0.1} maxWager={2000} options={{}} />;
      <BetHistory gameType={GameType.BLACKJACK} />
    </>
  );
}
