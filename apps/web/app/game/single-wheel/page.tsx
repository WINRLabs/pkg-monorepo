'use client';

import { Web3GamesModals, SingleWheelGame } from '@winrlabs/web3-games';

export default function WheelPage() {
  return (
    <>
      <SingleWheelGame
        minWager={1}
        maxWager={2000}
        theme={{
          controllerFooter: <div>Custom Footer</div>,
          // wheelBackground: '#000',
          hideWager: true,
          controllerHeader: <div>D</div>,
          hideMaxPayout: true,
          hideParticipants: true,
        }}
        hideBetHistory
      />
      <Web3GamesModals />
    </>
  );
}
