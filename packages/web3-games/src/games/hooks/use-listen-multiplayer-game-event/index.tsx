import { useCurrentAccount } from "@winrlabs/web3";
import React, { useState } from "react";
import { io,Socket } from "socket.io-client";
import SuperJSON from "superjson";

import {
  BetProgram,
  GameProgram,
  MultiplayerGameMessage,
  MultiplayerUpdateMessage,
  RandomsContext,
  SessionContext,
} from "../../multiplayer/type";
import { GAME_HUB_GAMES } from "../../utils";
const bundlerWsUrl = process.env.NEXT_PUBLIC_BUNDLER_WS_URL || "";

export const useListenMultiplayerGameEvent = (game: GAME_HUB_GAMES) => {
  const { address } = useCurrentAccount();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  const [gameState, setGameState] = useState<{
    joiningStart: number;
    joiningFinish: number;
    cooldownFinish: number;
    randoms: bigint;
    participants: [];
    result: number;
    bet: BetProgram | undefined;
    player: any;
  }>({
    joiningStart: 0,
    joiningFinish: 0,
    cooldownFinish: 0,
    randoms: 0n,
    participants: [],
    result: 0,
    bet: undefined,
    player: {},
  });

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
      console.log("MULTIPLAYER ANY EVENT", e);
    });

    return () => {
      socket.off("message", onGameEvent);
      socket.off("connect_info", onConnectEvent);
    };
  }, [socket]);

  const onConnectEvent = (e: string) => {
    // const _e = SuperJSON.parse(e) as Event;
    // console.log("MULTIPLAYER CONkNECT EVENT", _e);
    // if (!_e?.context) return;
  };

  const onGameEvent = (e: string) => {
    const _e = SuperJSON.parse(e) as MultiplayerGameMessage &
      MultiplayerUpdateMessage;
    console.log("MULTIPLAYER", _e);

    if (_e.is_active) {
      setGameState((prev) => ({
        ...prev,
        joiningFinish: _e?.result.joiningFinish,
        cooldownFinish: _e?.result.cooldownFinish,
        joiningStart: _e?.result.joiningStart,
      }));
      return;
    }

    // TODO: fix types here
    const gameProgram = _e.context?.program.find((p) => p.type == "Game")
      ?.data as GameProgram;
    const randoms = _e.context?.context.find((c) => c.type == "Randoms")
      ?.data as RandomsContext;
    const session = _e.context?.context.find((c) => c.type == "Session")
      ?.data as SessionContext;
    const bet = _e.context?.program.find((c) => c.type == "Bet")
      ?.data as BetProgram;

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
      randoms: randoms[0]!,
      player: session.player,
      bet: bet,
      participants: [],
    }));
  };

  return gameState;
};
