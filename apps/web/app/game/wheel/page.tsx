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
            // controllerHeader: <div>D</div>,
            // hideMaxPayout: true,
          }
        }
      />
      ;
      <Web3GamesModals />
    </>
  );
}
