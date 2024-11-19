'use client';

import { BlackjackGame, LiveResults, Web3GamesModals } from '@winrlabs/web3-games';

export default function BlackjackPage() {
  return (
    <>
      <BlackjackGame
        minWager={0.1}
        maxWager={2000}
        options={{}}
        theme={{
          deck: '/blackjack/deck.svg  ',
          distributedDeck: '/blackjack/distributed-deck.svg',
          cardBack: '/blackjack/card-back.svg',
          cardBg: '/blackjack/card-bg.png',
          cardFrontLogo: '/blackjack/card-logo.svg',
        }}
      />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
}
