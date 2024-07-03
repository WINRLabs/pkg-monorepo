export enum VideoPokerResult {
  LOST = 0,
  JACKS_OR_BETTER = 1,
  TWO_PAIR = 2,
  THREE_OF_A_KIND = 3,
  STRAIGHT = 4,
  FLUSH = 5,
  FULL_HOUSE = 6,
  FOUR_OF_A_KIND = 7,
  STRAIGHT_FLUSH = 8,
  ROYAL_FLUSH = 9,
}

export const videoPokerHands = [
  {
    name: "Royal Flush",
    multiplier: 100,
    value: VideoPokerResult.ROYAL_FLUSH,
  },
  {
    name: "Straight Flush",
    multiplier: 50,
    value: VideoPokerResult.STRAIGHT_FLUSH,
  },
  {
    name: "Four of a kind",
    multiplier: 25,
    value: VideoPokerResult.FOUR_OF_A_KIND,
  },
  {
    name: "Full House",
    multiplier: 8,
    value: VideoPokerResult.FULL_HOUSE,
  },
  {
    name: "Flush",
    multiplier: 6,
    value: VideoPokerResult.FLUSH,
  },
  {
    name: "Straight",
    multiplier: 5,
    value: VideoPokerResult.STRAIGHT,
  },
  {
    name: "Three of a kind",
    multiplier: 3,
    value: VideoPokerResult.THREE_OF_A_KIND,
  },
  {
    name: "Two Pairs",
    multiplier: 2,
    value: VideoPokerResult.TWO_PAIR,
  },
  {
    name: "Jacks or Better",
    multiplier: 1,
    value: VideoPokerResult.JACKS_OR_BETTER,
  },
] as const;
