"use client";

import { BundlerNetwork, useCurrentAccount } from "@winrlabs/web3";
import React from "react";
import { io, Socket } from "socket.io-client";

interface GameSocket {
  socket: Socket | null;
  bundlerWsUrl: string;
  network: BundlerNetwork;
}
const GameSocketContext = React.createContext<GameSocket>({
  socket: null,
  bundlerWsUrl: "",
  network: BundlerNetwork.WINR,
});

export const useGameSocketContext = () => {
  return React.useContext(GameSocketContext);
};

export const GameSocketProvider: React.FC<{
  bundlerWsUrl: string;
  network: BundlerNetwork;
  children: React.ReactNode;
}> = ({ bundlerWsUrl, network, children }) => {
  const { address } = useCurrentAccount();

  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (!address || !bundlerWsUrl || !network) return;
    console.log(network, bundlerWsUrl, "bundler ws url");
    setSocket(
      io(bundlerWsUrl, {
        extraHeaders: {
          "x-address": address,
          "x-network": network,
        },
      })
    );
  }, [address, bundlerWsUrl, network]);

  // socket connection
  React.useEffect(() => {
    if (!socket) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("socket connected!", socket);
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
        network,
      }}
    >
      {children}
    </GameSocketContext.Provider>
  );
};
