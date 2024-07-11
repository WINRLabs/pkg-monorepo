import { CoinFlipController } from "./components/controller";
import { CoinFlipGame } from "./components/game";
import { CoinFlipLastBets } from "./components/last-bets";
import { CoinFlipScene } from "./components/scene";

export const CoinFlip3D = {
  Game: CoinFlipGame,
  Controller: CoinFlipController,
  LastBets: CoinFlipLastBets,
  Scene: CoinFlipScene,
};

export { CoinFlipTemplate as CoinFlip3DTemplate } from "./components/template";
export * from "./constants";
export * from "./store";
export * from "./types";
