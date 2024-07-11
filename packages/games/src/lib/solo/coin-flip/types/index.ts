import { UseFormReturn } from "react-hook-form";
import THREE from "three";

import { CoinSide } from "../constants";

export interface CoinFlipFormFields {
  wager: number;
  betCount: number;
  stopGain: number;
  stopLoss: number;
  coinSide: CoinSide;
}

export type CoinFlipForm = UseFormReturn<CoinFlipFormFields, any, undefined>;

export interface CoinFlipGameResult {
  coinSide: CoinSide;
  payout: number;
  payoutInUsd: number;
}

export interface CoinCanvasProps {
  width?: number;
  height?: number;
  onLoad: (canvas: CoinCanvas) => void;
}

export interface CoinProps {
  width?: number;
  height?: number;
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: CoinFlipGameResult[]) => void;
  onAnimationSkipped?: (result: CoinFlipGameResult[]) => void;
}

export interface CoinSpeedArgs {
  duration: number;
}

export interface CoinRef {
  start: () => void;
  finish: (side: CoinSide) => Promise<void>;
  flipTo: (side: CoinSide) => Promise<void>;
}

export interface CoinCanvas {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  scene: THREE.Scene;
}

export declare type EasingFunction = (amount: number) => number;
