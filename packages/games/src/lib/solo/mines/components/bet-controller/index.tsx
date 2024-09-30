'use client';
import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { AnimatedTabContent } from '../../../../common/animated-tab-content';
import { AudioController } from '../../../../common/audio-controller';
import { BetControllerContainer } from '../../../../common/containers';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { useWinAnimation } from '../../../../hooks/use-win-animation';
import { cn } from '../../../../utils/style';
import { initialBoard, MINES_MODES } from '../../constants';
import { MinesTheme } from '../../provider/theme';
import useMinesGameStateStore from '../../store';
import { MINES_GAME_STATUS, MINES_SUBMIT_TYPE, MinesForm, MinesFormField } from '../../types';
import { AutoController } from './auto-controller';
// import { AutoController } from './auto-controller';
import { ManualController } from './manual-controller';

export interface MinesBetControllerProps {
  minWager: number;
  maxWager: number;
  currentMultiplier: number;
  currentCashoutAmount: number;
  isGettingResults?: boolean;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
  mode: (typeof MINES_MODES)[keyof typeof MINES_MODES];
  onModeChange: React.Dispatch<
    React.SetStateAction<(typeof MINES_MODES)[keyof typeof MINES_MODES]>
  >;
  onGameSubmit: (values: MinesFormField) => void;
  theme?: Partial<MinesTheme>;
}

const MinesBetController: React.FC<MinesBetControllerProps> = (props) => {
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const { showWinAnimation, closeWinAnimation } = useWinAnimation();

  const { updateMinesGameState, gameStatus, board } = useMinesGameStateStore([
    'updateMinesGameState',
    'gameStatus',
    'board',
  ]);

  const form = useFormContext() as MinesForm;
  const wager = form.watch('wager');

  const numMines = form.watch('minesCount');

  React.useEffect(() => {
    if (gameStatus == MINES_GAME_STATUS.ENDED) {
      if (!board.some((v) => v.isBomb == true) && props.currentCashoutAmount > 0) {
        showWinAnimation({
          payout: props.currentCashoutAmount,
          multiplier: props.currentMultiplier,
        });

        winEffect.play();
      }

      setTimeout(() => {
        if (props.mode == MINES_MODES.AUTO) {
          updateMinesGameState({
            board: board.map((c) => ({ ...c, isRevealed: false, isBomb: false })),
            gameStatus: !props.isAutoBetMode
              ? MINES_GAME_STATUS.IDLE
              : MINES_GAME_STATUS.IN_PROGRESS,
            minesGameResults: [],
          });
        } else {
          updateMinesGameState({
            gameStatus: MINES_GAME_STATUS.IDLE,
            submitType: MINES_SUBMIT_TYPE.IDLE,
          });
          form.resetField('selectedCells');
          updateMinesGameState({
            board: initialBoard,
          });
        }

        closeWinAnimation();
      }, 1000);
    }
  }, [gameStatus]);

  React.useEffect(() => {
    if (numMines > 24) form.setValue('minesCount', 24);
  }, [numMines]);

  return (
    <BetControllerContainer>
      <div className="wr-max-lg:flex wr-max-lg:flex-col">
        <Tabs.Root
          defaultValue={MINES_MODES.MANUAL}
          value={props.mode}
          onValueChange={(v) => {
            if (!v) return;
            props.onModeChange(v as (typeof MINES_MODES)[keyof typeof MINES_MODES]);
          }}
        >
          {props.theme?.controllerHeader}

          {!props.theme?.hideTabs && (
            <Tabs.List className="wr-flex wr-w-full wr-justify-between wr-items-center wr-gap-2 wr-font-semibold wr-mb-3">
              <Tabs.Trigger
                className={cn('wr-w-full wr-px-4 wr-py-2 wr-bg-zinc-700 wr-rounded-md', {
                  'wr-bg-zinc-800 wr-text-grey-500': props.mode !== 'manual',
                  'wr-pointer-events-none wr-bg-zinc-800 wr-text-grey-500': props.isAutoBetMode,
                })}
                value={MINES_MODES.MANUAL}
                disabled={gameStatus === MINES_GAME_STATUS.IN_PROGRESS}
              >
                Manual
              </Tabs.Trigger>
              <Tabs.Trigger
                className={cn('wr-w-full wr-px-4 wr-py-2 wr-bg-zinc-700 wr-rounded-md', {
                  'wr-bg-zinc-800 wr-text-grey-500': props.mode !== 'auto',
                  'wr-pointer-events-none wr-bg-zinc-800 wr-text-grey-500': props.isAutoBetMode,
                })}
                value="auto"
                disabled={gameStatus === MINES_GAME_STATUS.IN_PROGRESS}
              >
                Auto
              </Tabs.Trigger>
            </Tabs.List>
          )}

          <AnimatedTabContent value={MINES_MODES.MANUAL}>
            <ManualController {...props} />
          </AnimatedTabContent>
          <AnimatedTabContent value="auto">
            <AutoController {...props} />
          </AnimatedTabContent>
        </Tabs.Root>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between lg:wr-mt-4">
        <AudioController />
        {props.theme?.controllerFooter}
      </footer>
    </BetControllerContainer>
  );
};

export default MinesBetController;
