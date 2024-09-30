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
          // tokenPrefix: '',
          controllerHeader: <div>Custom Header</div>,
          // controllerFooter: <div>Custom Footer</div>,
        }}
      />
      <Web3GamesModals />
    </>
  );
};

export default MinesPage;
