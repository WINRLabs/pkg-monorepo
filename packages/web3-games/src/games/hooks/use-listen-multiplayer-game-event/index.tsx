import React from "react";
import { DecodedEvent, Event, GAME_HUB_GAMES } from "../../utils";
import SuperJSON from "superjson";
import { Socket, io } from "socket.io-client";
import { useCurrentAccount } from "@winrlabs/web3";

const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || "";

export const useListenMultiplayerGameEvent = (game: GAME_HUB_GAMES) => {
  const { address } = useCurrentAccount();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  const [gameEvent, setGameEvent] = React.useState<DecodedEvent<
    any,
    any
  > | null>(null);

  React.useEffect(() => {
    if (!bundlerWsUrl) return;

    setSocket(
      io(bundlerWsUrl, {
        autoConnect: false,
        extraHeaders: {
          "x-address": address!,
          "x-multiplayer-game": game,
        },
      })
    );
  }, []);

  // socket connection
  React.useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("connect", () => {
      console.log("[MULTIPLAYER] socket connected!");
    });

    socket.on("disconnect", (er) => {
      console.log("[MULTIPLAYER] socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on("message", onGameEvent);
    socket.on("connect_info", onConnectEvent);

    socket.onAny((e) => {
      console.log("[MULTIPLAYER] ANY", e);
    });

    return () => {
      socket.off("message", onGameEvent);
    };
  }, [socket]);

  const onConnectEvent = (e: string) => {
    console.log("[MULTIPLAYER] CONNECT", e);
  };

  const onGameEvent = (e: string) => {
    const _e = SuperJSON.parse(e) as Event;

    const context = _e.context as DecodedEvent<any, any>;
    console.log("[MULTIPLAYER] CONTEXT", context);

    setGameEvent(context);
  };

  return gameEvent;
};
