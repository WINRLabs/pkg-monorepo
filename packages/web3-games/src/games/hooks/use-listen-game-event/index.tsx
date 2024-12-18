import { useCurrentAccount } from '@winrlabs/web3';
import dayjs from 'dayjs';
import debug from 'debug';
import React from 'react';
import { io, Socket } from 'socket.io-client';
import SuperJSON from 'superjson';

import { DecodedEvent, Event } from '../../utils';
import { useGameSocketContext } from '../use-game-socket';

const log = debug('worker:UseListenGameEvent');

export const useListenGameEvent = (gameAddress: `0x${string}`) => {
  const [gameEvent, setGameEvent] = React.useState<DecodedEvent<any, any> | null>(null);
  const socketRef = React.useRef<Socket | null>(null);

  const { address } = useCurrentAccount();
  const { bundlerWsUrl, network, setConnected } = useGameSocketContext();

  React.useEffect(() => {
    if (!bundlerWsUrl || !network || !gameAddress || !address || socketRef.current) return;

    const socketURL = `${bundlerWsUrl}/justbet/single-games`;
    const socket = io(socketURL, {
      path: `/socket.io/`,
      transports: ['websocket'],
      query: {
        player: address,
        game: gameAddress,
        chain: network.toLowerCase(),
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      log('socket connected!', socket);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      log('socket disconnected');
      setConnected(false);
    });

    socket.on('event', onGameEvent);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('event', onGameEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bundlerWsUrl, network, gameAddress, address, setConnected]);

  const onGameEvent = (e: string) => {
    const parsedEvent = SuperJSON.parse(e) as Event;
    const context = parsedEvent.context as DecodedEvent<any, any>;

    log(context, 'CONTEXT!', dayjs(new Date()).unix());
    setGameEvent(context);
  };

  return gameEvent;
};
