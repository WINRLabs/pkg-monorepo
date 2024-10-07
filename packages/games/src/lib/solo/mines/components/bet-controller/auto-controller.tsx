'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AutoBetCountFormField,
  AutoBetIncreaseOnLoss,
  AutoBetIncreaseOnWin,
  AutoBetStopGainFormField,
  AutoBetStopLossFormField,
  WagerFormField,
} from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { CDN_URL } from '../../../../constants';
import { useGameOptions } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form';
import { NumberInput } from '../../../../ui/number-input';
import { cn } from '../../../../utils/style';
import { initialBoard } from '../../constants';
import useMinesGameStateStore from '../../store';
import { MINES_GAME_STATUS, MINES_SUBMIT_TYPE, MinesForm, MinesFormField } from '../../types';
import MinesCountButton from '../count-button';
import { BetLoader } from './bet-loader';

interface AutoControllerProps {
  isGettingResults?: boolean;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
  onGameSubmit: (values: MinesFormField) => void;
}

export const AutoController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  onAutoBetModeChange,
  onLogin,
  onGameSubmit,
}: AutoControllerProps) => {
  const form = useFormContext() as MinesForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const isDisabled = form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode;

  const { updateMinesGameState, board } = useMinesGameStateStore(['updateMinesGameState', 'board']);

  const { account } = useGameOptions();

  const getCleanedLastBoard = () => {
    const _board = board;

    _board.forEach((v, i) => {
      _board[i] = {
        isRevealed: false,
        isBomb: false,
        isSelected: v.isSelected,
      };
    });

    form.setValue(
      'selectedCells',
      _board.map((v) => v.isSelected)
    );
    return _board;
  };
  return (
    <div className="wr-flex wr-flex-col">
      <WagerFormField
        className="lg:!wr-mb-3"
        minWager={minWager}
        maxWager={maxWager}
        isDisabled={isDisabled}
      />

      <FormField
        control={form.control}
        name="minesCount"
        render={({ field }) => {
          return (
            <FormItem
              className={cn({
                'wr-mb-0 lg:wr-mb-3': account?.isLoggedIn || !!account?.balanceAsDollar,
                'wr-mb-3 lg:wr-mb-3': !account?.isLoggedIn || !account?.balanceAsDollar,
              })}
            >
              <FormLabel className="wr-mb-3 lg:wr-mb-[6px] wr-leading-4 lg:wr-leading-6">
                Mines Count (1 - 24)
              </FormLabel>
              <NumberInput.Root
                {...field}
                errorClassName="wr-hidden lg:wr-block"
                className="wr-relative wr-flex wr-items-center wr-gap-2"
                isDisabled={isDisabled}
              >
                <NumberInput.Container className="wr-bg-zinc-950">
                  <img
                    alt="mine_icon"
                    width={17}
                    height={17}
                    src={`${CDN_URL}/mines/mine-icon.png`}
                  />
                  <NumberInput.Input className="wr-text-sm wr-font-semibold" />
                </NumberInput.Container>
                <div className="wr-flex wr-flex-shrink-0 wr-items-center wr-justify-between wr-gap-1">
                  <MinesCountButton
                    value={3}
                    minesCount={field.value}
                    form={form}
                    isDisabbled={isDisabled}
                  />
                  <MinesCountButton
                    value={5}
                    minesCount={field.value}
                    form={form}
                    isDisabbled={isDisabled}
                  />
                  <MinesCountButton
                    value={10}
                    minesCount={field.value}
                    form={form}
                    isDisabbled={isDisabled}
                  />
                  <MinesCountButton
                    value={20}
                    minesCount={field.value}
                    form={form}
                    isDisabbled={isDisabled}
                  />
                </div>
                <FormMessage className="wr-absolute wr-left-0 wr-top-12" />
              </NumberInput.Root>
            </FormItem>
          );
        }}
      />

      <div className="wr-order-2 lg:wr-order-none wr-flex wr-gap-2 lg:wr-flex-col lg:wr-gap-0">
        <AutoBetCountFormField isDisabled={isDisabled} />
        <div className="wr-flex wr-gap-2 md:wr-gap-3">
          <AutoBetIncreaseOnWin isDisabled={isDisabled} showSm />
          <AutoBetIncreaseOnLoss isDisabled={isDisabled} showSm />
        </div>
      </div>

      <div className="wr-order-3 lg:wr-order-none wr-flex wr-gap-3">
        <AutoBetStopGainFormField isDisabled={isDisabled} />
        <AutoBetStopLossFormField isDisabled={isDisabled} />
      </div>

      <PreBetButton onLogin={onLogin} className="wr-mb-3 lg:wr-mb-0">
        <Button
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-3 lg:wr-mb-0 wr-order-1 lg:wr-order-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading,
            }
          )}
          size={'xl'}
          type="button"
          onClick={() => {
            clickEffect.play();
            const nextAutoBetMode = !isAutoBetMode;
            onAutoBetModeChange(nextAutoBetMode);

            if (nextAutoBetMode) {
              updateMinesGameState({
                submitType: MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT,
                gameStatus: MINES_GAME_STATUS.IDLE,
                board: getCleanedLastBoard(),
              });

              setTimeout(() => {
                onGameSubmit(form.getValues());
              });
            } else {
              updateMinesGameState({
                submitType: MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT,
                gameStatus: MINES_GAME_STATUS.IDLE,
                board: getCleanedLastBoard(),
              });

              form.reset();
            }
          }}
        >
          {isAutoBetMode ? (
            <div className="wr-flex wr-items-center wr-gap-1.5">
              Stop Autobet <BetLoader />
            </div>
          ) : (
            'Start Autobet'
          )}
        </Button>
      </PreBetButton>
    </div>
  );
};
