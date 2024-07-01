import { parseUnits } from "viem";
import { Address, Hex } from "viem";
import { BaccaratGameHand, toDecimals } from "@winrlabs/games";

export enum GAME_HUB_GAMES {
  rps = "rps",
  dice = "dice",
  keno = "keno",
  limbo = "limbo",
  mines = "mines",
  range = "range",
  plinko = "plinko",
  roulette = "roulette",
  coin_flip = "coin_flip",
  baccarat = "baccarat",
  black_jack = "black_jack",
  video_poker = "video_poker",
  wheel = "wheel",
  moon = "moon",
  horse_race = "horse_race",
}

export enum GAME_HUB_EVENT_TYPES {
  Settled = "Settled",
  Created = "Created",
  BaccaratHands = "Hands",
}

export interface SingleStepSettledEvent<T = number> {
  payout: bigint;
  payback: bigint;
  steps: {
    win: boolean;
    outcome: number;
    payout: bigint;
  }[];
  converted: {
    payout: number;
    payback: number;
    steps: {
      win: boolean;
      payout: number;
      outcome: T;
    }[];
  };
}

export interface BaccaratSettledEvent {
  converted: {
    payout: number;
  };
  hands: {
    banker: BaccaratGameHand;
    player: BaccaratGameHand;
  };
  payout: bigint;
  win: boolean;
}

export type UnitySendMessage = (
  gameObjectName: string,
  methodName: string,
  parameter?: any
) => void;

export enum PUBLIC_MULTIPLAYER_GAME_EVENTS {
  moon_game_events = "moon_game_events",
  wheel_game_events = "wheel_game_events",
  horse_race_game_events = "horse_race_game_events",
}

// V2 GAMEHUB
export enum DecoderType {
  Context = "context",
  Moon = "moon",
  Dice = "dice",
  Keno = "keno",
  Limbo = "limbo",
  Range = "range",
  Wheel = "wheel",
  Plinko = "plinko",
  CoinFlip = "coin-flip",
  Roulette = "roulette",
  HorseRace = "horse-race",
  RockPaperScissors = "rock-paper-scissors",
}

export type Item<T> = {
  type: string;
  data: T;
};

export type Event = {
  context: any;
  timestamp: bigint;
  type: string;
  id: string;
  player: string;
  program: string;
};

export type DecodedEvent<T, K> = {
  key: Hex;
  type: string;
  version: number;
  timestamp: number;
  context: Item<T>[];
  program: Item<K>[];
};

export interface PrepareGameTransactionParams {
  wager: number;
  lastPrice: number;
  selectedCurrency: `0x${string}`;
  stopGain?: number;
  stopLoss?: number;
}

export interface PrepareGameTransactionResult {
  wagerInWei: bigint;
  tokenAddress: `0x${string}`;
  stopGainInWei?: bigint;
  stopLossInWei?: bigint;
}

export const prepareGameTransaction = (
  params: PrepareGameTransactionParams
): PrepareGameTransactionResult => {
  const {
    lastPrice,
    wager,
    selectedCurrency,
    stopGain = 0,
    stopLoss = 0,
  } = params;

  const wagerInGameCurrency = toDecimals(
    (wager / lastPrice).toString(),
    6
  ).toString();

  const stopGainInGameCurrency = toDecimals(
    (stopGain / lastPrice).toString(),
    6
  ).toString();

  const stopLossInGameCurrency = toDecimals(
    (stopLoss / lastPrice).toString(),
    6
  ).toString();

  console.log(wagerInGameCurrency, "wager in currency");

  const decimal = 18;

  const wagerInWei = parseUnits(wagerInGameCurrency, decimal);

  const stopGainInWei = parseUnits(stopGainInGameCurrency, decimal);

  const stopLossInWei = parseUnits(stopLossInGameCurrency, decimal);

  const tokenAddress = selectedCurrency;

  return {
    wagerInWei,
    tokenAddress,
    stopGainInWei,
    stopLossInWei,
  };
};
