import { BetController } from "./components/bet-controller";
import { Plinko3dGame } from "./components/game";
import { Plinko3dLastBets } from "./components/last-bets";
import { PlinkoScene } from "./components/scene";

export const Plinko3d = {
  LastBets: Plinko3dLastBets,
  Game: Plinko3dGame,
  BetController,
  Scene: PlinkoScene,
};

export { PlinkoGame as Plinko3dTemplate } from "./components/template";
export * from "./store";
export * from "./types";
