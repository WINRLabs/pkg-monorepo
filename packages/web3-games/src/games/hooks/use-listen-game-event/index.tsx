import React from "react";
import SuperJSON from "superjson";

import { DecodedEvent, Event } from "../../utils";
import { useGameSocketContext } from "../use-game-socket";

export const useListenGameEvent = () => {
  const [gameEvent, setGameEvent] = React.useState<DecodedEvent<
    any,
    any
  > | null>(null);

  const { socket } = useGameSocketContext();

  React.useEffect(() => {
    if (!socket) return;

    socket.on("message", onListenEvent);

    return () => {
      socket.off("message", onListenEvent);
    };
  }, [socket]);

  const onListenEvent = (e: string) => {
    const _e = SuperJSON.parse(e) as Event;

    const context = _e.context as DecodedEvent<any, any>;

    console.log(context, "CONTEXT!");

    setGameEvent(context);
  };

  return gameEvent;
};
