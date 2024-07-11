import { BetController } from "./components/bet-controller";
import { KenoGame } from "./components/game";
import MultiplierCarousel from "./components/multiplier-carousel";
import { KenoScene } from "./components/scene";

export const Keno = {
  Controller: BetController,
  MultiplierCarousel,
  Scene: KenoScene,
  Game: KenoGame,
};

export { default as KenoTemplate } from "./components/template";
export * from "./constants";
export * from "./store";
export * from "./types";
