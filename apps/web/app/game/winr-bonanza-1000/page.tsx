'use client';

import { Web3GamesModals } from '@winrlabs/web3-games';
import dynamic from 'next/dynamic';

const WinrBonanza1000TemplateWithWeb3 = dynamic(
  () => import('@winrlabs/web3-games').then((mod) => mod.WinrBonanza1000Game),
  {
    ssr: false,
  }
);
const CDN_URL = process.env.NEXT_PUBLIC_BASE_CDN_URL || '';

export default function WinrBonanza1000Page() {
  // randomNumber
  // weights -> getNormalSpinWeights
  // reel -> [30 tane 0]
  // remaining -> [6 tane 0]
  // payoutMultiplier -> 0
  // turn -> 0
  // const currentAccount = useCurrentAccount();

  // const weights = useReadContract({
  //   abi: winrBonanzaAbi,
  //   address: gameAddresses.winrBonanza as Address,
  //   functionName: "getFreeSpinWeights",
  //   query: {
  //     enabled: !!currentAccount.address,
  //   },
  // });

  // const processReel = useSimulateContract({
  //   abi: winrBonanzaAbi,
  //   address: gameAddresses.winrBonanza,
  //   functionName: "processReel",
  //   args: [
  //     23339420843743143812130653703302680670800799276278444700942258930637855850320n,
  //     weights.data as any,
  //     new Array(30).fill(0) as any,
  //     new Array(6).fill(0) as any,
  //     0,
  //     0,
  //   ],
  //   query: {
  //     enabled: !!weights.data,
  //   },
  // });

  return (
    <>
      <WinrBonanza1000TemplateWithWeb3
        buildedGameUrl={`${CDN_URL}/winrlabs-games/winr-bonanza-1000`}
        buildedGameUrlMobile={`${CDN_URL}/winrlabs-games/winr-bonanza-1000`}
      />
      <Web3GamesModals />
    </>
  );
}
