'use client';

import {
  BundlerNetwork,
  controllerAbi,
  erc20Abi,
  fetchBundlerClient,
  SmartWalletConnectorWagmiType,
  useBundlerClient,
  useCreateSessionV2,
  useCurrentAccount,
  useProxyAccountTx,
} from '@winrlabs/web3';
import { Connector, useConnect, useConnectors, useSwitchChain } from 'wagmi';
import { config, WINR_CHAIN_ID, winrChainParams } from '../wagmi';
import { getWalletClient } from '@wagmi/core';
import { useQueryClient } from '@tanstack/react-query';
import { encodeAbiParameters, encodeFunctionData } from 'viem';
import { controllerAddress } from '../providers';
import { addresses } from '../../constants';

export default function SessionTest() {
  const { isPending, isSuccess, connectAsync, error, isError } = useConnect();

  const queryClient = useQueryClient();

  const createSessionV2 = useCreateSessionV2();

  const currentAccount = useCurrentAccount();

  const { switchChainAsync } = useSwitchChain();

  const connectors = useConnectors({
    config: config,
  });

  const web3Connectors = connectors.filter(
    (connector) => connector.type !== SmartWalletConnectorWagmiType
  );

  const handleConnect = async (connector: Connector) => {
    localStorage?.clear();

    const data = await connectAsync({ connector });

    localStorage['isConnected'] = true;

    try {
      await switchChainAsync({
        chainId: WINR_CHAIN_ID,
        connector,
        addEthereumChainParameter: winrChainParams,
      });
    } catch (e) {
      localStorage.clear();

      window.location.reload();

      return;
    }

    const bundlerClient = await fetchBundlerClient({
      network: BundlerNetwork.WINR,
      rpcUrl: 'https://dev.hubv2.winr.games/rpc',
      walletAddress: data.accounts[0],
    });

    const walletClient = await getWalletClient(config, {
      account: data.accounts[0],
      chainId: WINR_CHAIN_ID,
    });

    const { message, status } = await createSessionV2.mutateAsync({
      signerAddress: data.accounts[0],
      customWalletClient: walletClient,
      customClient: bundlerClient,
      pin: '123456',
    });

    queryClient.invalidateQueries({
      queryKey: ['currentUserAddress'],
    });
  };

  const sendTx = useProxyAccountTx({
    onSuccess: (data) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  return (
    <div className="wr-flex wr-flex-col wr-items-center wr-justify-center wr-h-screen">
      <button
        style={{
          background: 'red',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
        }}
        onClick={async () => {
          await createSessionV2.mutateAsync({
            signerAddress: currentAccount.rootAddress!,
            pin: '123456',
          });
        }}
      >
        Create Session
      </button>
      <button
        style={{
          background: 'red',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
        }}
        onClick={async () => {
          localStorage.clear();
        }}
      >
        logout
      </button>
      <button
        style={{
          background: 'red',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
        }}
        onClick={async () => {
          /* 
                const res = await account.sendTransaction({
      dest: CONTROLLER_ADDRESS,
      value: '0',
      data: encodeFunctionData({
        abi: Abis.chain('winr').abi.controller,
        functionName: 'perform',
        args: [COINFLIP_ADDRESS, BANKROLL_INDEX, OPERATOR, 'bet', encodedGameData]
      })
    });

    
 */

          console.log('cur acc', currentAccount.address);

          const OPERATOR = '0xe7503862f9eea03892dadcdcb73634de4fc4e31b';
          const BANKROLL_INDEX = '0x0000000000000000000000000000000000000001';
          const MOCK_TOKEN = '0xaF31A7E835fA24f13ae1e0be8EB1fb56F906BE11';

          console.log('init');

          /*    const bundlerClient = await fetchBundlerClient({
            network: BundlerNetwork.WINR,
            rpcUrl: 'http://dev.hubv2.winr.games/rpc',
            walletAddress: currentAccount.address!,
          });
 */
          /*           await sendTx.mutateAsync({
            target: MOCK_TOKEN,
            encodedTxData: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'mint',
              args: [currentAccount.address!, 100000000000000n],
            }),
          });

          console.log('minted');

          await sendTx.mutateAsync({
            target: MOCK_TOKEN,
            encodedTxData: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [addresses.winr.testnet.cashier!, 100000000000000n],
            }),
          });

          console.log('approve');
 */
          const encodedGameData = encodeAbiParameters(
            [
              { name: 'wager', type: 'uint128' },
              { name: 'stopGain', type: 'uint128' },
              { name: 'stopLoss', type: 'uint128' },
              { name: 'count', type: 'uint8' },
              { name: 'data', type: 'bytes' },
            ],
            [100000n, 0n, 0n, 1, encodeAbiParameters([{ name: 'bytes', type: 'uint8' }], [0])]
          );

          await sendTx.mutateAsync({
            target: controllerAddress,
            encodedTxData: encodeFunctionData({
              abi: controllerAbi,
              functionName: 'perform',

              args: [
                addresses.winr.testnet.coinFlip,
                BANKROLL_INDEX,
                OPERATOR,
                'bet',
                encodedGameData,
              ],
            }),
          });
        }}
      >
        play
      </button>
      <div>
        {web3Connectors.map((connector) => {
          return (
            <div key={connector.id} className="wr-flex wr-flex-col wr-gap-2">
              <button
                onClick={async () => {
                  await handleConnect(connector);
                }}
                type="button"
                style={{
                  background: 'blue',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                }}
              >
                {connector.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
