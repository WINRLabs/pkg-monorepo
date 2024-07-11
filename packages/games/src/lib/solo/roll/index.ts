import { RollGame } from "./components/game";
import { GameArea } from "./components/game-area";
import { LastBets, RollController } from "./components/last-bets";

export const Roll = {
  LastBets,
  RollController,
  GameArea,
  Game: RollGame,
};

export { default as RollTemplate } from "./components/template";
export * from "./store";
export * from "./types";
