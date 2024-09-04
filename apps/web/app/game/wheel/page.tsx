'use client';

import { LiveResults, Web3GamesModals, WheelGame } from '@winrlabs/web3-games';

export default function WheelPage() {
  return (
    <>
      <WheelGame
        minWager={0.1}
        maxWager={2000}
        theme={{
          wheelBackground: '#000',
        }}
      />
      ;
      <Web3GamesModals />
    </>
  );
}
