"use client";

import { WheelGame } from "@winrlabs/web3-games";

export default function WheelPage() {
  return <WheelGame minWager={0.1} maxWager={2000} options={{}} />;
}
