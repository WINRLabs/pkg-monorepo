import { Address } from "viem";

export type Item<K extends string, T> = {
  type: K;
  data: T;
};

export interface GameProgram {
  cooldownFinish: number;
  joinningFinish: number;
  joinningStart: number;
  result: number;
  angle?: number;
}

export interface BetProgram {
  wager: bigint;
  converted: {
    wager: number;
    choice: number;
  };
  choice: 1 | 2 | 3 | 4;
}

export interface SessionContext {
  endblock: bigint;
  operator: string;
  player: string;
  price: bigint;
  program: string;
  startBlock: bigint;
  status: number;
  token: string;
}

export interface ReceiptContext {
  payin: bigint;
  payout: bigint;
  receipent: string;
  token: string;
  player: string;
}

export type RandomsContext = [bigint];

export interface MultiplayerGameMessage {
  context: {
    key: string;
    timestamp: number;
    type: string;
    version: number;
    context: [
      Item<"Session", SessionContext>,
      Item<"Receipt", ReceiptContext>,
      Item<"Randoms", RandomsContext>,
    ];
    program: [Item<"Game", GameProgram>, Item<"Bet", BetProgram>];
  };
  id: string;
  program: string;
  type: string;
  timestamp: number;
}

export interface Participant {
  // hex
  choice: Address;
  claimed: boolean;
  player: string;
  wager: bigint;
}

/**
 * Delievered when the game is active and new participants join(to the user, not broadcasted)
 */
export interface MultiplayerUpdateMessage {
  is_active: boolean;
  participants: Participant[];
  result: {
    joiningFinish: number;
    cooldownFinish: number;
    joiningStart: number;
    result: number;
  };
}
