import React from 'react';

import { useGameSkip } from '../../../game-provider';
import useTowerGameStore from '../store';
import { TowerGameResult } from '../types';

export type TowerGameProps = React.ComponentProps<'div'> & {
  gameResults?: TowerGameResult[];
  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: TowerGameResult[]) => void;
  onAnimationSkipped?: (result: TowerGameResult[]) => void;
  onError?: (e: any) => void;
};

export const TowerGame = ({ gameResults, children }: TowerGameProps) => {
  const { updateTowerGameResults, updateGameStatus } = useTowerGameStore([
    'updateTowerGameResults',
    'updateGameStatus',
  ]);

  const { updateSkipAnimation } = useGameSkip();

  React.useEffect(() => {
    if (gameResults?.length) {
      updateSkipAnimation(false);
      updateTowerGameResults(gameResults);
    }
  }, [gameResults]);

  React.useEffect(() => {
    updateTowerGameResults([]);
    updateGameStatus('IDLE');
  }, []);
  return <>{children}</>;
};
