'use client';

import { BaccaratGame, Web3GamesModals } from '@winrlabs/web3-games';
import React from 'react';

export default function BaccaratPage() {
  return (
    <>
      <BaccaratGame
        minWager={0.1}
        maxWager={2000}
        theme={{
          cardBackImage: '/baccarat/card-back.svg',
          idleCardImage: '/baccarat/idle-card.png',
          cardFrontLogoImage: '/baccarat/sx-logo.svg',
        }}
      />
      <Web3GamesModals />
    </>
  );
}
