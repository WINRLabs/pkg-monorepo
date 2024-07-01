"use client";

import React from "react";
import { Socket, io } from "socket.io-client";
import { useCurrentAccount } from "@winrlabs/web3";

interface GameSocket {
  socket: Socket | null;
  bundlerWsUrl: string;
}
const GameSocketContext = React.createContext<GameSocket>({
  socket: null,
  bundlerWsUrl: "",
});

export const useGameSocketContext = () => {
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

  return (
    <GameSocketContext.Provider
      value={{
        socket,
        bundlerWsUrl,
      }}
    >
      {children}
    </GameSocketContext.Provider>
  );
};
