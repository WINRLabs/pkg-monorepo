import { BalanceMap, Token } from '@winrlabs/types';

export enum BlackjackHandIndex {
  FIRST,
  SECOND,
  THIRD,
  SPLITTED_FIRST,
  SPLITTED_SECOND,
  SPLITTED_THIRD,
  DEALER,
}

export type Hand = {
  chipsAmount: number;
  isInsured: boolean;
  status: BlackjackHandStatus;
  isDouble: boolean;
  isSplitted: boolean;
  splittedHandIndex: null | number;
};

export type GameStruct = {
  activeHandIndex: number;
  canInsure: boolean;
  status: BlackjackGameStatus;
  payout?: number;
  payback?: number;
};

export type Cards = {
  amountCards: number;
  cards: number[];
  totalCount: number;
  isSoftHand: boolean;
  canSplit: boolean;
};

export type ActiveGameHands = Record<
  | 'dealer'
  | 'firstHand'
  | 'secondHand'
  | 'thirdHand'
  | 'splittedFirstHand'
  | 'splittedSecondHand'
  | 'splittedThirdHand',
  {
    cards: Cards | null;
    hand: Hand | null;
    gameResult?: boolean;
    handId?: number;
    settledResult?: {
      result?: BlackjackGameResult;
    };
  }
>;

export enum BlackjackGameResult {
  DEALER_BLACKJACK_HAND_PUSH = 0,
  DEALER_BLACKJACK_PLAYER_LOST,
  DEALER_BLACKJACK_PLAYER_INSURED,
  DEALER_BUST_PLAYER_LOST,
  DEALER_BUST_PLAYER_WIN,
  DEALER_BUST_PLAYER_BLACKJACK,
  DEALER_STAND_HAND_PUSH,
  DEALER_STAND_PLAYER_WIN,
  DEALER_STAND_PLAYER_LOST,
}

export enum BlackjackGameStatus {
  NONE, // 0
  TABLE_DEAL, // 1
  PLAYER_TURN, // 2
  DEALER_TURN, // 3
  FINISHED, // 4
}

export enum BlackjackHandStatus {
  NONE,
  PLAYING, // 1
  AWAITING_HIT, // 2
  STAND, // 3
  BUST, // 4
  BLACKJACK, // 5
}

export interface BlackjackFormFields {
  wager: number;
  firstHandWager: number;
  secondHandWager: number;
  thirdHandWager: number;
  handIndex: number;
}

export interface BlackjackGameProps {
  activeGameData: GameStruct;
  activeGameHands: ActiveGameHands;
  isControllerDisabled?: boolean;
  initialDataFetched: boolean;
  currencyList: Token[];
  selectedCurrency: Token;
  balances: BalanceMap;
  onChangeCurrency: (token: Token) => void;

  onGameCompleted: () => void;
  onDeal: (firstHandWager: number, secondHandWager: number, thirdHandWager: number) => void;
  onReset: () => void;
  onHit: (handIndex: number) => void;
  onSplit: (handIndex: number) => void;
  onDoubleDown: (handIndex: number) => void;
  onInsure: (handIndex: number) => void;
  onStand: (handIndex: number) => void;
  onFormChange?: (f: BlackjackFormFields) => void;
}
