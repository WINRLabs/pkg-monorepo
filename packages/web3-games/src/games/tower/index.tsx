'use client';

import { TowerGameResult, TowerTemplate } from '@winrlabs/games';

import { BaseGameProps } from '../../type';
import { Badge } from '../hooks';

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
    gemImage?: string;
    bombImage?: string;
    logo?: string;
    cell?: string;
    bombCell?: string;
    selectedCell?: string;
    cellBomb?: string;
    cellCoin?: string;
    cellHover?: string;
    hoverRowCell?: string;
    gameBg?: string;
  };
};

interface TemplateWithWeb3Props extends BaseGameProps {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: TowerGameResult[]) => void;
  onAnimationSkipped?: (result: TowerGameResult[]) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

const TowerGame = (props: TemplateWithWeb3Props) => {
  const onGameSubmit = () => {};
  return (
    <>
      <TowerTemplate {...props} onSubmitGameForm={onGameSubmit} />
    </>
  );
};

export default TowerGame;
