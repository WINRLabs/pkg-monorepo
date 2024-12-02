'use client';

import { Web3GamesModals } from '@winrlabs/web3-games';
import dynamic from 'next/dynamic';

const WinrOfOlympus1000Game = dynamic(
  () => import('@winrlabs/web3-games').then((mod) => mod.WinrOfOlympus1000Game),
  {
    ssr: false,
  }
);
const CDN_URL = process.env.NEXT_PUBLIC_BASE_CDN_URL || '';

export default function WinrOfOlympus1000Page() {
  return (
    <>
      <WinrOfOlympus1000Game
        buildedGameUrl={`${CDN_URL}/winrlabs-games/winr-of-olympus-1000`}
        buildedGameUrlMobile={`${CDN_URL}/winrlabs-games/winr-of-olympus-1000`}
      />
      <Web3GamesModals />
    </>
  );
}
