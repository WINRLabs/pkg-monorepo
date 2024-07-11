import TWEEN, { Easing } from "@tweenjs/tween.js";

import { CoinSide } from "../../constants";
import { CoinCanvas, EasingFunction } from "../../types";
import createCylinder from "./cylinder";

class CoinRotate {
  private canvas!: CoinCanvas;
  private animation?: () => void;
  private increment = Math.PI / 15;
  private cylinder!: THREE.Mesh<
    THREE.CylinderGeometry,
    THREE.MeshBasicMaterial[]
  >;

  private addCylinder() {
    this.cylinder = createCylinder();
    this.canvas.scene.add(this.cylinder);
  }

  public setCanvas(canvas: CoinCanvas): this {
    this.canvas = canvas;

    return this;
  }

  public initialize() {
    if (!this.canvas) {
      throw new Error("Please set a canvas!");
    }

    this.addCylinder();
    this.renderer();
  }

  private renderer() {
    if (this.animation) {
      this.animation();
    }

    this.render();

    requestAnimationFrame(() => this.renderer());
  }

  private render() {
    this.canvas.renderer.render(this.canvas.scene, this.canvas.camera);
  }

  private get position(): number {
    return this.cylinder.rotation.z;
  }

  private setPosition(z: number): this {
    this.cylinder.rotation.z = z;

    return this;
  }

  private clearAnimation(): this {
    this.animation = undefined;

    return this;
  }

  private setAnimation(animation: () => void): this {
    this.animation = animation;

    return this;
  }

  private continue() {
    this.setAnimation(() => {
      this.setPosition(this.position + this.increment);
    });
  }

  private async animateByEffect(
    from: number,
    to: number,
    easing: EasingFunction,
    duration: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const tween = new TWEEN.Tween({ z: from })
        .to({ z: to }, duration)
        .easing(easing)
        .onComplete(() => {
          this.clearAnimation();
          resolve();
        })
        .onUpdate(({ z }: { z: number }) => this.setPosition(z))
        .start();

      this.setAnimation(() => tween.update());
    });
  }

  private getRemainingMovement() {
    const halfWayPosition = this.position % Math.PI;
    const remainingMovement = Math.PI - halfWayPosition;

    return remainingMovement;
  }

  private getCurrentSide(): CoinSide {
    const remainingMovement = this.getRemainingMovement();
    const currentSide =
      Math.round((this.position + remainingMovement) / Math.PI) % 2;

    return currentSide;
  }

  private getSidePositionInFuture(side: CoinSide) {
    const remainingMovement = this.getRemainingMovement();
    const currentSide = this.getCurrentSide();
    let multiplier = 0;

    if (currentSide === CoinSide.TAILS) {
      multiplier = side === CoinSide.TAILS ? 1 : 0;
    } else if (currentSide === CoinSide.HEADS) {
      multiplier = side === CoinSide.HEADS ? 1 : 0;
    }

    return this.position + remainingMovement + Math.PI * (multiplier + 2);
  }

  public async start(duration: number): Promise<void> {
    return this.animateByEffect(
      0,
      Math.PI * 2,
      Easing.Quadratic.In,
      duration
    ).then(() => {
      this.continue();
    });
  }

  public finish(side: CoinSide, duration: number) {
    return new Promise((resolve) => {
      this.clearAnimation();
      const to = this.getSidePositionInFuture(side);

      return this.animateByEffect(
        this.position,
        to,
        Easing.Elastic.Out,
        duration
      ).then(resolve);
    });
  }

  public async flipTo(side: CoinSide, duration: number) {
    /*   if (this.animation) {
      return;
    } */

    return this.animateByEffect(
      this.position,
      side === CoinSide.TAILS ? 0 : Math.PI,
      TWEEN.Easing.Quadratic.InOut,
      duration
    );
  }
}

export default CoinRotate;
