import { RouletteGame } from "./components/game";
import { RouletteBetController } from "./components/roulette-bet-controller";
import { RouletteLastBets } from "./components/roulette-last-bets";
import { RouletteScene } from "./components/roulette-scene";
import { RouletteTable } from "./components/roulette-table";

export const Roulette = {
  Game: RouletteGame,
  Scene: RouletteScene,
  Table: RouletteTable,
  BetController: RouletteBetController,
  LastBets: RouletteLastBets,
};

export { default as RouletteTemplate } from "./components/template";
export * from "./store";
export * from "./types";
