import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useMinesGameStateStore } from '../store';
import {
  MINES_GAME_STATUS,
  MINES_SUBMIT_TYPE,
  MinesForm,
  MinesFormField,
  MinesGameResult,
  MinesGameResultOnComplete,
} from '../types';

export type MinesGameProps = React.ComponentProps<'div'> & {
  gameResults: MinesGameResult[];
  isLoading?: boolean;
  onAnimationCompleted?: (result: MinesGameResultOnComplete) => void;
};

export const MinesGame = ({
  gameResults,
  children,
  processStrategy,
  isAutoBetMode,
  onAutoBetModeChange,
  onSubmitGameForm,
}: MinesGameProps & {
  isAutoBetMode: boolean;
  processStrategy: () => void;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitGameForm: (data: MinesFormField) => void;
}) => {
  const { updateMinesGameState, gameStatus } = useMinesGameStateStore([
    'updateMinesGameState',
    'gameStatus',
  ]);

  const isAutoBetModeRef = React.useRef(isAutoBetMode);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const form = useFormContext() as MinesForm;
  const betCount = form.watch('betCount');

  React.useEffect(() => {
    if (isAutoBetMode && gameStatus === MINES_GAME_STATUS.ENDED) {
      updateMinesGameState({
        submitType: MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT,
      });
      timeoutRef.current = setTimeout(() => {
        if (isAutoBetModeRef.current) {
          processStrategy();
          const newBetCount = betCount - 1;
          betCount !== 0 && form.setValue('betCount', betCount - 1);
          if (betCount >= 0 && newBetCount != 0) {
            onSubmitGameForm(form.getValues());
          } else {
            onAutoBetModeChange(false);
            updateMinesGameState({
              submitType: MINES_SUBMIT_TYPE.IDLE,
              gameStatus: MINES_GAME_STATUS.IDLE,
            });
          }
        }
      }, 1000);
    }
  }, [gameStatus]);

  React.useEffect(() => {
    isAutoBetModeRef.current = isAutoBetMode;
    if (!isAutoBetMode && gameStatus !== MINES_GAME_STATUS.IDLE) {
      clearTimeout(timeoutRef.current);
      setTimeout(() => {
        updateMinesGameState({
          submitType: MINES_SUBMIT_TYPE.IDLE,
          gameStatus: MINES_GAME_STATUS.IDLE,
        });
      }, 1500);
    }
  }, [isAutoBetMode]);

  return <>{children}</>;
};
