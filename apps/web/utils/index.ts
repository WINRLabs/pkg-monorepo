import { parseUnits } from 'viem';
import SuperJSON from 'superjson';
import { Address, Hex } from 'viem';
import { toDecimals } from '@winrlabs/games';
import { EventLogic } from '@winrlabs/web3';

export enum GAME_HUB_GAMES {
  rps = 'rps',
  dice = 'dice',
  keno = 'keno',
  slot = 'slot',
  limbo = 'limbo',
  mines = 'mines',
  range = 'range',
  plinko = 'plinko',
  roulette = 'roulette',
  coin_flip = 'coin_flip',
  baccarat = 'baccarat',
  black_jack = 'black_jack',
  video_poker = 'video_poker',
  wheel = 'wheel',
  moon = 'moon',
  horse_race = 'horse_race',
}

export type GameHubCurrency = {
  name: string;
  decimal: number;
  address: Address;
  lastPrice: number;
};

export enum GAME_HUB_EVENT_TYPES {
  Dealt = 'Dealt',
  Reveal = 'Reveal',
  Resolve = 'Resolve',
  Settled = 'Settled',
  Created = 'Created',
  Finalized = 'Finalized',
  Finishing = 'Finishing',
  HandFinalized = 'HandFinalized',
  RevealAndCashout = 'RevealAndCashout',

  // Wheel
  Participated = 'Participated',
  ClaimedBatch = 'ClaimedBatch',

  KenoResult = 'KenoResult',

  // BJ
  HandSplit = 'HandSplit',
  HandCreated = 'HandCreated',
  HandInsured = 'HandInsured',
  HandStandOff = 'HandStandOff',
  PlayerHandInfo = 'PlayerHandInfo',
  DealerHandInfo = 'DealerHandInfo',
  HandDoubleDown = 'HandDoubleDown',
  BJFinalized = 'BjFinalized',
  BJSettled = 'BjSettled',

  Historical = 'Historical',
  Process = 'Process',
  ReelSpinSettled = 'ReelSpinSettled',
  GameCreated = 'GameCreated',
}

export type GameHubEvent<T> = {
  id?: string;
  address: Address;
  type: GAME_HUB_EVENT_TYPES;
  gameType?: GAME_HUB_GAMES;
  result: T;
  currency?: GameHubCurrency;
};

export interface CoinFlipSettledEvent {
  payout: bigint;
  payback: bigint;
  steps: {
    win: boolean;
    outcome: number;
    payout: bigint;
  }[];
  converted: {
    payout: number;
    payback: number;
    steps: {
      win: boolean;
      payout: number;
      outcome: number;
    }[];
  };
}

export enum GAMES {
  RPS = 'rps',
  DICE = 'dice',
  RANGE = 'range',
  ROULETTE = 'roulette',
}

export type UnitySendMessage = (
  gameObjectName: string,
  methodName: string,
  parameter?: any
) => void;

export enum PUBLIC_MULTIPLAYER_GAME_EVENTS {
  moon_game_events = 'moon_game_events',
  wheel_game_events = 'wheel_game_events',
  horse_race_game_events = 'horse_race_game_events',
}

// V2 GAMEHUB

export type Item<T> = {
  type: string;
  data: T;
};

export type EventContext<T, K> = { context: Item<T>[]; program: Item<K>[] };

export enum DecoderType {
  Context = 'context',
  Moon = 'moon',
  Dice = 'dice',
  Keno = 'keno',
  Limbo = 'limbo',
  Range = 'range',
  Wheel = 'wheel',
  Plinko = 'plinko',
  CoinFlip = 'coin-flip',
  Roulette = 'roulette',
  HorseRace = 'horse-race',
  RockPaperScissors = 'rock-paper-scissors',
}

export type EventMap = {
  list: {
    items: ReadonlyArray<{
      key: string;
      value: Hex;
    }>;
  };
};

export type Event = {
  context: any;
  timestamp: bigint;
  type: string;
  id: string;
  player: string;
  program: string;
};

export type DecodedEvent<T, K> = {
  key: Hex;
  type: string;
  version: number;
  logic: EventLogic;
  timestamp: number;
  context: Item<T>[];
  program: Item<K>[];
};

interface GetGameHubEventParams {
  eventType: GAME_HUB_EVENT_TYPES;
  account: string;
}

const BUNDLER_WS_URL = 'wss://game-hub-production-ssmnd.ondigitalocean.app/rpc';

// const BUNDLER_WS_URL = "ws://localhost:3002" || "";

export const getGameHubEvent = <T>({
  eventType,
  account,
}: GetGameHubEventParams): Promise<GameHubEvent<T>> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${BUNDLER_WS_URL}?owner=${account}`);

    ws.onmessage = (message: any) => {
      // Handle message event here

      const data = SuperJSON.parse(message.data) as GameHubEvent<T>;

      if (data?.id) {
        const _ack = {
          jsonrpc: '2.0',
          method: 'acknowledge',
          id: data?.id,
          params: {
            id: data?.id,
          },
        };

        ws.send(JSON.stringify(_ack));
      }

      if (data?.type !== eventType) return;

      resolve(data);

      ws.close();
    };

    ws.onerror = () => {
      reject('Error on receiving event');
    };
  });
};

export const getGameHubEventV2 = <T, K>({
  eventType,
  account,
}: GetGameHubEventParams): Promise<DecodedEvent<T, K>> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${BUNDLER_WS_URL}?owner=${account}`);

    ws.onmessage = (message: any) => {
      // Handle message event here

      const data = SuperJSON.parse(message.data) as Event;

      if (data?.id) {
        const _ack = {
          jsonrpc: '2.0',
          method: 'acknowledge',
          id: data.id,
          params: {
            id: data?.id,
          },
        };

        ws.send(JSON.stringify(_ack));
      }

      const context = data?.context as DecodedEvent<T, K>;

      if (context?.program?.[0]?.type !== eventType) return;

      resolve(context);

      ws.close();
    };

    ws.onerror = () => {
      reject('Error on receiving event');
    };
  });
};

interface PrepareGameTransactionParams {
  wager: number;
  lastPrice: number;
  selectedCurrency: string;
  stopGain?: number;
  stopLoss?: number;
}

interface PrepareGameTransactionResult {
  wagerInWei: bigint;
  tokenAddress: `0x${string}`;
  stopGainInWei?: bigint;
  stopLossInWei?: bigint;
}

export const prepareGameTransaction = (
  params: PrepareGameTransactionParams
): PrepareGameTransactionResult => {
  const { lastPrice, wager, selectedCurrency, stopGain = 0, stopLoss = 0 } = params;

  const wagerInGameCurrency = toDecimals((wager / lastPrice).toString(), 6).toString();

  const stopGainInGameCurrency = toDecimals((stopGain / lastPrice).toString(), 6).toString();

  const stopLossInGameCurrency = toDecimals((stopLoss / lastPrice).toString(), 6).toString();

  const decimal = 18;

  const wagerInWei = parseUnits(wagerInGameCurrency, decimal);

  const stopGainInWei = parseUnits(stopGainInGameCurrency, decimal);

  const stopLossInWei = parseUnits(stopLossInGameCurrency, decimal);

  const tokenAddress = '0x031C21aC79baac1E6AD074ea63ED9e9a318cab26';

  return {
    wagerInWei,
    tokenAddress,
    stopGainInWei,
    stopLossInWei,
  };
};
