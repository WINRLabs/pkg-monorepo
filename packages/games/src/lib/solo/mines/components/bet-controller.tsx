import React from 'react';
import { useFormContext } from 'react-hook-form';

import { AudioController } from '../../../common/audio-controller';
import { BetControllerContainer } from '../../../common/containers';
import { BetControllerTitle, WagerFormField } from '../../../common/controller';
import { PreBetButton } from '../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../common/wager';
import { CDN_URL } from '../../../constants';
import { useGameOptions } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { useWinAnimation } from '../../../hooks/use-win-animation';
import { Button } from '../../../ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '../../../ui/form';
import { NumberInput } from '../../../ui/number-input';
import { cn } from '../../../utils/style';
import { toDecimals, toFormatted } from '../../../utils/web3';
import { initialBoard } from '../constants';
import mineMultipliers from '../constants/mines-multipliers.json';
import { useMinesGameStateStore } from '../store';
import { MINES_GAME_STATUS, MINES_SUBMIT_TYPE, MinesForm } from '../types';
import MinesCountButton from './count-button';
import MinesCountDisplay from './count-display';

type Props = {
  minWager: number;
  maxWager: number;
  currentMultiplier: number;
  currentCashoutAmount: number;
};

export const MinesBetController: React.FC<Props> = ({
  minWager,
  maxWager,
  currentCashoutAmount,
  currentMultiplier,
}) => {
  const form = useFormContext() as MinesForm;

  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const { showWinAnimation, closeWinAnimation } = useWinAnimation();

  const { updateMinesGameState, gameStatus, board } = useMinesGameStateStore([
    'updateMinesGameState',
    'gameStatus',
    'board',
  ]);

  const { account } = useGameOptions();

  const wager = form.watch('wager');

  const numMines = form.watch('minesCount');

  const selectedCells = form.watch('selectedCells');

  const isSomeCellSelected =
    board.filter((cell) => cell.isRevealed).length !== selectedCells.filter((cell) => cell).length
      ? false
      : true;

  const maxPayout = React.useMemo(() => {
    const currentScheme = mineMultipliers.filter((scheme) => scheme.numOfMines === numMines);

    if (currentScheme.length === 0) return 0;

    const largestReveal = currentScheme?.reduce((max, obj) => {
      return obj.reveal > max.reveal ? obj : max;
    });

    const largestMultiplier = toDecimals(Number(largestReveal.multiplier) / 10000, 2);

    return toDecimals(wager * largestMultiplier, 2);
  }, [wager, numMines]);

  React.useEffect(() => {
    if (gameStatus == MINES_GAME_STATUS.ENDED) {
      if (!board.some((v) => v.isBomb == true)) {
        showWinAnimation({
          payout: currentCashoutAmount,
          multiplier: currentMultiplier,
        });

        winEffect.play();
      }

      setTimeout(() => {
        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IDLE,
          submitType: MINES_SUBMIT_TYPE.IDLE,
        });
        form.resetField('selectedCells');
        updateMinesGameState({
          board: initialBoard,
        });
        closeWinAnimation();
      }, 1000);
    }
  }, [gameStatus]);

  React.useEffect(() => {
    if (numMines > 24) form.setValue('minesCount', 24);
  }, [numMines]);

  return (
    <BetControllerContainer>
      <div>
        <div className="lg:wr-mb-3">
          <BetControllerTitle>Mines</BetControllerTitle>
        </div>

        <WagerFormField
          className="wr-mb-3 lg:wr-mb-6"
          minWager={minWager}
          maxWager={maxWager}
          // isDisabled={gameStatus !== MINES_GAME_STATUS.IDLE}
        />

        <FormField
          control={form.control}
          name="minesCount"
          render={({ field }) => {
            return (
              <FormItem
                className={cn({
                  'wr-mb-0 lg:wr-mb-6': account?.isLoggedIn || !!account?.balanceAsDollar,
                  'wr-mb-3 lg:wr-mb-6': !account?.isLoggedIn || !account?.balanceAsDollar,
                })}
              >
                <FormLabel className="wr-mb-3 lg:wr-mb-[6px] wr-leading-4 lg:wr-leading-6">
                  Mines Count (1 - 24)
                </FormLabel>
                <NumberInput.Root
                  {...field}
                  errorClassName="wr-hidden lg:wr-block"
                  className="wr-relative wr-flex wr-items-center wr-gap-2"
                  isDisabled={gameStatus !== MINES_GAME_STATUS.IDLE}
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
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                    <MinesCountButton
                      value={5}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                    <MinesCountButton
                      value={10}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                    <MinesCountButton
                      value={20}
                      minesCount={field.value}
                      form={form}
                      isDisabbled={gameStatus !== MINES_GAME_STATUS.IDLE}
                    />
                  </div>
                  <FormMessage className="wr-absolute wr-left-0 wr-top-12" />
                </NumberInput.Root>
              </FormItem>
            );
          }}
        />

        <div className="lg:!wr-block wr-hidden">
          <MinesCountDisplay />
        </div>

        <div className="wr-mb-6 wr-mt-6 lg:!wr-grid wr-grid-cols-2 wr-gap-2 wr-hidden">
          <div>
            <FormLabel>Max Payout</FormLabel>
            <div
              className={cn(
                'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]'
              )}
            >
              <WagerCurrencyIcon />
              <span className={cn('wr-font-semibold wr-text-zinc-100')}>
                ${toFormatted(maxPayout, 2)}
              </span>
            </div>
          </div>
          <div>
            <FormLabel>Total Wager</FormLabel>
            <TotalWager betCount={1} wager={form.getValues().wager} />
          </div>
        </div>
        <PreBetButton>
          {gameStatus === MINES_GAME_STATUS.ENDED ? (
            // <Button
            //   variant={"default"}
            //   className="wr-w-full wr-bg-yellow-600 hover:wr-bg-yellow-700"
            //   size={"xl"}
            //   type="button"
            //   onClick={() => {
            //     updateMinesGameState({
            //       gameStatus: MINES_GAME_STATUS.IDLE,
            //       submitType: MINES_SUBMIT_TYPE.IDLE,
            //     });

            //     form.resetField("selectedCells");

            //     updateMinesGameState({
            //       board: initialBoard,
            //     });
            //   }}
            // >
            //   Reset
            // </Button>
            <></>
          ) : (
            <>
              {/* <Button
                type="submit"
                variant={"success"}
                className="wr-w-full"
                size={"xl"}
                isLoading={
                  form.formState.isSubmitting || form.formState.isLoading
                }
                onClick={() => {
                  updateMinesGameState({
                    submitType:
                      gameStatus === MINES_GAME_STATUS.IDLE
                        ? MINES_SUBMIT_TYPE.FIRST_REVEAL
                        : MINES_SUBMIT_TYPE.REVEAL,
                  });
                }}
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  (gameStatus === MINES_GAME_STATUS.IDLE &&
                    selectedCells.every((cell) => cell === false)) ||
                  (gameStatus === MINES_GAME_STATUS.IN_PROGRESS &&
                    isSomeCellSelected)
                }
              >
                Reveal
              </Button> */}
              {gameStatus == MINES_GAME_STATUS.IN_PROGRESS && (
                <Button
                  type="submit"
                  variant={'success'}
                  className="wr-mt-2 wr-flex wr-w-full wr-items-center wr-gap-2 wr-uppercase"
                  size={'xl'}
                  isLoading={form.formState.isSubmitting || form.formState.isLoading}
                  onClick={() => {
                    updateMinesGameState({
                      submitType: MINES_SUBMIT_TYPE.CASHOUT,
                    });
                  }}
                  disabled={form.formState.isSubmitting || form.formState.isLoading}
                >
                  <span>Get </span>
                  <div className="wr-h-1 wr-w-1 wr-rounded-full wr-bg-white" />
                  {`$${currentCashoutAmount} (${currentMultiplier}x)`}
                </Button>
              )}
            </>
          )}
        </PreBetButton>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
