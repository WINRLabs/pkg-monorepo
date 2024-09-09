'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useCurrentAccount, useGameStrategy, useWeb3AuthAccount } from '@winrlabs/web3';
import React from 'react';
import { smartWalletConnectors } from './wagmi';
import debug from 'debug';

const log = debug('worker:App');

function App() {
  const account = useAccount();
  const currentAcc = useCurrentAccount();
  const { disconnect } = useDisconnect();
  const currentAA = useCurrentAccount();

  const { data } = useWeb3AuthAccount({
    currentConnectorName: account.connector?.name || '',
    smartWalletConnectors: smartWalletConnectors.connectors,
  });

  const { createStrategy } = useGameStrategy();

  log('account', account, currentAcc);

  /*   const currentConnector = smartWalletConnectors.connectors.find(
    (c) => c.loginProvider === account.connector?.name
  );

  React.useEffect(() => {
    if (!currentConnector) return;

    const getUserInfo = async () => {
      const res = await currentConnector?.web3AuthInstance?.getUserInfo();
    };

    getUserInfo();  
  }, [currentConnector]); */

  return (
    <>
      <div onClick={() => createStrategy()}>CREATE STRATEGY!</div>
    </>
  );
}

export default App;
