import { UseFormReturn } from "react-hook-form";

import { COIN_SIDE } from "../constants";

export interface CoinFlip3dFormFields {
  wager: number;
  betCount: number;
  stopGain: number;
  stopLoss: number;
  coinSide: COIN_SIDE;
}

export type CoinFlip3dForm = UseFormReturn<
  CoinFlip3dFormFields,
  any,
  undefined
>;

export interface CoinFlip3dGameResult {
  coinSide: COIN_SIDE;
  payout: number;
  payoutInUsd: number;
}
