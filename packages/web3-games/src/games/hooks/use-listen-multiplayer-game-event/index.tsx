import { useBundlerClient } from '@winrlabs/web3';
import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import SuperJSON from 'superjson';
import { Address } from 'viem';

import {
  BetProgram,
  GameProgram,
  MultiplayerGameMessage,
  MultiplayerUpdateMessage,
  Participant,
  RandomsContext,
  SessionContext,
} from '../../multiplayer/type';
import { useGameSocketContext } from '../use-game-socket';
import debug from 'debug';

const log = debug('worker:UseListenMpGameEvent');

interface MultiplayerGameState {
  joiningStart: number;
  joiningFinish: number;
  cooldownFinish: number;
  randoms: bigint | undefined;
  participants: Participant[];
  result: number;
  bet: BetProgram | undefined;
  player: any;
  isGameActive: boolean;
  angle: number;
  session: {
    bankrollIndex: Address;
  };
}

export enum SocketMultiplayerGameType {
  horserace = 'horse-race',
  wheel = 'wheel',
  moon = 'moon',
}

interface IUseListenMultiplayerGameEvent {
  gameType: SocketMultiplayerGameType;
}

const multiplayerGameStatusMethodMap = {
  [SocketMultiplayerGameType.moon]: 'horserace',
  [SocketMultiplayerGameType.wheel]: 'wheel',
  [SocketMultiplayerGameType.horserace]: 'horserace',
};

export const useListenMultiplayerGameEvent = ({ gameType }: IUseListenMultiplayerGameEvent) => {
  const socketRef = React.useRef<Socket | null>(null);

  const { bundlerWsUrl, network } = useGameSocketContext();

  const { client } = useBundlerClient();

  const [gameState, setGameState] = useState<MultiplayerGameState>({
    joiningStart: 0,
    joiningFinish: 0,
    cooldownFinish: 0,
    randoms: 0n,
    participants: [],
    result: 0,
    bet: undefined,
    player: {},
    isGameActive: false,
    angle: 0,
    session: {
      bankrollIndex: '0x0000000000000000000000000000000000000000',
    },
  });

  const namespace = React.useMemo(() => {
    if (!network || !gameType) return undefined;
    return `${network.toLowerCase()}/${gameType}`;
  }, [network, gameType]);

  React.useEffect(() => {
    if (!bundlerWsUrl || !namespace || socketRef.current) return;

    const socketURL = `${bundlerWsUrl}/${namespace}`;
    const socket = io(socketURL, {
      path: `/socket.io/`,
      transports: ['websocket', 'webtransport'],
    });

    log(socket, 'socket');

    socketRef.current = socket;

    socket.on('connect', () => {
      log('[MULTIPLAYER] socket connected!', socket);
    });

    socket.on('disconnect', () => {
      log('[MULTIPLAYER] socket disconnected!');
    });

    socket.on(namespace, onGameEvent);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off(namespace, onGameEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bundlerWsUrl, namespace]);

  const onGameEvent = (e: string) => {
    const _e = SuperJSON.parse(e) as MultiplayerGameMessage & MultiplayerUpdateMessage;

    log('onGameEvent', _e);

    if (!_e?.context) return;

    // TODO: fix types here
    const gameProgram = _e?.context?.program.find((p) => p.type == 'Game')?.data as GameProgram;
    const randoms = _e.context?.context.find((c) => c.type == 'Randoms')?.data as RandomsContext;
    const session = _e.context?.context.find((c) => c.type == 'Session')?.data as SessionContext;
    const bet = _e.context?.program.find((c) => c.type == 'Bet')?.data as BetProgram;

    if (!gameProgram) {
      return;
    }

    const {
      cooldownFinish,
      joinningFinish: joiningFinish,
      joinningStart: joiningStart,
      result,
    } = gameProgram;

    setGameState((prev) => ({
      ...prev,
      cooldownFinish,
      joiningFinish,
      joiningStart,
      result: result,
      randoms: randoms?.length > 0 ? randoms[0]! : undefined,
      player: session.player,
      session: {
        bankrollIndex: session.bankroll,
      },
      bet: bet,
      participants: [],
      angle: gameProgram?.angle || 0,
    }));
  };

  React.useEffect(() => {
    getInitialGameState();
  }, [client, gameType]);

  const getInitialGameState = async () => {
    if (!client || !gameType) return;

    const gameState = await client.request('multiplayerGameState', {
      gameName: multiplayerGameStatusMethodMap[gameType] as any,
    });

    const _e = SuperJSON.parse(gameState) as MultiplayerGameMessage & MultiplayerUpdateMessage;
    const isGameActive = _e?.isActive;

    log(_e, 'IS ACTIVE GAME CHECK');

    if (isGameActive) {
      setGameState((prev) => ({
        ...prev,
        joiningFinish: _e?.result.joiningFinish,
        cooldownFinish: _e?.result.cooldownFinish,
        joiningStart: _e?.result.joiningStart,
        participants: _e.participants,
        isGameActive: true,
      }));
      return;
    }
  };

  return gameState;
};
