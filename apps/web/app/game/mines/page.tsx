'use client';

import { MinesGame, Web3GamesModals } from '@winrlabs/web3-games';
import React from 'react';

const MinesPage = () => {
  return (
    <>
      <MinesGame
        maxWager={100}
        minWager={0.01}
        theme={{
          gemImage: '/custom/mines/rev-gem.png',
          cellImage: '/custom/mines/cell.svg',
        }}
      />
      <Web3GamesModals />
    </>
  );
};

export default MinesPage;
