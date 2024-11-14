'use client';

import React from 'react';
import debug from 'debug';
import { ErrorCode } from '@winrlabs/web3';

const log = debug('worker:UseRetryLogic');

interface UseRetryLogicParams<T> {
  onSubmit: (v: T, errCount?: number) => Promise<void>;
  playerReIterate: () => Promise<void>;
  cb?: () => void;
}

export const useRetryLogic = <T,>({ onSubmit, playerReIterate, cb }: UseRetryLogicParams<T>) => {
  const iterationTimeoutRef = React.useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = React.useRef<boolean>(true);

  const clearIterationIntervals = () => {
    iterationTimeoutRef.current.forEach((t) => clearTimeout(t));
  };

  const retryGame = async (v: T, errCount = 0) => onSubmit(v, errCount);

  const handleFail = async (v: T, errCount = 0, e?: any) => {
    log('error', e?.code);
    cb && cb();

    if (errCount > 3) {
      clearIterationIntervals();
      return;
    }

    if (e?.code == ErrorCode.UserRejectedRequest) return;

    if (e?.code == ErrorCode.SessionWaitingIteration) {
      log('SESSION WAITING ITERATION');
      await playerReIterate();
      return;
    }

    log('RETRY GAME CALLED AFTER 750MS');
    retryGame(v, errCount);
  };

  const handleErrorLogic = async (v: T, errCount = 0, e?: any) => {
    if (isMountedRef.current) {
      const t = setTimeout(() => handleFail(v, errCount + 1, e), 750);
      iterationTimeoutRef.current.push(t);
    }
  };

  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearIterationIntervals();
    };
  }, []);

  return {
    handleErrorLogic,
    clearIterationIntervals,
  };
};
