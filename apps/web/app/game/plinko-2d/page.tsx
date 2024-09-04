'use client';

import { LiveResults, PlinkoGame, Web3GamesModals } from '@winrlabs/web3-games';

export default function PlinkoPage() {
  return (
    <>
      <PlinkoGame
        options={{
          scene: {
            backgroundImage: 'url(/plinko.png)',
          },
        }}
        minWager={0.1}
        maxWager={2000}
      />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
}
