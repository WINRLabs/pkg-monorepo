import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { CDN_URL } from '../../../../constants';
import { useGameOptions } from '../../../../game-provider';
import { Button } from '../../../../ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form';
import { NumberInput } from '../../../../ui/number-input';
import { cn } from '../../../../utils/style';
import { toDecimals, toFormatted } from '../../../../utils/web3';
import mineMultipliers from '../../constants/mines-multipliers.json';
import { useMinesTheme } from '../../provider/theme';
import useMinesGameStateStore from '../../store';
import { MINES_GAME_STATUS, MINES_SUBMIT_TYPE, MinesForm } from '../../types';
import MinesCountButton from '../count-button';
import MinesCountDisplay from '../count-display';

type Props = {
  minWager: number;
  maxWager: number;
  currentMultiplier: number;
  currentCashoutAmount: number;
};

export const ManualController: React.FC<Props> = ({
  minWager,
  maxWager,
  currentCashoutAmount,
  currentMultiplier,
}) => {
  const form = useFormContext() as MinesForm;
  const { gameStatus, updateMinesGameState, board } = useMinesGameStateStore([
    'gameStatus',
    'updateMinesGameState',
    'board',
  ]);
  const { account } = useGameOptions();

  const { hideWager, hideInfo, tokenPrefix } = useMinesTheme();

  const wager = form.watch('wager');
  const numMines = form.watch('minesCount');

  const maxPayout = React.useMemo(() => {
    const currentScheme = mineMultipliers.filter((scheme: any) => scheme.numOfMines === numMines);

    if (currentScheme.length === 0) return 0;

    const largestReveal = currentScheme?.reduce((max: any, obj: any) => {
      return obj.reveal > max.reveal ? obj : max;
    });

    const largestMultiplier = toDecimals(Number(largestReveal.multiplier) / 10000, 2);

    return toDecimals(wager * largestMultiplier, 2);
  }, [wager, numMines]);

  const hasSomeMinesRevealed = React.useMemo(() => {
    return board.some((cell: any) => cell.isSelected && cell.isRevealed);
  }, [board]);

  return (
    <div className="wr-flex wr-flex-col">
      <div>
        {/* <div className="lg:wr-mb-3">
          <BetControllerTitle>Mines</BetControllerTitle>
        </div> */}

        {!hideWager && (
          <WagerFormField
            className="wr-mb-3 lg:wr-mb-6"
            minWager={minWager}
            maxWager={maxWager}
            // isDisabled={gameStatus !== MINES_GAME_STATUS.IDLE}
          />
        )}

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

        <div
          className={cn('lg:!wr-block wr-hidden', {
            'wr-mb-6': hideInfo,
          })}
        >
          <MinesCountDisplay />
        </div>

        {!hideInfo && (
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
        )}

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
            {gameStatus == MINES_GAME_STATUS.IN_PROGRESS && hasSomeMinesRevealed && (
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
                {`${tokenPrefix}${currentCashoutAmount} (${currentMultiplier}x)`}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
