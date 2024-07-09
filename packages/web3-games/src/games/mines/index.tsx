"use client";

import {
  FormSetValue,
  MINES_GAME_STATUS,
  MINES_SUBMIT_TYPE,
  MinesFormField,
  MinesGameResult,
  MinesTemplate,
  toDecimals,
  useMinesGameStateStore,
} from "@winrlabs/games";
import {
  controllerAbi,
  minesAbi,
  useCurrentAccount,
  useHandleTx,
  useTokenAllowance,
} from "@winrlabs/web3";
import { useEffect, useMemo, useState } from "react";
import { useContractConfigContext } from "../hooks/use-contract-config";
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  decodeAbiParameters,
} from "viem";
import { useReadContract } from "wagmi";
import { prepareGameTransaction } from "../utils";
import { useListenGameEvent } from "../hooks/use-listen-game-event";

interface TemplateWithWeb3Props {
  minWager?: number;
  maxWager?: number;
  onAnimationCompleted?: (result: MinesGameResult[]) => void;
}

const MinesTemplateWithWeb3 = ({ ...props }: TemplateWithWeb3Props) => {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
    selectedTokenAddress,
    wagmiConfig,
  } = useContractConfigContext();

  const [formSetValue, setFormSetValue] = useState<FormSetValue>();

  const [revealCells, setRevealCells] = useState<boolean[]>([]);

  const [formValues, setFormValues] = useState<MinesFormField>({
    wager: 1,
    minesCount: 1,
    selectedCells: [],
  });

  const gameEvent = useListenGameEvent();

  const currentAccount = useCurrentAccount();

  const { submitType, updateMinesGameState, board, gameStatus } =
    useMinesGameStateStore([
      "submitType",
      "updateMinesGameState",
      "board",
      "gameStatus",
    ]);

  const { data, dataUpdatedAt } = useReadContract({
    abi: minesAbi,
    address: gameAddresses.mines as Address,
    functionName: "getPlayerStatus",
    args: [currentAccount.address || "0x0"],
    config: wagmiConfig,
    query: {
      enabled: !!currentAccount.address,
    },
  });

  useEffect(() => {
    if (!data || data.status === 3) return;

    if (data.numMines !== 0) {
      const newBoard = data.revealedCells.map((cell) => {
        return {
          isSelected: cell,
          isBomb: false,
          isRevealed: cell,
        };
      });
      // FIX ME
      const wagerInGameCurrency = formatUnits(data.wager, 18);

      // LAST PRICE SET 1

      const wager = Number(wagerInGameCurrency) * 1;

      const _wager = wager < 1 ? Math.ceil(wager) : wager;

      setFormSetValue({ key: "wager", value: toDecimals(_wager, 2) });

      setFormSetValue({
        key: "selectedCells",
        value: newBoard.map((cell) => cell.isSelected),
      });

      setFormSetValue({ key: "minesCount", value: data?.numMines });

      updateMinesGameState({
        board: newBoard,
        gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
      });
    }
  }, [dataUpdatedAt]);

  const encodedParams = useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedTokenAddress,
      lastPrice: 1,
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: "wager", type: "uint128" },
        { name: "numMines", type: "uint8" },
        { name: "cellsPicked", type: "bool[25]" },
        { name: "isCashout", type: "bool" },
      ],
      [
        wagerInWei,
        formValues.minesCount,
        formValues.selectedCells.length
          ? formValues.selectedCells
          : (Array(25).fill(false) as any),
        submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
      ]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "bet",
        encodedGameData,
      ],
    });

    const encodedCashoutData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "endGame",
        "0x",
      ],
    });

    const encodedRevealCellData = encodeAbiParameters(
      [
        { name: "cellsPicked", type: "bool[25]" },
        { name: "isCashout", type: "bool" },
      ],
      [
        revealCells.length ? revealCells : (Array(25).fill(false) as any),
        submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
      ]
    );

    const encodedTxRevealCellData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines as Address,
        tokenAddress,
        uiOperatorAddress as Address,
        "revealCells",
        encodedRevealCellData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
      encodedRevealCellData,
      encodedTxRevealCellData,
      encodedCashoutData,
    };
  }, [
    formValues.minesCount,
    formValues.selectedCells,
    formValues.wager,
    submitType,
    revealCells,
  ]);

  const handleTx = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "bet",
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxData,
  });

  const handleCashout = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "endGame",
        "0x",
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedCashoutData,
  });

  const handleReveal = useHandleTx<typeof controllerAbi, "perform">({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: "perform",
      args: [
        gameAddresses.mines,
        encodedParams.tokenAddress,
        uiOperatorAddress as Address,
        "revealCells",
        encodedParams.encodedRevealCellData,
      ],
      address: controllerAddress as Address,
    },
    options: {},
    encodedTxData: encodedParams.encodedTxRevealCellData,
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress as Address,
    showDefaultToasts: false,
  });

  const onGameSubmit = async (values: any) => {
    try {
      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            console.log("error", e);
          },
        });

        if (!handledAllowance) return;
      }
      console.log("submit Type:", submitType);

      if (submitType === MINES_SUBMIT_TYPE.FIRST_REVEAL) {
        await handleTx.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT) {
        await handleTx.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.REVEAL) {
        const revealedCells = board.map((cell, idx) => {
          return cell.isRevealed ? false : values.selectedCells[idx];
        });

        setRevealCells(revealedCells as boolean[]);

        console.log(
          "decodedAbiParams",
          decodeAbiParameters(
            [
              { name: "cellsPicked", type: "bool[25]" },
              { name: "isCashout", type: "bool" },
            ],
            encodedParams.encodedRevealCellData
          )
        );
        await handleReveal.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.CASHOUT) {
        await handleCashout.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (!gameEvent) return;

    const gameData = gameEvent.program[0]?.data;

    if (gameData.status === 3) {
      const hasMine = gameData.mines?.some((cell: boolean) => cell === true);

      const mineIndex = gameData.mines.findIndex(
        (cell: boolean) => cell === true
      );

      if (hasMine) {
        const newBoard = gameData.revealedCells.map(
          (cell: boolean, idx: number) => {
            return {
              isSelected: cell,
              isBomb: idx === mineIndex,
              isRevealed: cell,
            };
          }
        );

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

        console.log("Congrats! You win!!!");
      }
    } else {
      if (gameStatus === MINES_GAME_STATUS.ENDED) return;

      const hasMine = gameData?.mines?.some((cell: boolean) => cell === true);

      const mineIndex = gameData.mines.findIndex(
        (cell: boolean) => cell === true
      );

      if (hasMine) {
        const newBoard = gameData.revealedCells.map(
          (cell: boolean, idx: number) => {
            return {
              isSelected: cell,
              isBomb: idx === mineIndex,
              isRevealed: cell,
            };
          }
        );

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
          board: newBoard,
        });

        console.log("OOPS You hit a mine");
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
      }
    }
  }, [gameEvent]);

  console.log("gameEvent:", gameEvent);
  console.log("getPlayerStatus:", data);
  console.log(
    "isCashout:",
    submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false
  );
  return (
    <div>
      <button onClick={() => setFormSetValue({ key: "minesCount", value: 10 })}>
        form set value
      </button>
      <button onClick={async () => await handleReveal.mutateAsync()}>
        Reveal cell
      </button>
      <button onClick={async () => await handleCashout.mutateAsync()}>
        cashout
      </button>
      <MinesTemplate
        {...props}
        onSubmitGameForm={onGameSubmit}
        gameResults={[]}
        formSetValue={formSetValue}
        onFormChange={(val) => {
          setFormValues(val);
        }}
        minWager={props.minWager}
        maxWager={props.maxWager}
      />
    </div>
  );
};

export default MinesTemplateWithWeb3;
