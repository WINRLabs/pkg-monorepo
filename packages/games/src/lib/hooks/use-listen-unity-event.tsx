/* "use client";

import React from "react";

declare global {
  interface Window {
    GetMessageFromUnity: (name: string, eventData: string) => void;
  }
}

interface UnityEventData {
  name: string;
  strParam: string;
}

const unityEventDefaultValue: UnityEventData = {
  name: "",
  strParam: "",
};

export const useListenUnityEvent = () => {
  const [unityEvent, setUnityEvent] = React.useState<UnityEventData>(
    unityEventDefaultValue,
  );

  React.useEffect(() => {
    if (window) {
      window.GetMessageFromUnity = (name: string, strParam: string) => {
        const obj: UnityEventData = {
          name,
          strParam,
        };

        console.log("Unity Event", obj);

        setUnityEvent(obj);
      };
    }
  }, []);

  return {
    unityEvent,
  };
}; */

"use client";

declare global {
  interface Window {
    GetMessageFromUnity?: (name: string, eventData: string) => void;
  }
}

import { useEffect, useState, useCallback } from "react";

// Assuming UnityEventData is properly defined elsewhere
type UnityEventData = {
  name: string;
  strParam: string;
};

const unityEventDefaultValue: UnityEventData = {
  name: "",
  strParam: "",
};

export const useListenUnityEvent = () => {
  const [unityEvent, setUnityEvent] = useState<UnityEventData>(
    unityEventDefaultValue
  );

  // Wrap the listener in a useCallback
  const handleMessageFromUnity = useCallback(
    (name: string, strParam: string) => {
      const obj: UnityEventData = {
        name,
        strParam,
      };

      setTimeout(() => {
        console.log("Unity Event", obj);

        setUnityEvent(obj);
      }, 10);
    },
    []
  );

  useEffect(() => {
    // Check if GetMessageFromUnity is not already defined to avoid overwriting
    if (
      typeof window !== "undefined" &&
      typeof window.GetMessageFromUnity === "undefined"
    ) {
      // Assign the listener to the window object
      window.GetMessageFromUnity = handleMessageFromUnity;
    }

    // Cleanup function to remove the listener
    return () => {
      if (
        typeof window !== "undefined" &&
        window.GetMessageFromUnity === handleMessageFromUnity
      ) {
        delete window.GetMessageFromUnity;
      }
    };
  }, [handleMessageFromUnity]);

  return {
    unityEvent,
  };
};
