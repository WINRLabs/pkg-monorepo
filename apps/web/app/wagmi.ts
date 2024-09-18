'use client';

import { defineChain } from 'viem';
import { http, createConfig, Config } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

export const winrChain = defineChain({
  id: 64165,
  name: 'Sonic Testnet',
  testnet: true,
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://p-rpc-eu.testnet.soniclabs.com'],
    },
    public: {
      http: ['https://p-rpc-eu.testnet.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://public-sonic.fantom.network',
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
    name: 'MetaMask',
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
    injected({
      shimDisconnect: false,
    }),
  ],

  ssr: false,

  transports: {
    [winrChain.id]: http(),
  },
}) as Config;
