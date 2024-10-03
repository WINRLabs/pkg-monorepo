import { SmartWalletConnectors } from '@winrlabs/web3';
import { defineChain } from 'viem';
import { http, createConfig, Config } from 'wagmi';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

export const winrChain = defineChain({
  id: 64165,
  name: 'Sonic Testnet',
  testnet: true,
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.soniclabs.com'],
    },
    public: {
      http: ['https://rpc.testnet.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://public-sonic.fantom.network',
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
