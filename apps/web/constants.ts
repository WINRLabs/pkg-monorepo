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
  | 'princessWinr'
  | 'singleWheel'
  | 'strategyStore';

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
      baccarat: '0x4A4Ef45981E9456fA75514A073Af90684C006a73',
      winrBonanza: '0x192b4d6050CA4440ca446C78d04c0E761E30f1e5',
      weth: '0xE60256921AE414D7B35d6e881e47931f45E027cf',
      referral: '0x2426a1982caE9703358E642f5E16E26f6627154b',
      videoPoker: '0x3BebE23E2AD5487bB7A7510B5360246b209756eb',
      mines: '0x96C90916c0f885fe0BD6DACF8A2c7b3621ECbfDe',
      wheel: '0xf900b9988dD54c7c56C5EaFcc624970CB9b9FA20',
      blackjack: '0x41c5d9520CEDd228194A833EFA12Af65f4e805a3',
      blackjackReader: '0x4e05b4dfE37A0Ee9235FBe59e09c0ad21d0ADd88',
      horseRace: '0x5039F4E81f8e837186b75aE7b78eD3A892C5d662',
      lock: '0x7f3E35B41BDF7DBA6a90661918d0EfDDC6C15c3C',
      reward: '0xd1347D49277B93dc3A1a041aCC15Fd7b9271dF44',
      rewardReader: '0xaC779242cceb05ae58ab2235a74BC1Aac333352e',
      badge: '0x34Ccc96436637e18a02c05D794C92952a82f3A50',
      crash: '0x377aE1A2423227767E92A587C26485f998Db2a1D',
      statisticsStore: '0x7860CdDdB6027EffD09811e56D9E5737023805a3',
      singleBlackjack: '0xae3f49B40B766E34CB884036766422e9182B0c42',
      singleBlackjackReader: '0x76aB38878B56F15d6C1fd8F2DF5114596BC9DfE2',
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
      princessWinr: '0xd782D71551FEC8E4e87656559cDDd7c414c00D43',
      singleWheel: '0x',
      strategyStore: '0x890C99909E04253ff826A714fe1Ca58d36b11F1F',
    },
    testnet: {
      coinFlip: '0x46214AE77915631c804be51F3f547588Cd217141',
      dice: '0xc7C87537a11828fcae3e29828ddce1bF04302506',
      keno: '0x7A70c949848f1828189b3F0391255DA49D6D3657',
      limbo: '0x55e93E56A734FD161a2909372cEB91DBB1b52cB0',
      plinko: '0x0F2C23E08982a3351Bd7b457f19da147f1DF111b',
      roll: '0x95b2a6fc4C5f22e512605f3a0F4470f7F42a16d3',
      roulette: '0xfEcB6cAd4771d92EDCd3d1CE9aDCf0fcC32A1F28',
      rps: '0xdAE96752470c9De8Ef7084d8cc84dAAeFA7F71F4',
      uiOperator: '0xe7503862f9eea03892dadcdcb73634de4fc4e31b',
      cashier: '0x9de35dB710241BCe0808C1aa45D21e89209c5Ea3',
      controller: '0x056D67F215611E94C246705d4c0BB5bdD6C7e83F',
      rankMiddleware: '0x908494a89E52DE141f1B8d172CA6241671b058e4',
      entryPoint: '0x4E1e998d1F1E1303bA33a0Faae64f452c43fBE81',
      factory: '0x94C7e000B746ee0B8bdAde728E3949d06448a777',
      baccarat: '0x8f2F9b8763F1a8b5dD8Ae53b71BC4F9123A58639',
      winrBonanza: '0xC7b17a99E666418B4fd6FC5546Cb8157D73B234f',
      weth: '0x20Bc56F6476d92AF81a7152cc7a6bdD69fB2ef51',
      referral: '0xB8bEF8087399b37077d0Ab91656df4762eC6D89e',
      videoPoker: '0x0a03544486C65edf233a5Ff7cB3a5612F7C90F98',
      mines: '0x1c18044dBF24c325A2A809B598C6257B1267FDa7',
      wheel: '0x23c83E139543D4DfC6cE9af9DA567e72d457fB2a',
      blackjack: '0xa08A8430D8BcfB4e3a33d76175E7Af12972673A2',
      blackjackReader: '0x42CFF3ea4C60ADaf2Def55E2Dd207bDc56faEca0',
      horseRace: '0x70db72cA71c33Cf46aa9cE7eF60e1a3Dd23Bf815',
      lock: '0x751C265c17B657E088D74219c5DA772fcFeDBB74',
      reward: '0xeDb72675695358fa4F8Da8ce2F7c8C211B0095fB',
      rewardReader: '0xCBb813eDc2bD3eA3f2c4083B9259340CD04f24e8',
      badge: '0x6a83b86408BcE0b1Da2aD9002dc92BEa8d692106',
      crash: '0xe9da301339C0ed3d3727A9f3c3e69bC09Af73202',
      statisticsStore: '0x458519b7e9b5305563D8917Bd25A8F33b8a44b92',
      singleBlackjack: '0xb87278DeA41772FEC560aDD06221e209BD11aAb2',
      singleBlackjackReader: '0x23926Fe1eA6149854Da3a58CeDA4aC2ff7c7434C',
      holdemPoker: '0x2B0165498cAf39Bad5Bc508502CB26e2F40F4Df0',
      vauldAdapter: '0xe0cE5959E7e9e9c8C84c691C05D252C4e5D78E65',
      shareToken: '0xA8F8Fd159de64cC0232a30634313ad31AE1b4C5f',
      liquidityManager: '0xA2eE1174c91DA23CcC7a538d0D8c3b7763255447',
      bankrollVault: '0xeC2c407aab319FDE15EE680DE08F9aa365Ef7949',
      paymaster: '0x37C6F569A0d68C8381Eb501b79F501aDc132c144',
      rewardConditional: '0xa47F665eEf9bb4805A49A6b2eB1dfA15f4F0FEDF',
      rewardConditionalRouter: '0x860dec012b577C7fF62b6899581581CB4089AAf7',
      rewardConditionalLottery: '0x8d8Dd780dFa7413ac33aFc79053e4b6ad0c689dc',
      winrOfOlympus: '0xFA66633EA0F06740afc96eB2d68822dF230a964D',
      princessWinr: '0x75f9D513080118E289dF48Ddf1F2722971191874',
      singleWheel: '0x',
      strategyStore: '0x890C99909E04253ff826A714fe1Ca58d36b11F1F',
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
