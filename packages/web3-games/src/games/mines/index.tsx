'use client';

import {
  BetHistoryTemplate,
  FormSetValue,
  GameType,
  MINES_GAME_STATUS,
  MINES_SUBMIT_TYPE,
  MinesFormField,
  MinesGameResultOnComplete,
  MinesTemplate,
  MinesTheme,
  toDecimals,
  useMinesGameStateStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  delay,
  ErrorCode,
  minesAbi,
  Token,
  useCurrentAccount,
  usePriceFeed,
  useSendTx,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import debug from 'debug';
import React, { useEffect, useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import { Badge, useBetHistory, useGetBadges, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import { prepareGameTransaction } from '../utils';

const log = debug('worker:MinesWeb3');

enum Status {
  None = 0, // No game
  Awaiting = 1, // Awaiting fill
  Revealed = 2, // filled
  Final = 3, // Game ended
}

interface TemplateWithWeb3Props extends BaseGameProps {
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  onAnimationCompleted?: (result: MinesGameResultOnComplete) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
  theme?: MinesTheme;
}

const MinesTemplateWithWeb3 = ({ ...props }: TemplateWithWeb3Props) => {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.mines,
      gameType: GameType.MINES,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const { priceFeed } = usePriceFeed();

  const selectedTokenAddress = useTokenStore((s) => s.selectedToken);

  const tokens = useTokenStore((s) => s.tokens);

  const [formSetValue, setFormSetValue] = useState<FormSetValue>();

  const [revealCells, setRevealCells] = useState<boolean[]>([]);

  const iterationTimeoutRef = React.useRef<NodeJS.Timeout>();

  const [formValues, setFormValues] = useState<MinesFormField>({
    wager: props?.minWager || 0.01,
    minesCount: 1,
    selectedCells: [],
    betCount: 0,
    stopGain: 0,
    stopLoss: 0,
    increaseOnWin: 0,
    increaseOnLoss: 0,
  });

  const [isWaitingResponse, setIsWaitingResponse] = React.useState<boolean>(false);
  const gameEvent = useListenGameEvent();

  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedTokenAddress.address],
  });

  const { submitType, updateMinesGameState, board, gameStatus } = useMinesGameStateStore([
    'submitType',
    'updateMinesGameState',
    'board',
    'gameStatus',
  ]);

  const currentSubmitType = React.useRef<MINES_SUBMIT_TYPE>(submitType);

  useEffect(() => {
    currentSubmitType.current = submitType;
  }, [submitType]);

  const { data, dataUpdatedAt } = useReadContract({
    abi: minesAbi,
    address: gameAddresses.mines as Address,
    functionName: 'getPlayerStatus',
    args: [currentAccount.address || '0x0'],
    config: wagmiConfig,
    query: {
      enabled: !!currentAccount.address,
    },
  });

  useEffect(() => {
    if (!data || data.status === Status.Final) return;

    if (data.numMines !== 0) {
      const newBoard = data.revealedCells.map((cell) => {
        return {
          isSelected: cell,
          isBomb: false,
          isRevealed: cell,
        };
      });

      const initialToken = tokens.find((t) => t.bankrollIndex == data.bankroll) as Token;
      const wagerInGameCurrency = formatUnits(data.wager, initialToken.decimals);

      const wager = Number(wagerInGameCurrency) * priceFeed[initialToken.priceKey];

      const _wager = wager < 1 ? Math.ceil(wager) : wager;

      setFormSetValue({ key: 'wager', value: toDecimals(_wager, 2) });

      setFormSetValue({
        key: 'selectedCells',
        value: newBoard.map((cell) => cell.isSelected),
      });

      setFormSetValue({ key: 'minesCount', value: data?.numMines });

      updateMinesGameState({
        board: newBoard,
        gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
      });
    }
  }, [dataUpdatedAt]);

  const sendTx = useSendTx();

  const handleCashout = async () => {
    const encodedTxData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.mines as Address,
        selectedTokenAddress.bankrollIndex,
        uiOperatorAddress as Address,
        'endGame',
        '0x',
      ],
    });

    await sendTx.mutateAsync({
      encodedTxData,
      target: controllerAddress,
      method: 'sendGameOperation',
    });
  };

  const handleFirstReveal = async (values: MinesFormField) => {
    const { wagerInWei } = prepareGameTransaction({
      wager: values.wager,
      selectedCurrency: selectedTokenAddress,
      lastPrice: priceFeed[selectedTokenAddress.priceKey],
    });

    log(values.selectedCells, 'selectedCells');

    const encodedFirstRevealGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'numMines', type: 'uint8' },
        { name: 'cellsPicked', type: 'bool[25]' },
        { name: 'isCashout', type: 'bool' },
      ],
      [
        wagerInWei,
        values.minesCount,
        values.selectedCells.length ? values.selectedCells : (Array(25).fill(false) as any),
        currentSubmitType.current === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
      ]
    );

    const encodedTxData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.mines as Address,
        selectedTokenAddress.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedFirstRevealGameData,
      ],
    });

    await sendTx.mutateAsync({
      encodedTxData,
      target: controllerAddress,
      method: 'sendGameOperation',
    });
  };

  const handleReveal = async (values: MinesFormField, revealCells: boolean[]) => {
    log(revealCells, 'revealcells');

    const encodedRevealGameData = encodeAbiParameters(
      [
        { name: 'cellsPicked', type: 'bool[25]' },
        { name: 'isCashout', type: 'bool' },
      ],
      [
        revealCells.length ? revealCells : (Array(25).fill(false) as any),
        currentSubmitType.current === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
      ]
    );

    const encodedRevealTxData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.mines as Address,
        selectedTokenAddress.bankrollIndex,
        uiOperatorAddress as Address,
        'revealCells',
        encodedRevealGameData,
      ],
    });

    await sendTx.mutateAsync({
      encodedTxData: encodedRevealTxData,
      target: controllerAddress,
      method: 'sendGameOperation',
    });
  };

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress.address,
    showDefaultToasts: false,
  });

  const isPlayerHaltedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });

  const onGameSubmit = async (values: MinesFormField, errorCount = 0) => {
    if (selectedTokenAddress.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    setIsWaitingResponse(true);
    log(values, 'form values');

    try {
      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            log('error', e);
          },
        });

        if (!handledAllowance) return;
      }
      log('submit Type:', submitType);

      if (isPlayerHaltedRef.current) await playerLevelUp();

      if (currentSubmitType.current === MINES_SUBMIT_TYPE.FIRST_REVEAL) {
        await handleFirstReveal(values);

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
        updateBalances();
      } else if (currentSubmitType.current === MINES_SUBMIT_TYPE.REVEAL) {
        const revealedCells = board.map((cell, idx) => {
          return cell.isRevealed ? false : values.selectedCells[idx];
        });

        setRevealCells(revealedCells as boolean[]);

        await handleReveal(values, revealedCells as boolean[]);

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
        updateBalances();
      } else if (currentSubmitType.current === MINES_SUBMIT_TYPE.CASHOUT) {
        await handleCashout();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      } else if (currentSubmitType.current === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT) {
        await handleFirstReveal(values);

        // updateMinesGameState({
        //   gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        // });

        // setTimeout(async () => {
        //   updateMinesGameState({
        //     submitType: MINES_SUBMIT_TYPE.CASHOUT,
        //   });
        //   await handleCashout();

        //   updateMinesGameState({
        //     gameStatus: MINES_GAME_STATUS.ENDED,
        //   });
        // }, 1000);
      }
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      setIsWaitingResponse(false);
      // props.onError && props.onError(e);
      if (e?.code == ErrorCode.SessionWaitingIteration) {
        log('SESSION WAITING ITERATION');
        checkIsGameIterableAfterTx();
        return;
      }

      if (e?.code == ErrorCode.DailyLimitExceeded && errorCount == 0) {
        props.onError && props.onError(e);
        return;
      }

      if (
        (e?.code == ErrorCode.InvalidInputRpcError || e?.code == ErrorCode.FailedOp) &&
        errorCount < 3
      ) {
        await delay(150);
        onGameSubmit(values, errorCount + 1);
      }
    }
  };

  const checkIsGameIterableAfterTx = () => {
    const t = setTimeout(async () => {
      await playerReIterate();
    }, 3500);

    iterationTimeoutRef.current = t;
  };

  useEffect(() => {
    if (!gameEvent) return;

    const gameData = gameEvent.program[0]?.data;

    // clearIterationTimeout
    clearTimeout(iterationTimeoutRef.current);

    if (gameData.status === Status.Final) {
      const hasMine = gameData.mines?.some((cell: boolean) => cell === true);

      const mineIndex = gameData.mines.findIndex((cell: boolean) => cell === true);

      if (hasMine) {
        const newBoard = gameData.revealedCells.map((cell: boolean, idx: number) => {
          return {
            isSelected: cell,
            isBomb: idx === mineIndex,
            isRevealed: cell,
          };
        });

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
          board: newBoard,
        });
      } else {
        const newBoard = gameData.revealedCells.map((cell: boolean) => {
          return {
            isSelected: cell,
            isBomb: false,
            isRevealed: cell,
          };
        });

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
          board: newBoard,
        });

        log('Congrats! You win!!!');
      }
      setIsWaitingResponse(false);
    } else {
      if (gameStatus === MINES_GAME_STATUS.ENDED) return;

      const hasMine = gameData?.mines?.some((cell: boolean) => cell === true);

      const mineIndex = gameData.mines.findIndex((cell: boolean) => cell === true);

      if (hasMine) {
        const newBoard = gameData.revealedCells.map((cell: boolean, idx: number) => {
          return {
            isSelected: cell,
            isBomb: idx === mineIndex,
            isRevealed: cell,
          };
        });

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
          board: newBoard,
        });

        log('OOPS You hit a mine');
      } else {
        const newBoard = gameData.revealedCells.map((cell: boolean) => {
          return {
            isSelected: cell,
            isBomb: false,
            isRevealed: cell,
          };
        });

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
          board: newBoard,
        });

        setIsWaitingResponse(false);
      }
    }
  }, [gameEvent]);

  // log("gameEvent:", gameEvent);
  // log("getPlayerStatus:", data);
  // log(
  //   "isCashout:",
  //   submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false
  // );

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.MINES,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onGameCompleted = (result: MinesGameResultOnComplete) => {
    props.onAnimationCompleted && props.onAnimationCompleted(result);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    handleGetBadges({
      totalPayout: result.won ? result.currentCashoutAmount : 0,
      totalWager: formValues.wager,
    });
  };

  return (
    <>
      <MinesTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={[]}
        onAnimationCompleted={onGameCompleted}
        formSetValue={formSetValue}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        minWager={props?.minWager || 0.01}
        maxWager={props.maxWager}
        isLoading={isWaitingResponse}
        theme={props.theme}
      />
      {!props.hideBetHistory && (
        <BetHistoryTemplate
          betHistory={betHistory || []}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
};

export default MinesTemplateWithWeb3;
