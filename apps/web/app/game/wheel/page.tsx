'use client';

import { LiveResults, Web3GamesModals, WheelGame } from '@winrlabs/web3-games';

export default function WheelPage() {
  return (
    <>
      <WheelGame
        minWager={1}
        maxWager={1}
        theme={{
          controllerFooter: <div>Custom Footer</div>,
          // wheelBackground: '#000',
          // hideWager: true,
          // controllerHeader: <div>D</div>,
          // hideMaxPayout: true,
          betControllerBackground: '#20202A',
        }}
      />
      ;
      <Web3GamesModals />
    </>
  );
}
