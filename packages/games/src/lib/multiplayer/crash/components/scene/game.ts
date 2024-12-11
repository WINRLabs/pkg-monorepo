import { Application, Assets, Graphics, Renderer, Sprite } from 'pixi.js';
import { useEffect, useRef } from 'react';

import { map } from '../../../../utils/number';
import { useCrashStore } from '../../crash.store';

const calculateSpeed = (progress: number) => {
  if (progress < 70) return 15;
  if (progress < 80) return 10;
  if (progress < 90) return 2;
  return 1;
};

const PADDING_LEFT = 100;
const PADDING_BOTTOM = 75;

export const useCrashGame = ({ elementRef }: { elementRef: HTMLElement | null }) => {
  const isRunning = useCrashStore((state) => state.isRunning);

  const appRef = useRef<Application<Renderer> | null>(null);

  const isRunningRef = useRef<boolean>(false);
  const currentProgressRef = useRef<number>(0);

  useEffect(() => {
    isRunningRef.current = isRunning;
    if (!isRunning) {
      currentProgressRef.current = 0;
    }
  }, [isRunning]);

  useEffect(() => {
    if (!elementRef || appRef.current) return;

    const init = async () => {
      const app = new Application();

      const backgroundAsset = await Assets.load('/crash/bg.png');
      const background = Sprite.from(backgroundAsset);

      await app.init({
        background: 'black',
        resolution: 1,
        antialias: true,
        resizeTo: elementRef,
      });

      background.anchor.set(0.5);

      background.x = app.canvas.width / 2;
      background.y = app.canvas.height / 2;

      background.width = 800;
      background.height = 800;

      app.stage.addChild(background);

      const targetX = app.canvas.width - 50;
      const targetY = 100;

      const circle = new Graphics();
      const rect = new Graphics();
      const line = new Graphics();

      app.stage.addChild(rect);
      app.stage.addChild(circle);
      app.stage.addChild(line);

      elementRef.appendChild(app.canvas);

      app.ticker.minFPS = 60;

      app.ticker.add(() => {
        if (!appRef.current || !isRunningRef.current) return;

        rect.clear();
        line.clear();

        const startX = PADDING_LEFT;
        const startY = appRef.current.canvas.height - PADDING_BOTTOM;

        const x = map(currentProgressRef.current / 100, 0, 1, startX, targetX);
        const y = map(currentProgressRef.current / 100, 0, 1, startY, targetY);

        const normalizedProgress = Math.min((currentProgressRef.current - 70) / 30, 1);

        let bendStrength = normalizedProgress > 0 ? normalizedProgress : 0;

        const controlOffsetX = 0;
        const controlOffsetY = bendStrength * -100;

        const controlX = (startX + x) / 2 + controlOffsetX;
        const controlY = (startY + y) / 2 - controlOffsetY;

        line.moveTo(startX, startY);

        line.quadraticCurveTo(controlX, controlY, x, y);

        line.stroke({ width: 10, color: '#84CC16', cap: 'round' });

        rect.moveTo(startX, startY + 4);
        rect.quadraticCurveTo(controlX, controlY, x, y);
        rect.lineTo(x, startY + 4);
        rect.fill('rgba(255, 255, 255, 0.3)');

        if (currentProgressRef.current < 100) {
          const speedF = calculateSpeed(currentProgressRef.current);
          currentProgressRef.current += speedF * 0.04;
        }

        circle.fill('#84CC16');
        circle.circle(0, 0, 12);
        circle.position.x = x;
        circle.position.y = y;
      });

      appRef.current = app;
    };

    init();
  }, [elementRef]);

  return {};
};
