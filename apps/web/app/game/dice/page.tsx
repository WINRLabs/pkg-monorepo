'use client';

import { DiceGame, LiveResults, Web3GamesModals } from '@winrlabs/web3-games';

export default function DicePage() {
  return (
    <>
      <DiceGame
        options={
          {
            // slider: {
            //   track: {
            //     activeColor: 'red',
            //     color: 'blue',
            //   },
            // },
            // scene: {
            //   background: 'blue',
            // },
          }
        }
        minWager={0.001}
        maxWager={2000}
      />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
}
