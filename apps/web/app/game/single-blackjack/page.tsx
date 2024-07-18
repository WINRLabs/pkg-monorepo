"use client";

import React from "react";
import {
  BlackjackGameStatus,
  GameStruct,
  GameType,
  SingleBJActiveGameHands,
  SingleBlackjackTemplate,
} from "@winrlabs/games";
import { BetHistory } from "@winrlabs/web3-games";

const defaultActiveGameHands = {
  dealer: {
    cards: null,
    hand: null,
  },
  firstHand: {
    cards: null,
    hand: null,
  },
  splittedFirstHand: {
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
      cards: [6, 0, 0, 0, 0, 0, 0, 0],
      amountCards: 1,
      totalCount: 6,
      isSoftHand: false,
      canSplit: false,
    },
    hand: null,
  },
  firstHand: {
    cards: {
      cards: [11, 9, 0, 0, 0, 0, 0, 0],
      amountCards: 2,
      totalCount: 19,
      isSoftHand: false,
      canSplit: true,
    },
    hand: {
      chipsAmount: 10,
      isInsured: false,
      status: 1,
      isDouble: false,
      isSplitted: true,
      splittedHandIndex: 1248,
    },
    handId: 1247,
  },
  splittedFirstHand: {
    cards: {
      cards: [11, 12, 0, 0, 0, 0, 0, 0],
      amountCards: 2,
      totalCount: 20,
      isSoftHand: false,
      canSplit: false,
    },
    hand: {
      chipsAmount: 10,
      isInsured: false,
      status: 1,
      isDouble: false,
      isSplitted: false,
      splittedHandIndex: null,
    },
    handId: 1248,
  },
};

const mockGameData = {
  activeHandIndex: 1247,
  canInsure: false,
  status: 2,
};

export default function SingleBlackjackPage() {
  const [activeGameData, setActiveGameData] =
    React.useState<GameStruct>(defaultGameData);
  const [activeGameHands, setActiveGameHands] =
    React.useState<SingleBJActiveGameHands>(defaultActiveGameHands);
  const [initialDataFetched, setInitialDataFetched] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setActiveGameData(mockGameData);
      setActiveGameHands(mockActiveGameHands);

      setInitialDataFetched(true);
      setTimeout(() => setInitialDataFetched(false), 500);
    }, 2000);
  }, []);

  return (
    <>
      <SingleBlackjackTemplate
        activeGameData={activeGameData}
        activeGameHands={activeGameHands}
        onReset={() => {}}
        onDeal={() => {}}
        onDoubleDown={() => {}}
        onHit={(a) => {
          console.log(a, "a");
        }}
        onInsure={() => {}}
        onSplit={() => {}}
        onStand={() => {}}
        onGameCompleted={() => {}}
        initialDataFetched={initialDataFetched}
        options={{}}
        minWager={2}
        maxWager={1000}
      />
      <BetHistory gameType={GameType.BLACKJACK} />
    </>
  );
}
