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

  // const namespace =
  //   'winr/0x4F7f224188D7c36e27B8Fc0a6F4fce3a8FD7494A/0xB769F9037fe072F378EB87F7A75f6B79008D6a05';

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

    socket.on(`${namespace}`, (message) => {
      console.log('Received welcome message:', message);
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

  return gameEvent;
};
