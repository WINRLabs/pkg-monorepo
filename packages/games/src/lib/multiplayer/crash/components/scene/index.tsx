import { useRef } from 'react';

import { useCrashGameStore } from '../../crash.store';
import { useCrashGame } from './game';
import Overlay from './overlay';

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const elapsedTime = useCrashGameStore((state) => state.elapsedTime);
  const multiplier = useCrashGameStore((state) => state.currentMultiplier);
  useCrashGame({ canvasRef: ref, elapsedTime, multiplier });

  // todo: what the heck is this?
  return (
    <div className="wr-relative wr-h-full wr-w-full">
      <div
        className="wr-w-full wr-h-full wr-flex wr-items-center"
        style={{
          background: 'url(/crash/bg.png)',
          backgroundSize: 'cover',
        }}
      >
        <canvas
          ref={ref}
          style={{
            width: '100%',
          }}
        ></canvas>
      </div>
      <Overlay />
    </div>
  );
}
