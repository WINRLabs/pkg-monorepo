import { UseFormReturn } from "react-hook-form";

export enum CardStatus {
  CLOSED = 0,
  OPEN = 1,
}

export interface VideoPokerFormFields {
  wager: number;
  cardsToSend: CardStatus[];
}

export type VideoPokerForm = UseFormReturn<
  VideoPokerFormFields,
  any,
  undefined
>;

export enum Value {
  two = 0,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  jack,
  queen,
  king,
  ace,
}

export enum Suit {
  hearts = 0b000000,
  diamonds = 0b010000,
  clubs = 0b100000,
  spades = 0b110000,
}

export const VideoPokerResultNames = [
  "Jacks or better",
  "Two pair",
  "Three of a kind",
  "Straight",
  "Flush",
  "Full house",
  "Four of a kind",
  "Straight flush",
  "Royal flush",
] as const;

export class Card {
  constructor(
    private _value: number,
    private _suit: number
  ) {}

  get value(): string {
    switch (this._value) {
      case Value.jack:
        return "J";

      case Value.queen:
        return "Q";

      case Value.king:
        return "K";

      case Value.ace:
        return "A";

      default:
        return (2 + this._value).toString();
    }
  }

  get className(): string {
    switch (this._suit) {
      case Suit.hearts:
        return "hearts";

      case Suit.diamonds:
        return "diamonds";

      case Suit.clubs:
        return "clubs";

      case Suit.spades:
        return "spades";

      default:
        return "";
    }
  }
}

export function parseCards(cards: number | number[]): Card[] {
  return (Array.isArray(cards) ? cards : parseImpl(cards)).map(
    (encoded) => new Card(encoded & 0b001111, encoded & 0b110000)
  );
}

function parseImpl(cards: number): number[] {
  const ret = Array(5);

  for (let i = 0; i < ret.length; i++) {
    const offset = i * 6;

    ret[i] = (cards & (0b111111 << offset)) >> offset;
  }

  return ret;
}

export function changedToFlipped(changed: number) {
  return [
    (changed & 16) !== 0,
    (changed & 8) !== 0,
    (changed & 4) !== 0,
    (changed & 2) !== 0,
    (changed & 1) !== 0,
  ];
}
