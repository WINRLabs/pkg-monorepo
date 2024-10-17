'use client';

import { TowerGame } from '@winrlabs/web3-games';
import React from 'react';

const TowerPage = () => {
  return (
    <TowerGame
      options={{
        scene: {
          backgroundImage: '/tower/tower-bg.png',
          bombImage: '/tower/bomb.png',
          gemImage: '/tower/fish.png',
          logo: '/tower/logo.png',
          cell: '/tower/cell.png',
          bombCell: '/tower/bomb-cell.png',
          selectedCell: '/tower/selected-cell.png',
          cellBomb: '/tower/cell-bomb.png',
          cellCoin: '/tower/cell-coin.png',
          cellHover: '/tower/cell-hover.png',
          hoverRowCell: '/tower/hover-cell.png',
          gameBg: '/tower/game-bg.png',
        },
      }}
    />
  );
};

export default TowerPage;
