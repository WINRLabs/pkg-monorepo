'use client';

import { VideoPokerGame, Web3GamesModals } from '@winrlabs/web3-games';

export default function VideoPokerPage() {
  return (
    <>
      <VideoPokerGame
        minWager={0.1}
        maxWager={2000}
        theme={{
          cardFrontLogo: '/video-poker/card-front-logo.png',
          cardStackImage: '/video-poker/card-stack.png',
          cardBack: '/baccarat/card-back.svg',
        }}
      />
      <Web3GamesModals />
    </>
  );
}
