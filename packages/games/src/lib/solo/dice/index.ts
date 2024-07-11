import { Body } from "./components/body";
import { Controller } from "./components/controller";
import { RangeGame } from "./components/game";
import { RangeLastBets } from "./components/last-bets";
import { Slider } from "./components/slider";
import { TextRandomizer } from "./components/text-randomizer";

export const Dice = {
  Game: RangeGame,
  Slider,
  Body,
  TextRandomizer,
  Controller,
  LastBets: RangeLastBets,
};

export { default as DiceTemplate } from "./components/template";
export * from "./store";
export * from "./types";
