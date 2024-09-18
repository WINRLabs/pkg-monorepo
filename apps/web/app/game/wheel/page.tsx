'use client';

import { LiveResults, Web3GamesModals, WheelGame } from '@winrlabs/web3-games';

export default function WheelPage() {
  return (
    <>
      <WheelGame
        theme={
          {
            // wheelBackground: '#000',
            // hideWager: true,
          }
        }
      />
      ;
      <Web3GamesModals />
    </>
  );
}
