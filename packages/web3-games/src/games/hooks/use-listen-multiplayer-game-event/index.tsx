import { useCurrentAccount } from "@winrlabs/web3";
import React, { useState } from "react";
import { io, Socket } from "socket.io-client";
import SuperJSON from "superjson";
import { Address } from "viem";

import {
  BetProgram,
  GameProgram,
  MultiplayerGameMessage,
  MultiplayerUpdateMessage,
  Participant,
  RandomsContext,
  SessionContext,
} from "../../multiplayer/type";
import { GAME_HUB_GAMES } from "../../utils";
import { useGameSocketContext } from "../use-game-socket";

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

export const useListenMultiplayerGameEvent = (game: GAME_HUB_GAMES) => {
  const { address } = useCurrentAccount();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  const { bundlerWsUrl, network } = useGameSocketContext();

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
      bankrollIndex: "0x0000000000000000000000000000000000000000",
    },
  });

  React.useEffect(() => {
    if (!bundlerWsUrl) return;

    setSocket(
      io(bundlerWsUrl, {
        autoConnect: false,
        extraHeaders: {
          "x-address": address!,
          "x-multiplayer-game": game,
          "x-network": network,
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
    // socket.on("connect_info", onConnectEvent);

    socket.onAny((e) => {
      // console.log("MULTIPLAYER ANY EVENT", e);
    });

    return () => {
      socket.off("message", onGameEvent);
      // socket.off("connect_info", onConnectEvent);
    };
  }, [socket]);

  const onGameEvent = (e: string) => {
    const _e = SuperJSON.parse(e) as MultiplayerGameMessage &
      MultiplayerUpdateMessage;
    const isGameActive = _e?.is_active;

    console.log("onGameEvent", _e);

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

    if (!_e?.context) return;

    // TODO: fix types here
    const gameProgram = _e?.context?.program.find((p) => p.type == "Game")
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

  return gameState;
};
