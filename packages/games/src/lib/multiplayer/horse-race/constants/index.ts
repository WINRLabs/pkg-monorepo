export type HorseRaceMultiplier = "2x" | "3x" | "8x" | "15x" | "60x";

export enum Horse {
  IDLE = "0",
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
}

export const horseMultipliers: Record<Horse, number> = {
  [Horse.IDLE]: 1,
  [Horse.ONE]: 2,
  [Horse.TWO]: 3,
  [Horse.THREE]: 8,
  [Horse.FOUR]: 15,
  [Horse.FIVE]: 60,
};

export enum HorseRaceStatus {
  Finished = "Finished",
  Idle = "Idle",
  Race = "Race",
  Started = "Started",
}
