'use client';

import { CoinFlipGame, LiveResults, Web3GamesModals } from '@winrlabs/web3-games';

export default function CoinFlipPage() {
  return (
    <>
      <CoinFlipGame
        options={{
          scene: {
            backgroundImage: 'url(/coin-flip/coin-flip-bg.png)',
          },
        }}
        minWager={0.01}
        maxWager={2000}
        onPlayerStatusUpdate={(d) => {
          console.log(d, 'DATA DATA DATA');
        }}
      />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
}
