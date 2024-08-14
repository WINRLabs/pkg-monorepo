import { BlackjackGameResult, BlackjackHandStatus } from '@winrlabs/games';
import { Address } from 'viem';

export interface BlackjackContractGameStruct {
  wagerAmount: bigint;
  activeHandIndex: bigint;
  amountHands: number;
  canInsure: boolean;
  awaitingRandomness: boolean;
}

export interface BlackjackContractHand {
  cards: BlackjackContractCardStruct;
  hand: BlackjackContractHandStruct;
  splitHandIndex: bigint;
  handIndex: bigint;
}

export interface BlackjackContractCardStruct {
  cards: number[];
  amountCards: number;
  totalCount: number;
  isSoftHand: boolean;
  canSplit: boolean;
}

export interface BlackjackContractHandStruct {
  bankroll: Address;
  betAmount: bigint;
  chipsAmount: number;
  gameIndex: bigint;
  isDouble: boolean;
  isInsured: boolean;
  player: Address;
  status: BlackjackHandStatus;
}

export enum BJ_EVENT_TYPES {
  Created = 'Created',
  Settled = 'Settled',
  HitCard = 'HitCard',
  StandOff = 'StandOff',
  DoubleDown = 'DoubleDown',
  DealerCards = 'DealerCards',
  Split = 'Split',
  Insurance = 'Insurance',
}

export interface BlackjackSettledEvent {
  game: BlackjackContractGameStruct & {
    status: bigint;
  };
  gameIndex: number;
}

export interface BlackjackStandOffEvent {
  game: BlackjackContractGameStruct & {
    status: bigint;
  };
  gameIndex: number;
}

export interface BlackjackPlayerHandEvent {
  betAmount: bigint;
  chipsAmount: number;
  gameIndex: bigint;
  handIndex: number;
  isDouble: boolean;
  isInsured: boolean;
  status: BlackjackHandStatus;
}

export interface BlackjackPlayerCardsEvent {
  cards: BlackjackContractCardStruct;
  handIndex: number;
}

export interface BlackjackDealerCardsEvent {
  cards: BlackjackContractCardStruct;
  handIndex: number;
}

export interface BlackjackResultEvent {
  handIndexes: number[];
  hands: bigint[];
  payback: bigint;
  payout: bigint;
}
