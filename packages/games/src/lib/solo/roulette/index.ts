import { BetController } from "./components/bet-controller";
import { RouletteGame } from "./components/game";
import { RouletteLastBets } from "./components/roulette-last-bets";
import { RouletteScene } from "./components/roulette-scene";
import { RouletteTable } from "./components/roulette-table";

export const Roulette = {
  Game: RouletteGame,
  Scene: RouletteScene,
  Table: RouletteTable,
  BetController,
  LastBets: RouletteLastBets,
};

export { default as RouletteTemplate } from "./components/template";
export * from "./store";
export * from "./types";
