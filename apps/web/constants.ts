import { Address } from 'viem';
import { Token } from '@winrlabs/web3';

export type NetworkMode = 'mainnet' | 'testnet';

export type NetworkName = 'winr';

export const networkMode = process.env.NEXT_PUBLIC_NETWORK_MODE as NetworkMode;

export type AddressName =
  | 'coinFlip'
  | 'dice'
  | 'keno'
  | 'limbo'
  | 'plinko'
  | 'roll'
  | 'roulette'
  | 'rps'
  | 'winrBonanza'
  | 'uiOperator'
  | 'cashier'
  | 'controller'
  | 'entryPoint'
  | 'factory'
  | 'weth'
  | 'baccarat'
  | 'videoPoker'
  | 'mines'
  | 'wheel'
  | 'blackjack'
  | 'blackjackReader'
  | 'horseRace'
  | 'lock'
  | 'reward'
  | 'rewardReader'
  | 'badge'
  | 'crash'
  | 'rankMiddleware'
  | 'statisticsStore'
  | 'referral'
  | 'singleBlackjack'
  | 'singleBlackjackReader'
  | 'holdemPoker'
  | 'vauldAdapter'
  | 'shareToken'
  | 'liquidityManager'
  | 'bankrollVault'
  | 'paymaster'
  | 'rewardConditional'
  | 'rewardConditionalRouter'
  | 'rewardConditionalLottery'
  | 'winrOfOlympus'
  | 'winrOfOlympus1000'
  | 'princessWinr'
  | 'singleWheel'
  | 'cashback'
  | 'strategyStore'
  | 'degensCashier'
  | 'degensController'
  | 'degensReader'
  | 'yakRouter'
  | 'winrBonanza1000';

