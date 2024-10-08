import React from 'react';

import useTowerGameStore from '../store';
import { TowerGameResult } from '../types';

export type TowerGameProps = React.ComponentProps<'div'> & {
  gameResults: TowerGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: TowerGameResult[]) => void;
  onAnimationSkipped?: (result: TowerGameResult[]) => void;
  onError?: (e: any) => void;
};

export const TowerGame = ({ gameResults, children }: TowerGameProps) => {
  const { updateTowerGameResults } = useTowerGameStore(['updateTowerGameResults']);

  React.useEffect(() => {
    if (gameResults.length) {
      updateTowerGameResults(gameResults);
    }
  }, [gameResults]);

  return <>{children}</>;
};
