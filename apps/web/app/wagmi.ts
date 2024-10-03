import { SmartWalletConnectors } from '@winrlabs/web3';
import { defineChain } from 'viem';
import { http, createConfig, Config } from 'wagmi';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

const winrChain = defineChain({
  id: 777777,
  name: 'WINR Chain',
  network: 'winr',
  nativeCurrency: { name: 'WINR', symbol: 'WINR', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-winr-mainnet-0.t.conduit.xyz'],
    },
    public: {
      http: ['https://rpc-winr-mainnet-0.t.conduit.xyz'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'WINRscan',
      url: 'https://explorerl2new-winr-mainnet-0.t.conduit.xyz',
    },
    default: {
      name: 'WINRscan',
      url: 'https://explorerl2new-winr-mainnet-0.t.conduit.xyz',
    },
  },
});

export const smartWalletConnectors = new SmartWalletConnectors({
  chains: [winrChain],
  loginProviders: ['google', 'weibo', 'twitter', 'facebook', 'twitch', 'line', 'discord'],
  web3AuthOptions: {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
    web3AuthNetwork: (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || '') as any,
  },
  openLoginOptions: {
    adapterSettings: {
      uxMode: 'popup',
      network: (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || '') as any,
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
      whiteLabel: {
        appName: 'JIB',
        appUrl: 'https://justbet-aa.vercel.app/',
        logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
        defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
        theme: {
          primary: '#00B4FF',
        },
      },
    },
  },
});

export const config = createConfig({
  chains: [winrChain],
  connectors: [
    injected({
      shimDisconnect: false,
    }),

    ...smartWalletConnectors.connectors.map(({ connector }) => connector),
    coinbaseWallet({ appName: 'Create Wagmi' }),
  ],

  ssr: false,

  transports: {
    [winrChain.id]: http(),
  },
}) as Config;
