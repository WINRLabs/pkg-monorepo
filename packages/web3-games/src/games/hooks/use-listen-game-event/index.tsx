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

  const [socket, setSocket] = React.useState<Socket | null>(null);

  const { address } = useCurrentAccount();

  const { bundlerWsUrl, network, setConnected } = useGameSocketContext();

  const namespace = React.useMemo(() => {
    return `${network.toLowerCase()}/${gameAddress}/${address}`;
  }, [network, address, gameAddress]);

  React.useEffect(() => {
    if (!socket) return;

    socket.connect();

    socket.on('connect', () => {
      log('socket connected!', socket);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      log('socket disconnected');
      setConnected(false);
    });

    return () => {
      socket.off('connect');

      socket.off('disconnect');

      socket.disconnect();
    };
  }, [socket]);

  React.useEffect(() => {
    if (!address || !bundlerWsUrl || !network) return;
    log(network, bundlerWsUrl, 'bundler ws url', namespace);
    const socketURL = `${bundlerWsUrl}/${namespace}`;

    setSocket(
      io(socketURL, {
        path: `/socket.io/`,
        transports: ['websocket', 'webtransport'],
      })
    );
  }, [address, bundlerWsUrl, network]);

  React.useEffect(() => {
    if (!socket || !namespace) return;

    socket.on(`${namespace}`, onListenEvent);

    return () => {
      socket.off(`${namespace}`, onListenEvent);
    };
  }, [socket]);

  const onListenEvent = (e: string) => {
    const _e = SuperJSON.parse(e) as Event;

    const context = _e.context as DecodedEvent<any, any>;

    log(context, 'CONTEXT!', dayjs(new Date()).unix());

    setGameEvent(context);
  };

  return gameEvent;
};
