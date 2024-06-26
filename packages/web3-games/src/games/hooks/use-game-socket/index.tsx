"use client";

import React from "react";
import { Socket, io } from "socket.io-client";
import SuperJSON from "superjson";
import { useCurrentAccount } from "@winrlabs/web3";

interface GameSocket {
  // gameEvent: DecodedEvent<T, K> | null;
  socket: Socket | null;
}
const GameSocketContext = React.createContext<GameSocket>({
  socket: null,
});

export const useGameSocketContext = <T, K>() => {
  return React.useContext(GameSocketContext);
};

export const GameSocketProvider: React.FC<{
  bundlerWsUrl: string;
  children: React.ReactNode;
}> = ({ bundlerWsUrl, children }) => {
  const { address } = useCurrentAccount();

  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (!address || !bundlerWsUrl) return;

    setSocket(
      io(bundlerWsUrl, {
        extraHeaders: {
          "x-address": address,
        },
      })
    );
  }, [address, bundlerWsUrl]);

  // socket connection
  React.useEffect(() => {
    if (!socket) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("socket connected!");
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.off("connect");

      socket.off("disconnect");

      socket.disconnect();
    };
  }, [socket]);

  // React.useEffect(() => {
  //   if (!socket) return;

  //   socket.on("message", onListenEvent);

  //   return () => {
  //     socket.off("message", onListenEvent);
  //   };
  // }, [socket]);

  // const onListenEvent = (e: string) => {
  //   const _e = SuperJSON.parse(e) as Event;

  //   const context = _e.context as DecodedEvent<any, any>;

  //   console.log(context, "CONTEXT!");

  //   setGameEvent(context);
  // };

  React.useEffect(() => {
    console.log(socket, "SOCKET!");
  }, [socket]);

  return (
    <GameSocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </GameSocketContext.Provider>
  );
};
