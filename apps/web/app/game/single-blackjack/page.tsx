'use client';

import { SingleBlackjackGame, Web3GamesModals } from '@winrlabs/web3-games';

export default function SingleBlackjackPage() {
  return (
    <>
      <SingleBlackjackGame
        minWager={0.1}
        maxWager={2000}
        options={{}}
        theme={{
          cardBackBg: '/blackjack/card-back.svg',
          cardBg: '/blackjack/card-bg.png',
          cardFrontLogo: '/blackjack/card-logo.svg',
          cardDeck: '/blackjack/deck.svg  ',
          cardDeckDistributed: '/blackjack/distributed-deck.svg',
        }}
      />
      <Web3GamesModals />
    </>
  );
}
