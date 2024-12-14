import { useEffect } from 'react';

import { MultiplayerGameStatus } from '../../../core/type';
import { useCrashGameStore } from '../../crash.store';

export default function Overlay() {
  const { finalMultiplier, status, update, currentMultiplier } = useCrashGameStore((state) => ({
    finalMultiplier: state.finalMultiplier,
    status: state.status,
    update: state.updateState,
    currentMultiplier: state.currentMultiplier,
  }));

  useEffect(() => {
    let intervalRef: NodeJS.Timeout;
    let elapsedTimeRef: NodeJS.Timeout;
    if (status == MultiplayerGameStatus.Start) {
      let elapsedTime = 0;
      let current = currentMultiplier;

      elapsedTimeRef = setInterval(() => {
        elapsedTime += 1;
        update({ elapsedTime });
      }, 1000);

      intervalRef = setInterval(() => {
        let speed = 0.005;
        if (current > 2) {
          speed = 0.008;
        } else if (current > 4) {
          speed = 0.01;
        } else if (current > 6) {
          speed = 0.012;
        } else if (current > 8) {
          speed = 0.014;
        } else if (current > 14) {
          speed = 0.016;
        }
        current = current + speed;

        update({ currentMultiplier: current });
      }, 50);
    }

    return () => {
      clearInterval(intervalRef);
      clearInterval(elapsedTimeRef);
    };
  }, [finalMultiplier, status]);

  return (
    <div>
      {finalMultiplier && (
        <div className="wr-absolute wr-h-full wr-w-full wr-z-30 wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-flex wr-justify-center wr-items-center">
          <div className="wr-text-white wr-text-[80px] wr-font-semibold wr-drop-shadow-md">
            {currentMultiplier.toFixed(2)}x
          </div>
        </div>
      )}
    </div>
  );
}
