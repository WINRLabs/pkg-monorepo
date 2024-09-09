'use client';

import { DiceGame, LiveResults, Web3GamesModals } from '@winrlabs/web3-games';

export default function DicePage() {
  return (
    <>
      <DiceGame options={{}} minWager={0.1} maxWager={2000} />
      <LiveResults />
      <Web3GamesModals />
    </>
  );
}
