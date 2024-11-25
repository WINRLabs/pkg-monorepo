import { Address } from 'viem';

export interface Token {
  address: Address;
  bankrollIndex: Address;
  symbol: string;
  icon: string;
  decimals: number;
  displayDecimals: number;
  playable: boolean;
  priceKey: string;
}

export type BalanceMap = Record<Address, number>;
