import { LimboGame } from "./components/game";
import GameArea from "./components/game-area";
import LastBets from "./components/last-bets";
import ResultAnimation from "./components/result-animation";
import LimboSlider from "./components/slider";

export const Limbo = {
  GameArea,
  LastBets,
  ResultAnimation,
  Game: LimboGame,
  Slider: LimboSlider,
};

export { default as LimboTemplate } from "./components/template";
export * from "./types";
