import React from "react";

import { CDN_URL } from "../../../constants";
import { wait } from "../../../utils/promise";
import { BlackjackGameResult, TIMEOUT } from "..";

const BigDiamonds = <img src={`${CDN_URL}/blackjack/suits/big-diamonds.svg`} />;
const BigClubs = <img src={`${CDN_URL}/blackjack/suits/big-clubs.svg`} />;
const BigHearts = <img src={`${CDN_URL}/blackjack/suits/big-hearts.svg`} />;
const BigSpades = <img src={`${CDN_URL}/blackjack/suits/big-spades.svg`} />;

const SmallClubs = <img src={`${CDN_URL}/blackjack/suits/small-clubs.svg`} />;
const SmallDiamonds = (
  <img src={`${CDN_URL}/blackjack/suits/small-diamonds.svg`} />
);
const SmallHearts = <img src={`${CDN_URL}/blackjack/suits/small-hearts.svg`} />;
const SmallSpades = <img src={`${CDN_URL}/blackjack/suits/small-spades.svg`} />;

export enum BlackjackCardValue {
  ACE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
}

export enum BlackjackSuit {
  HEARTS = "hearts",
  DIAMONDS = "diamonds",
  CLUBS = "clubs",
  SPADES = "spades",
}

export class BlackjackCard {
  constructor(
    private _value: number,
    private _suit?: BlackjackSuit
  ) {}

  get renderValue(): string {
    switch (this._value) {
      case BlackjackCardValue.ACE:
        return "A";

      case BlackjackCardValue.JACK:
        return "J";

      case BlackjackCardValue.QUEEN:
        return "Q";

      case BlackjackCardValue.KING:
        return "K";

      default:
        return this._value.toString();
    }
  }

  get value(): number {
    switch (this._value) {
      case BlackjackCardValue.ACE:
        return 1;

      case BlackjackCardValue.JACK:
        return 10;

      case BlackjackCardValue.QUEEN:
        return 10;

      case BlackjackCardValue.KING:
        return 10;

      default:
        return this._value;
    }
  }

  get suit(): BlackjackSuit {
    return this._suit ? this._suit : BlackjackSuit.CLUBS;
  }
}

export const getBlackjackIcon = (suit: BlackjackSuit) => {
  switch (suit) {
    case BlackjackSuit.SPADES:
      return { main: BigSpades, suit: SmallSpades };

    case "hearts":
      return { main: BigHearts, suit: SmallHearts };

    case "diamonds":
      return { main: BigDiamonds, suit: SmallDiamonds };

    case "clubs":
      return { main: BigClubs, suit: SmallClubs };
  }
};

export const getBlackjackSuit = (): BlackjackSuit => {
  const suits = Object.values(BlackjackSuit);

  const randomIdx = Math.floor(Math.random() * suits.length);

  return suits[randomIdx] as BlackjackSuit;
};

export const checkBJGameResult = (
  result: BlackjackGameResult
): "winner" | "push" | "lost" | "insured" => {
  switch (result) {
    case BlackjackGameResult.DEALER_STAND_PLAYER_WIN:
      return "winner";

    case BlackjackGameResult.DEALER_BUST_PLAYER_WIN:
      return "winner";

    case BlackjackGameResult.DEALER_BUST_PLAYER_BLACKJACK:
      return "winner";

    case BlackjackGameResult.DEALER_BLACKJACK_HAND_PUSH:
      return "push";

    case BlackjackGameResult.DEALER_STAND_HAND_PUSH:
      return "push";

    case BlackjackGameResult.DEALER_BLACKJACK_PLAYER_INSURED:
      return "insured";

    default:
      return "lost";
  }
};

export const calcTotalAmounts = (cards: (BlackjackCard | null)[]) => {
  let amount = 0;

  let softHandAmount = 0;

  let isSoftAmountAdded = false;

  for (const d of cards) {
    const v = d?.value || 0;

    amount += v;

    if (v === 1 && !isSoftAmountAdded) {
      softHandAmount += 11; // Ace is worth 1 or 11 depending on the hand value

      isSoftAmountAdded = true;
    } else softHandAmount += v;
  }

  return {
    amount,
    softHandAmount,
  };
};

export const distributeNewCards = async (
  cardNumbers: number[],
  cards: (BlackjackCard | null)[],
  setNewCards: (value: React.SetStateAction<(BlackjackCard | null)[]>) => void,
  sfxCb: (options?: any) => Promise<void>
) => {
  for (let i = 0; i <= 5; i++) {
    const card = cardNumbers[i];

    if (!cards[i] && card) {
      setNewCards((prev) => [
        ...prev,
        new BlackjackCard(card, getBlackjackSuit()),
      ]);

      sfxCb();

      await wait(TIMEOUT);
    }
  }
};
