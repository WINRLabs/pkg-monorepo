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
  toDecimals,
  useMinesGameStateStore,
} from '@winrlabs/games';
import {
  controllerAbi,
  minesAbi,
  Token,
  useCurrentAccount,
  useHandleTxUncached,
  useNativeTokenBalance,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
} from '@winrlabs/web3';
import React, { useEffect, useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import { Badge, useBetHistory, useGetBadges, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import { prepareGameTransaction } from '../utils';

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
}

const MinesTemplateWithWeb3 = ({ ...props }: TemplateWithWeb3Props) => {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
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

  const [formValues, setFormValues] = useState<MinesFormField>({
    wager: props?.minWager || 1,
    minesCount: 1,
    selectedCells: [],
  });

  const [isWaitingResponse, setIsWaitingResponse] = React.useState<boolean>(false);

  const gameEvent = useListenGameEvent();

  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
  });

  const { submitType, updateMinesGameState, board, gameStatus } = useMinesGameStateStore([
    'submitType',
    'updateMinesGameState',
    'board',
    'gameStatus',
  ]);

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

  const handlePerformTx = useHandleTxUncached<typeof controllerAbi, 'perform'>({
    options: {
      method: 'sendGameOperation',
    },
  });

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

    await handlePerformTx.mutateAsync({
      encodedTxData,
      writeContractVariables: {
        abi: controllerAbi,
        functionName: 'perform',
        args: [
          gameAddresses.mines,
          selectedTokenAddress.bankrollIndex,
          uiOperatorAddress as Address,
          'endGame',
          '0x',
        ],
        address: controllerAddress as Address,
      },
    });
  };

  const handleFirstReveal = async (values: MinesFormField) => {
    const { wagerInWei } = prepareGameTransaction({
      wager: values.wager,
      selectedCurrency: selectedTokenAddress,
      lastPrice: priceFeed[selectedTokenAddress.priceKey],
    });

    console.log(values.selectedCells, 'selectedCells');

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
        submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
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

    await handlePerformTx.mutateAsync({
      encodedTxData,
      writeContractVariables: {
        abi: controllerAbi,
        functionName: 'perform',
        args: [
          gameAddresses.mines,
          selectedTokenAddress.bankrollIndex,
          uiOperatorAddress as Address,
          'bet',
          encodedFirstRevealGameData,
        ],
        address: controllerAddress as Address,
      },
    });
  };

  const handleReveal = async (values: MinesFormField, revealCells: boolean[]) => {
    console.log(revealCells, 'revealcells');

    const encodedRevealGameData = encodeAbiParameters(
      [
        { name: 'cellsPicked', type: 'bool[25]' },
        { name: 'isCashout', type: 'bool' },
      ],
      [
        revealCells.length ? revealCells : (Array(25).fill(false) as any),
        submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
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

    await handlePerformTx.mutateAsync({
      encodedTxData: encodedRevealTxData,
      writeContractVariables: {
        abi: controllerAbi,
        functionName: 'perform',
        args: [
          gameAddresses.mines,
          selectedTokenAddress.bankrollIndex,
          uiOperatorAddress as Address,
          'revealCells',
          encodedRevealGameData,
        ],
        address: controllerAddress as Address,
      },
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

  const nativeWinr = useNativeTokenBalance({ account: currentAccount.address || '0x' });
  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
    amount: nativeWinr.balance,
    spender: cashierAddress,
  });

  const onGameSubmit = async (values: MinesFormField) => {
    if (nativeWinr.balance > 0) await wrapWinrTx();

    setIsWaitingResponse(true);
    console.log(values, 'form values');

    try {
      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            console.log('error', e);
          },
        });

        if (!handledAllowance) return;
      }
      console.log('submit Type:', submitType);
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      if (submitType === MINES_SUBMIT_TYPE.FIRST_REVEAL) {
        await handleFirstReveal(values);

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
        updateBalances();
      } else if (submitType === MINES_SUBMIT_TYPE.REVEAL) {
        const revealedCells = board.map((cell, idx) => {
          return cell.isRevealed ? false : values.selectedCells[idx];
        });

        setRevealCells(revealedCells as boolean[]);

        await handleReveal(values, revealedCells as boolean[]);

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
        updateBalances();
      } else if (submitType === MINES_SUBMIT_TYPE.CASHOUT) {
        await handleCashout();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      }
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
      setIsWaitingResponse(false);
      // props.onError && props.onError(e);
    }
  };

  useEffect(() => {
    if (!gameEvent) return;

    const gameData = gameEvent.program[0]?.data;

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

        console.log('Congrats! You win!!!');
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

        console.log('OOPS You hit a mine');
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

  // console.log("gameEvent:", gameEvent);
  // console.log("getPlayerStatus:", data);
  // console.log(
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
        minWager={props.minWager}
        maxWager={props.maxWager}
        isLoading={isWaitingResponse}
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
