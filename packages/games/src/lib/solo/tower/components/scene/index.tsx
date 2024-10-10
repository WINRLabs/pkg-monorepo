import React from 'react';

import { TemplateOptions } from '../template';
import TowerGame from '../tower-game';

export type TowerSceneProps = {
  options?: TemplateOptions;
};

export const TowerScene: React.FC<TowerSceneProps> = ({ ...props }) => {
  return <TowerGame {...props} />;
};
