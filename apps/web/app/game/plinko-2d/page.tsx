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
          // hideWager: true,
          // disableStrategy: true,
          // maxPayout: {
          //   icon: '/custom/mines/rev-gem.png',
          // },
          // controllerHeader: <div>Plinko 2D</div>,
          // // hideTabs: true,
          // hideTotalWagerInfo: true,
          // hideWager: true,
          // tokenPrefix: '',
          // showBetCount: true,
          // rowMultipliers: {
          //   6: [12, 1.5, 1, 0, 1, 1.5, 12],
          //   7: [18, 3, 1, 0, 0, 1, 3, 18],
          //   8: [24, 6, 1.5, 1, 0, 1, 1.5, 6, 24],
          //   9: [50, 10, 1.5, 1, 0, 0, 1, 1.5, 10, 50],
          //   10: [55, 12, 3, 1.5, 1, 0, 1, 1.5, 3, 12, 55],
          //   11: [70, 20, 6, 1.5, 1, 0, 0, 1, 1.5, 6, 20, 70],
          //   12: [90, 22, 4, 2, 0, 0, 0, 0, 0, 2, 4, 22, 90],
          // },
        }}
        minWager={0.1}
        maxWager={2000}
      />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
}
