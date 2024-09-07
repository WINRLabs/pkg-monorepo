'use client';

import { LiveResults, Web3GamesModals, WheelGame } from '@winrlabs/web3-games';

export default function WheelPage() {
  return (
    <>
      <WheelGame
        minWager={1}
        maxWager={1}
        theme={{
          wheelBackground: '#000',
        }}
      />
      ;
      <Web3GamesModals />
    </>
  );
}
