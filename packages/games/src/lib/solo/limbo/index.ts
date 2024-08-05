import { LimboGame } from "./components/game";
import GameArea from "./components/game-area";
import LastBets from "./components/last-bets";
import Result from "./components/result";

export const Limbo = {
  GameArea,
  LastBets,
  Game: LimboGame,
  Result,
  // Slider: LimboSlider,
};

export { default as LimboTemplate } from "./components/template";
export * from "./types";

export * from "./store";
