'use client';

import { SmartWalletConnectors } from '@winrlabs/web3';
import { defineChain } from 'viem';
import { Config, createConfig, http } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
export const WINR_CHAIN_ID_MAP = {
  mainnet: 777777,
  testnet: 66666666,
};

export const WINR_CHAIN_ID =
  process.env.NEXT_PUBLIC_NETWORK_MODE === 'testnet'
    ? WINR_CHAIN_ID_MAP.testnet
    : WINR_CHAIN_ID_MAP.mainnet;

export const winrChainParamsMap = {
  [WINR_CHAIN_ID_MAP.mainnet]: {
    blockExplorerUrls: ['https://explorer.winr.games'],
    chainName: 'WINR Chain',
    nativeCurrency: {
      decimals: 18,
      name: 'WINR',
      symbol: 'WINR',
    },
    rpcUrls: ['https://rpc.winr.games'],
  },
  [WINR_CHAIN_ID_MAP.testnet]: {
    blockExplorerUrls: ['https://explorer-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz'],
    chainName: 'WINR Chain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'WINR',
      symbol: 'WINR',
    },
    rpcUrls: ['https://rpc-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz'],
  },
};

export const winrChainParams = winrChainParamsMap[WINR_CHAIN_ID];

export const winrMainChain = defineChain({
  id: WINR_CHAIN_ID_MAP.mainnet,
  name: 'WINR Chain',
  network: 'winr',
  nativeCurrency: { name: 'WINR', symbol: 'WINR', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.winr.games'],
    },
    public: {
      http: ['https://rpc.winr.games'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'WINRscan',
      url: 'https://explorer.winr.games',
    },
    default: {
      name: 'WINRscan',
      url: 'https://explorer.winr.games',
    },
  },
});

export const winrChainTestnet = defineChain({
  id: WINR_CHAIN_ID_MAP.testnet,
  name: 'WINR Chain Testnet',
  network: 'winr',
  testnet: true,
  nativeCurrency: { name: 'WINR', symbol: 'WINR', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz'],
    },
    public: {
      http: ['https://rpc-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'WINRscan',
      url: 'https://explorer-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz',
    },
    default: {
      name: 'WINRscan',
      url: 'https://explorer-winrprotocoltestnet-wmwv59m23g.t.conduit.xyz',
    },
  },
});

export const winrChain =
  process.env.NEXT_PUBLIC_NETWORK_MODE === 'testnet' ? winrChainTestnet : winrMainChain;

export const smartWalletConnectors = new SmartWalletConnectors({
  chains: [winrChain],
  loginProviders: ['google', 'weibo', 'twitter', 'facebook', 'twitch', 'line', 'discord'],
  web3AuthOptions: {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
    web3AuthNetwork: (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || '') as any,
    sessionTime: 86400 * 7,
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

export const web3WalletConnectors: {
  name: string;
  connector: any;
  id: string;
  icon: string;
}[] = [
  {
    name: 'Metamask',
    icon: '/images/connectors/metamask.png',
    id: 'metaMask',
    connector: injected({
      target: 'metaMask',
      shimDisconnect: false,
    }),
  },
  {
    name: 'Trust Wallet Desktop',
    icon: '/images/connectors/trust-wallet.png',
    id: 'trustWallet',
    connector: injected({
      target: 'trustWallet',
      shimDisconnect: false,
    }),
  },

  {
    name: 'Coinbase',
    id: 'coinbase',
    icon: '/images/connectors/coinbase.png',
    connector: coinbaseWallet({ appName: 'Justbet' }),
  },
  {
    name: 'Wallet Connect',
    icon: '/images/connectors/walletconnect.png',
    id: 'walletConnect',
    connector: walletConnect({
      showQrModal: true,
      projectId: 'df813ab4d5b90931c591c84cc120d5aa',
    }),
  },
  {
    name: 'OKX Wallet',
    id: 'okxWallet',
    icon: '/images/connectors/okx-wallet.png',
    connector: injected({
      target: 'okxWallet',
      shimDisconnect: false,
    }),
  },
  {
    name: 'BitKeep Wallet',
    id: 'bitKeep',
    icon: '/images/connectors/bitkeep.png',
    connector: injected({
      target: 'bitKeep',
      shimDisconnect: false,
    }),
  },
  {
    name: 'Rabby',
    id: 'rabby',
    icon: '/images/connectors/rabby.svg',
    connector: injected({
      target: 'rabby',
      shimDisconnect: false,
    }),
  },

  {
    name: 'FoxWallet',
    icon: '/images/connectors/fox-wallet.png',
    id: 'foxWallet',
    connector: walletConnect({
      showQrModal: true,
      projectId: 'df813ab4d5b90931c591c84cc120d5aa',
      metadata: {
        name: 'jb-fox-wallet',
        description: '',
        icons: ['https://web3auth.io/images/w3a-L-Favicon-1.svg'],
        url: '',
      },
      qrModalOptions: {
        desktopWallets: [
          {
            id: 'c7708575a2c3c9e6a8ab493d56cdcc56748f03956051d021b8cd8d697d9a3fd2',
            links: {
              universal: 'https://apps.apple.com/app/foxwallet-crypto-web3/id1590983231',
              native: 'https://play.google.com/store/apps/details?id=com.foxwallet.play',
            },
            name: 'Fox Wallet',
          },
        ],
        mobileWallets: [
          {
            id: 'c7708575a2c3c9e6a8ab493d56cdcc56748f03956051d021b8cd8d697d9a3fd2',
            links: {
              universal: 'https://apps.apple.com/app/foxwallet-crypto-web3/id1590983231',
              native: 'https://play.google.com/store/apps/details?id=com.foxwallet.play',
            },
            name: 'Fox Wallet',
          },
        ],
      },
    }),
  },
];

export const config = createConfig({
  chains: [winrChain],
  connectors: [
    ...smartWalletConnectors.connectors.map(({ connector }) => connector),
    ...web3WalletConnectors.map(({ connector }) => connector),
  ],
  ssr: false,
  transports: {
    [winrChain.id]: http(),
  },
}) as Config;
