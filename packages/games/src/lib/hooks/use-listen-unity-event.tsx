'use client';

declare global {
  interface Window {
    GetMessageFromUnity?: (name: string, eventData: string) => void;
  }
}

import debug from 'debug';
import { useCallback, useEffect, useState } from 'react';

// Assuming UnityEventData is properly defined elsewhere
type UnityEventData = {
  name: string;
  strParam: string;
};

const unityEventDefaultValue: UnityEventData = {
  name: '',
  strParam: '',
};

const log = debug('worker:UseListenUnityEvent');

export const useListenUnityEvent = () => {
  const [unityEvent, setUnityEvent] = useState<UnityEventData>(unityEventDefaultValue);

  // Wrap the listener in a useCallback
  const handleMessageFromUnity = useCallback((name: string, strParam: string) => {
    const obj: UnityEventData = {
      name,
      strParam,
    };

    setTimeout(() => {
      log('Unity Event', obj);

      setUnityEvent(obj);
    }, 10);
  }, []);

  useEffect(() => {
    // Check if GetMessageFromUnity is not already defined to avoid overwriting
    if (typeof window !== 'undefined' && typeof window.GetMessageFromUnity === 'undefined') {
      // Assign the listener to the window object
      window.GetMessageFromUnity = handleMessageFromUnity;
    }

    // Cleanup function to remove the listener
    return () => {
      if (typeof window !== 'undefined' && window.GetMessageFromUnity === handleMessageFromUnity) {
        delete window.GetMessageFromUnity;
      }
    };
  }, [handleMessageFromUnity]);

  return {
    unityEvent,
  };
};
