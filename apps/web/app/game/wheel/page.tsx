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
        }}
      />
      ;
      <Web3GamesModals />
    </>
  );
}
