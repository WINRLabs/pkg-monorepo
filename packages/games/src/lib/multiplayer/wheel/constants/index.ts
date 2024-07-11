export type Multiplier = "2x" | "3x" | "6x" | "48x";

export enum WheelColor {
  IDLE = "0",
  GREY = "1",
  BLUE = "2",
  GREEN = "3",
  RED = "4",
}

export enum WheelStatus {
  Finished = "Finished",
  Idle = "Idle",
  Spin = "Spin",
  Started = "Started",
}

export const colorMultipliers: { [key in WheelColor]: number } = {
  [WheelColor.IDLE]: 0,
  [WheelColor.GREY]: 2,
  [WheelColor.BLUE]: 3,
  [WheelColor.GREEN]: 6,
  [WheelColor.RED]: 48,
} as const;

export const WheelUnits = [
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.GREEN,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.GREY,
  WheelColor.BLUE,
  WheelColor.RED,
];

export const ANGLE_SCALE = 1.764;

export const participantMapWithStore: Record<WheelColor, Multiplier> = {
  [WheelColor.IDLE]: "2x",
  [WheelColor.GREY]: "2x",
  [WheelColor.BLUE]: "3x",
  [WheelColor.GREEN]: "6x",
  [WheelColor.RED]: "48x",
};