export const addresses: Record<NetworkName, Record<NetworkMode, Record<AddressName, Address>>> = {
  winr: {
    mainnet: {
      coinFlip: '0xD06009Eab10560024f27A426EA4dA168F1FC7783',
      dice: '0x4F7f224188D7c36e27B8Fc0a6F4fce3a8FD7494A',
      keno: '0x4bA566a94862324b60E2A28CC566ba6ff44558b9',
      limbo: '0x661c11C8c15E654A4a7536a74e327e717978FFd7',
      plinko: '0xc2Cc383f2A3116e3357Ed12C654095928c4d8fdC',
      roll: '0x590eC41C5e4024B0150699fCA1C94B9906D0409A',
      roulette: '0xEe170b325D28957CbAFA78dBA082bfA8DD22a7C3',
      rps: '0xa3dfE3DDD4d5b3077fa5065c32AA655E0C83725c',
      uiOperator: '0xe7503862f9eea03892dadcdcb73634de4fc4e31b',
      cashier: '0x8c2bF4A5Cd4872b01401b7be146e7eB7f555976D',
      controller: '0x6e22145022750e182F6bCb5C3fBBE74D30A20C99',
      rankMiddleware: '0xdaa44b9CE9e73ae4672397077f17c3358b2e4647',
      entryPoint: '0x4E1e998d1F1E1303bA33a0Faae64f452c43fBE81',
      factory: '0x94C7e000B746ee0B8bdAde728E3949d06448a777',
      baccarat: '0x299AA6351567b9801CBE1DfcE0c0dd7Ba0D927BA',
      winrBonanza: '0x192b4d6050CA4440ca446C78d04c0E761E30f1e5',
      weth: '0xE60256921AE414D7B35d6e881e47931f45E027cf',
      referral: '0x2426a1982caE9703358E642f5E16E26f6627154b',
      videoPoker: '0x3BebE23E2AD5487bB7A7510B5360246b209756eb',
      mines: '0x96C90916c0f885fe0BD6DACF8A2c7b3621ECbfDe',
      wheel: '0x81c90B1fdeA0ab89cD51a3e263459B6eFCE65B89',
      blackjack: '0x4B67eDd66F05691fB7ad15309892Ee87518369D7',
      blackjackReader: '0x64E5b83a81A788C75b1E2BE743595439fB2aa2EF',
      horseRace: '0x23fc42540699CEC04Ead05c88FaaD1f41F6d0a91',
      lock: '0x7f3E35B41BDF7DBA6a90661918d0EfDDC6C15c3C',
      reward: '0x50BE4061dc1b183aee4C5D218Ac7F74A284E6489',
      rewardReader: '0x8554790537F45FD47FD2B177D6c72Ad46eD2c541',
      badge: '0x34Ccc96436637e18a02c05D794C92952a82f3A50',
      crash: '0x2b5F8c643509d7703350327b963729F479b85196',
      statisticsStore: '0x7860CdDdB6027EffD09811e56D9E5737023805a3',
      singleBlackjack: '0xf6CEf9009596902188017524Dd925A345269Bfc2',
      singleBlackjackReader: '0x14697663dC537e13ff90440fc134E843FFd610ec',
      holdemPoker: '0x396E93313D48f5656CE87EC744F4650f979fE09d',
      vauldAdapter: '0xc942b79E51fe075c9D8d2c7501A596b4430b9Dd7',
      shareToken: '0x077133aad44affca628aFf96f8cFFf2483759928',
      liquidityManager: '0xa1EFEaaF8C2D05168188fe01daad0BF220F0FC40',
      bankrollVault: '0x626FD796d45b6e0af7fe6265f4162065514E9eB7',
      paymaster: '0x37C6F569A0d68C8381Eb501b79F501aDc132c144',
      rewardConditional: '0xd525BaE6de08D1f65BE9CB4C09b8b6AD91ecCADD',
      rewardConditionalRouter: '0x860dec012b577C7fF62b6899581581CB4089AAf7',
      rewardConditionalLottery: '0x8d8Dd780dFa7413ac33aFc79053e4b6ad0c689dc',
      winrOfOlympus: '0x51a7845AC638e4CF01999fD8014e63d0234744A4',
      winrOfOlympus1000: '0x6b5daf3b492Df4DD89734f95217e8506aFe29d49',
      princessWinr: '0xd782D71551FEC8E4e87656559cDDd7c414c00D43',
      cashback: '0xe36D7aFAc9e9B9a3aA2f93CD1625dB3A82c15aFb',
      singleWheel: '0x',
      degensCashier: '0x8A7bcB0F02bb72282bf76a6E0E8692048d344342',
      degensController: '0x7b654aEddAD827b9E82850F37619Ee1099A308C7',
      degensReader: '0x947146d9e368AF09C160d5c043779dB798dC488b',
      strategyStore: '0x662fb4d9b5d8eaf280af00c2fe8b02f8e5a86e80',
      yakRouter: '0x2b59Eb03865D18d8B62a5956BBbFaE352fc1C148',
      winrBonanza1000: '0x1f4Dc8Cd50a62F9eC214c3D0448aF9a2629888DA',
    },
    testnet: {
      coinFlip: '0xFe58e81619913D223B371460543bEf8044a23bA1',
      dice: '0xAB75C11b28bE047f224e30a846eAE6FBFA0736E2',
      keno: '0x197ce281ddC3659432c7208f4c2eBc514b4aDD94',
      limbo: '0x27e0D79fc15Af62cd2Cb3A62D883357F9aE1ab74',
      plinko: '0xfdC6D922bDF62920E7561b2686b4f43DD7c1ae22',
      roll: '0x199adB4054dDF31fFf6D7124F5191A43FC412D11',
      roulette: '0x392086958a2A04f876dca7b9C0A89C0Aaac247EF',
      rps: '0x25dCba516515f0edc9c19Ec0460a34d5D4c92E40',
      uiOperator: '0xe7503862f9eea03892dadcdcb73634de4fc4e31b',
      cashier: '0x9de35dB710241BCe0808C1aa45D21e89209c5Ea3',
      controller: '0x9ec95EF997a389e4aD7ab30EC2268eDf955Afc1A',
      rankMiddleware: '0x908494a89E52DE141f1B8d172CA6241671b058e4',
      entryPoint: '0x4E1e998d1F1E1303bA33a0Faae64f452c43fBE81',
      factory: '0x94C7e000B746ee0B8bdAde728E3949d06448a777',
      baccarat: '0x3df13bF4e9a42b3820b0d797A1615E2e2bb42922',
      winrBonanza: '0x6eA227216B4e127Bc994814F4ba232fD8BE5291e',
      weth: '0x20Bc56F6476d92AF81a7152cc7a6bdD69fB2ef51',
      referral: '0xB8bEF8087399b37077d0Ab91656df4762eC6D89e',
      videoPoker: '0x1776623B60dE6A4285e87aEE6624bF21eD7a0755',
      mines: '0x6393b0C2B2AAc4B3A9f63AFa39A0C48De3Af4787',
      wheel: '0x7f6A7A49e4E8DaC121dC6462a9c6df44cd159bd9',
      blackjack: '0xB237b394E7D45E1F1745d4ae9203af63792488C8',
      blackjackReader: '0x8455C5a1B1E87eFBEaE0c9f6aBcAf1E9CaE36cbb',
      horseRace: '0x702b74Ddf18cCA524b9A83cf2479adc7669b32cd',
      lock: '0x751C265c17B657E088D74219c5DA772fcFeDBB74',
      reward: '0x49BAD2394FD68AB3C4A5101714DA2B5702EA3c78',
      rewardReader: '0x527E1e026EA397352751532b2c750D06C4Af016b',
      badge: '0x6a83b86408BcE0b1Da2aD9002dc92BEa8d692106',
      crash: '0x244f93a14aF725917BbB5bF773619a564799655e',
      statisticsStore: '0x458519b7e9b5305563D8917Bd25A8F33b8a44b92',
      singleBlackjack: '0x761aE7922E04E87b8f5FC3B5E50f27Cd253DE876',
      singleBlackjackReader: '0xFa510900690cEb60ccb3Bc3d252aA5Df37e3bcAE',
      holdemPoker: '0xa1c7c966f95eD6D095d270D2A8705748F898266D',
      vauldAdapter: '0xe0cE5959E7e9e9c8C84c691C05D252C4e5D78E65',
      shareToken: '0xA8F8Fd159de64cC0232a30634313ad31AE1b4C5f',
      liquidityManager: '0xA2eE1174c91DA23CcC7a538d0D8c3b7763255447',
      bankrollVault: '0xeC2c407aab319FDE15EE680DE08F9aa365Ef7949',
      paymaster: '0x37C6F569A0d68C8381Eb501b79F501aDc132c144',
      rewardConditional: '0xa47F665eEf9bb4805A49A6b2eB1dfA15f4F0FEDF',
      rewardConditionalRouter: '0x860dec012b577C7fF62b6899581581CB4089AAf7',
      rewardConditionalLottery: '0x8d8Dd780dFa7413ac33aFc79053e4b6ad0c689dc',
      winrOfOlympus: '0x202FC30Bb176E51DC647D65BE920036c92dA8d7a',
      winrOfOlympus1000: '0x6B8F757Ab62B8898B2154Fd393AeaD42416f4B01',
      princessWinr: '0x523CD40dfCA129E47BB57e6d349272dEF6742576',
      cashback: '0xe36D7aFAc9e9B9a3aA2f93CD1625dB3A82c15aFb',
      degensCashier: '0xda9f11B4c295C5Cfe9331e4f71E73E1A5df2d081',
      degensController: '0x42772D2f6F5eDA04a4b16C5e8150aB40F14edbF6',
      singleWheel: '0x',
      degensReader: '0xcEEeEe35d916408D2F7fA11449e993a939b0b8E1',
      strategyStore: '0xa1a1779BBa12CBa48192b5F8676c3239fa96Bd74',
      yakRouter: '0x2b59Eb03865D18d8B62a5956BBbFaE352fc1C148',
      winrBonanza1000: '0xa9Efc937E81DaBBb6aad8fCA613e882E63EC0E40',
    },
  },
};

