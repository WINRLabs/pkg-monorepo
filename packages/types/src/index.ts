import { Address } from 'viem';

export type PriceFeedVariable =
  | 'winr'
  | 'arb'
  | 'btc'
  | 'eth'
  | 'usdc'
  | 'weth'
  | 'sol'
  | 'usdt'
  | 'mck';

export interface Token {
  address: Address;
  bankrollIndex: Address;
  symbol: string;
  icon: string;
  decimals: number;
  displayDecimals: number;
  playable: boolean;
  priceKey: PriceFeedVariable;
}

export type BalanceMap = Record<Address, number>;
