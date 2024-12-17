import { Application, Assets, Graphics, Renderer, Sprite, Text } from 'pixi.js';
import { RefObject, useEffect, useRef } from 'react';

import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { map } from '../../../../utils/number';
import { MultiplayerGameStatus } from '../../../core/type';
import { useCrashGameStore } from '../../crash.store';

const calculateSpeed = (progress: number) => {
  if (progress < 70) return 15;
  if (progress < 80) return 10;
  if (progress < 90) return 2;
  return 1;
};

const CIRCLE_RADIUS = 10;
const SCENE_HEIGHT = 600;

const PADDING_LEFT = 140;
const PADDING_BOTTOM = 40;

const startX = PADDING_LEFT;
const startY = SCENE_HEIGHT - PADDING_BOTTOM;

export const useCrashGame = ({
  canvasRef,
  elapsedTime,
  multiplier,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
  elapsedTime?: number;
  multiplier: number;
}) => {
  const appRef = useRef<Application<Renderer> | null>(null);
  const timeTotalRef = useRef<Text | null>(null);
  const timePortionsRef = useRef<Text[]>([]);
  const multipliersRef = useRef<Text[]>([]);
  const currentProgressRef = useRef<number>(0);
  const bombEffect = useAudioEffect(SoundEffects.MINES_BOMB);

  useEffect(() => {
    if (!timeTotalRef.current) return;

    timeTotalRef.current.text = `Total ${elapsedTime}s`;

    if (
      timePortionsRef.current &&
      timePortionsRef.current.length === 4 &&
      elapsedTime &&
      elapsedTime > 12 &&
      elapsedTime % 2 === 0
    ) {
      for (let i = 0; i < timePortionsRef.current.length - 1; i++) {
        let current = timePortionsRef.current[i];
        let next = timePortionsRef.current[i + 1];
        if (!current || !next) continue;
        current.text = timePortionsRef.current[i + 1]?.text || '';
      }

      let prev = timePortionsRef.current[timePortionsRef.current.length - 1];
      if (!prev) return;

      prev.text = `${elapsedTime}s`;
    }
  }, [elapsedTime]);

  useEffect(() => {
    if (!multipliersRef.current || multiplier < 2) return;
    const baseMultiplier = multiplier;
    const gap = 0.2;

    multipliersRef.current.forEach((portion, index) => {
      portion.text = `${(baseMultiplier - gap * index).toFixed(1)}×`;
    });
  }, [multiplier]);

  const addYAxis = async () => {
    const line = new Graphics();

    for (let i = 0; i < 20; i += 1) {
      line.beginPath();
      line.moveTo(20, 100 + i * 25);
      const values = {
        19: '1.0x',
        15: '1.2x',
        11: '1.3x',
        7: '1.5x',
        3: '1.7x',
        0: '1.8x',
      };
      if (i === 0 || i === 3 || i === 7 || i === 11 || i === 15 || i === 19) {
        const text = new Text({
          text: values[i],
          x: 85,
          y: 100 + i * 25 - 10,
          style: {
            fill: '#FFFFFF80',
            fontSize: 18,
          },
        });

        appRef.current?.stage.addChild(text);
        multipliersRef.current.push(text);
        line.lineTo(80, 100 + i * 25);
      } else {
        line.lineTo(50, 100 + i * 25);
      }
      line.stroke({ width: 3, color: '#FFFFFF30' });
      line.closePath();
    }

    appRef.current?.stage.addChild(line);
  };

  const addXAxis = async () => {
    if (!appRef.current || !canvasRef.current) return;

    const timeFrames = ['2s', '4s', '6s', '8s'];

    let lastTimeFrameXPos = startX + 100;

    const timePortions = timeFrames.map((timeFrame) => {
      const newText = new Text({
        text: timeFrame,
        x: lastTimeFrameXPos,
        y: SCENE_HEIGHT - PADDING_BOTTOM + 20,
        style: {
          fill: '#FFFFFF80',
          fontSize: 18,
        },
      });

      lastTimeFrameXPos += 125;

      return newText;
    });

    appRef.current.stage.addChild(...timePortions);
    timePortionsRef.current = timePortions;

    const timeTotal = new Text({
      text: 'Total 0s',
      x: canvasRef.current.clientWidth - 100,
      y: SCENE_HEIGHT - PADDING_BOTTOM + 20,
      style: {
        fill: '#FFFFFF80',
        fontSize: 18,
      },
    });

    appRef.current.stage.addChild(timeTotal);
    timeTotalRef.current = timeTotal;
  };

  useEffect(() => {
    const init = async () => {
      if (!canvasRef.current || appRef.current) return;

      const app = new Application();

      appRef.current = app;

      await app.init({
        resolution: 2,
        canvas: canvasRef.current,
        backgroundAlpha: 0,
      });

      const crashEffectImage = await Assets.load('/crash/crash-effect.png');

      const targetX = canvasRef.current.clientWidth - 50;
      const targetY = 100;

      const circle = new Graphics();
      const rect = new Graphics();
      const line = new Graphics();

      circle.circle(startX, startY, CIRCLE_RADIUS);
      circle.fill('#84CC16');
      app.stage.addChild(circle);

      app.ticker.add(() => {
        const currentState = useCrashGameStore.getState();

        if (!appRef.current || currentState.status !== MultiplayerGameStatus.Start) return;

        circle.clear();
        rect.clear();
        line.clear();

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

        // we are adding 4 to rect height to justify with the line
        rect.moveTo(startX, startY + 4);
        rect.quadraticCurveTo(controlX, controlY, x, y);
        rect.lineTo(x, startY + 4);
        rect.fill('rgba(255, 255, 255, 0.3)');

        if (currentProgressRef.current < 100) {
          const speedF = calculateSpeed(currentProgressRef.current);
          currentProgressRef.current += speedF * app.ticker.deltaTime * 0.01;
        }
        circle.circle(x, y, CIRCLE_RADIUS);
        circle.fill('#84CC16');

        const hasCrashed = currentState.currentMultiplier >= currentState.finalMultiplier;

        if (hasCrashed) {
          currentState.updateState({
            status: MultiplayerGameStatus.Finish,
            currentMultiplier: currentState.finalMultiplier,
          });
          bombEffect.play();

          const effect = Sprite.from(crashEffectImage);
          effect.anchor.set(0.5);
          effect.x = x;
          effect.y = y;
          effect.scale.set(0.5);
          effect.alpha = 0;

          const animate = () => {
            effect.alpha += 0.02;

            if (effect.alpha < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
          app.stage.addChild(effect);

          return;
        }
      });

      app.stage.addChild(rect);
      app.stage.addChild(line);

      addYAxis();
      addXAxis();
    };

    init();
  }, [canvasRef?.current]);

  return {};
};