export const getAllAddresses = (networkMode: NetworkMode) => {
  return addresses.winr[networkMode];
};

export const allAddresses = getAllAddresses(networkMode);

export type AppToken = Token & {
  pairToken: string;
  priceKey: string;
};

export const MOCK_BANKROLL_INDEX = '0x0000000000000000000000000000000000000007';

export const MOCK_LP_ADDRESS = '0x8daFa39a80BdCe2948f8e35a1430878A61B64784';

const mainnetTokens: AppToken[] = [
  {
    address: '0xF2857668777135E22f8CD53C97aBf8821b7F0bdf',
    bankrollIndex: '0x0000000000000000000000000000000000000005',
    displayDecimals: 6,
    decimals: 18,
    icon: '/images/tokens/arb.png',
    symbol: 'ARB',
    playable: true,
    pairToken: 'ARB-LP',
    priceKey: 'arb',
  },

  {
    address: '0x59edbB343991D30f77dcdBad94003777e9B09BA9',
    bankrollIndex: '0x0000000000000000000000000000000000000001',
    displayDecimals: 2,
    decimals: 6,
    icon: '/images/tokens/usdc.png',
    symbol: 'USDC',
    playable: true,
    pairToken: 'USDC-LP',
    priceKey: 'usdc',
  },
  {
    address: '0x0381132632E9E27A8f37F1bc56bd5a62d21a382B',
    bankrollIndex: '0x0000000000000000000000000000000000000002',
    displayDecimals: 2,
    decimals: 6,
    icon: '/images/tokens/usdt.png',
    symbol: 'USDT',
    playable: true,
    pairToken: 'USDT-LP',
    priceKey: 'usdt',
  },
  /* {
      address: "0x44BD533C211C78e01f0F738826e8b18Bb9b936f5",
      bankrollIndex: "0x0000000000000000000000000000000000000003",
      displayDecimals: 6,
      decimals: 8,
      icon: "/images/tokens/wbtc.png",
      symbol: "BTC",
      playable: true,
      pairToken: "BTC-LP",
      priceKey: "btc",
    }, */
  {
    address: '0xE60256921AE414D7B35d6e881e47931f45E027cf',
    bankrollIndex: '0x0000000000000000000000000000000000000004',
    displayDecimals: 6,
    decimals: 18,
    icon: '/images/tokens/eth.png',
    symbol: 'ETH',
    playable: true,
    pairToken: 'ETH-LP',
    priceKey: 'eth',
  },

  {
    address: '0xBF6FA9d2BF9f681E7b6521b49Cf8ecCF9ad8d31d',
    bankrollIndex: '0x0000000000000000000000000000000000000006',
    displayDecimals: 2,
    decimals: 18,
    icon: '/images/tokens/winr.png',
    symbol: 'WINR',
    playable: true,
    priceKey: 'winr',
    pairToken: 'WINR-LP',
  },
  {
    address: '0x372B5997502E668B8804D11d1569eB28F51a7e4e',
    bankrollIndex: MOCK_BANKROLL_INDEX,
    displayDecimals: 2,
    decimals: 18,
    icon: '/images/tokens/usdt.png',
    symbol: 'MCK',
    playable: true,
    pairToken: 'MCK-LP',
    priceKey: 'usdt',
  },
  /* {
    address: "0x80ff76cc453C6d8C52092Bdd8b69144DCd64fE73",
    bankrollIndex: "0x0000000000000000000000000000000000000009",
    displayDecimals: 2,
    decimals: 18,
    icon: "/images/tokens/boop.png",
    symbol: "BOOP",
    playable: true,
    pairToken: "BOOP-LP",
    priceKey: "boop",
  },
  {
    address: "0x503C33E8074A579F5d607BA8a36aE54A6cC6F1A9",
    bankrollIndex: "0x0000000000000000000000000000000000000013",
    displayDecimals: 2,
    decimals: 8,
    icon: "/images/tokens/spx.png",
    symbol: "SPX",
    playable: true,
    pairToken: "SPX-LP",
    priceKey: "spx",
  }, */
  {
    address: '0xA817eeb2e2e6830521595272464399b7Ace58586',
    bankrollIndex: '0x000000000000000000000000000000000000000E',
    displayDecimals: 2,
    decimals: 18,
    icon: '/images/tokens/brett.png',
    symbol: 'BRETT',
    playable: true,
    pairToken: 'BRETT-LP',
    priceKey: 'winr',
  },
  // {
  //   address: "0x3A3e8F73C51B5AE1697587058f0C1Da0D3a37024",
  //   bankrollIndex: "0x000000000000000000000000000000000000000D",
  //   displayDecimals: 2,
  //   decimals: 18,
  //   icon: "/images/tokens/toshi.png",
  //   symbol: "TOSHI",
  //   playable: true,
  //   pairToken: "TOSHI-LP",
  //   priceKey: "toshi",
  // },
];

