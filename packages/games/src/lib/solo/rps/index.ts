import { RpsGame } from "./components/game";
import LastBets from "./components/last-bets";
import Scene from "./components/scene";

export const Rps = {
  LastBets,
  Scene,
  Game: RpsGame,
};

export { default as RpsTemplate } from "./components/template";
export * from "./types";
