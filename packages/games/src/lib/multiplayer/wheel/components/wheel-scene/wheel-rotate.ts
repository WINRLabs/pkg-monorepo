import TWEEN, { Easing } from "@tweenjs/tween.js";

import {
  baseCdnUrl,
  effects,
  SoundEffects,
} from "../../../../hooks/use-audio-effect";

export declare type EasingFunction = (amount: number) => number;

class WheelRotate {
  private wheel!: HTMLDivElement;
  private degree = 0;
  private timeout!: NodeJS.Timeout;
  private increment = 0;
  private animate?: CallableFunction;
  private index = 0;
  private sound!: HTMLAudioElement;

  public get isInitialized() {
    return typeof this.wheel !== "undefined";
  }

  public setWheel(wheel: HTMLDivElement): this {
    this.wheel = wheel;

    this.sound = new Audio(
      `${baseCdnUrl}/${effects.get(SoundEffects.WHEEL_STEP)}`,
    );

    return this;
  }

  public move(): this {
    this.setAnmate(() => this.increaseDegree(this.increment).set(), 4.8);

    this.renderer();

    return this;
  }

  public stop(): this {
    this.clearAnimate();

    return this;
  }

  public async reset(): Promise<void> {
    this.renderer();

    return this.goToDegree(0).then(() => this.clearAnimate());
  }

  public async goToDegree(toDegree: number): Promise<void> {
    this.renderer();

    // // const measurement_ = this.measurement;
    // // const angle =  ;
    // // const index = Math.floor(angle / measurement_.unitHeight);
    // // return this.units[index];
    // const angle = this.degree % 63504000;
    return this.animateByEffect(
      this.degree,
      this.calcMovementTo(toDegree),
      Easing.Circular.Out,
      6000,
    );
  }

  calcMovementTo(toDegree: number): number {
    let neededMovementAsDegree = toDegree;

    if (this.degree > toDegree) {
      neededMovementAsDegree = 360 + toDegree;
    } else {
      if (toDegree - this.degree < 180) {
        neededMovementAsDegree = 360 + toDegree;
      }
    }

    return neededMovementAsDegree;
  }

  private setAnmate(animate: CallableFunction, increment = 0) {
    this.increment = increment;

    this.animate = animate;
  }

  private clearAnimate() {
    this.animate = undefined;

    clearTimeout(this.timeout);
  }

  private async animateByEffect(
    from: number,
    to: number,
    easing: EasingFunction,
    duration: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      const tween = new TWEEN.Tween({ z: from })
        .to({ z: to }, duration)
        .easing(easing)
        .onComplete(() => {
          this.clearAnimate();

          resolve();
        })
        .onUpdate(({ z }: { z: number }) => {
          this.setDegree(z).set();
        })
        .start();

      this.setAnmate(() => tween.update());
    });
  }

  private renderer() {
    this.animation();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => this.renderer(), 24);
  }

  private stepEffect() {
    const index = (this.degree - (this.degree % 7.3469)) / 7.3469;

    if (index !== this.index) {
      this.index = index;

      this.sound.playbackRate = 6;

      this.sound.currentTime = 0;

      const volume = Number(localStorage["volume"]) || 0;

      this.sound.volume = volume / 100;

      this.sound.play().catch(() => console.log("click to sound on!"));
    }
  }

  private setDegree(value: number): this {
    this.degree = value % 360;

    this.stepEffect();

    return this;
  }

  private increaseDegree(value: number): this {
    this.degree = (this.degree + value) % 360;

    this.stepEffect();

    return this;
  }

  private set(): this {
    this.wheel.style.transform = `rotate(-${this.degree}deg)`;

    return this;
  }

  private animation() {
    if (this.animate) {
      this.animate();
    }
  }
}

export default WheelRotate;