const testnetTokens: AppToken[] = [
  {
    address: '0xaF31A7E835fA24f13ae1e0be8EB1fb56F906BE11',
    bankrollIndex: '0x0000000000000000000000000000000000000001',
    displayDecimals: 2,
    decimals: 6,
    icon: '/images/tokens/usdc.png',
    symbol: 'USDC',
    playable: true,
    pairToken: 'USDC-LP',
    priceKey: 'usdc',
  },
  {
    address: '0xd777657B9a81a4E869458d52402e16C0dE187e3a',
    bankrollIndex: '0x0000000000000000000000000000000000000002',
    displayDecimals: 2,
    decimals: 6,
    icon: '/images/tokens/usdt.png',
    symbol: 'USDT',
    playable: true,
    pairToken: 'USDT-LP',
    priceKey: 'usdt',
  },
];

export const appTokens: AppToken[] =
  process.env.NEXT_PUBLIC_NETWORK_MODE === 'mainnet' ? mainnetTokens : testnetTokens;

export const defaultSelectedToken: AppToken = {
  address: '0xaF31A7E835fA24f13ae1e0be8EB1fb56F906BE11',
  bankrollIndex: '0x0000000000000000000000000000000000000001',
  displayDecimals: 2,
  decimals: 6,
  icon: '/images/tokens/usdc.png',
  symbol: 'USDC',
  playable: true,
  pairToken: 'USDC-LP',
  priceKey: 'usdc',
};
