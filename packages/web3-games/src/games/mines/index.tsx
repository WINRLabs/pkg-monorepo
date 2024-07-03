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

  const [formValues, setFormValues] = useState<MinesFormField>({
    wager: 1,
    minesCount: 1,
    selectedCells: [],
  });

  const currentAccount = useCurrentAccount();

  const { submitType, updateMinesGameState, board } = useMinesGameStateStore([
    "submitType",
    "updateMinesGameState",
    "board",
  ]);

  const { data, dataUpdatedAt } = useReadContract({
    abi: minesAbi,
    address: gameAddresses.mines as Address,
    functionName: "getGame",
    args: [currentAccount.address || "0x0"],
    config: wagmiConfig,
    query: {
      enabled: !!currentAccount.address,
    },
  });

  console.log("getGame:", data);
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

  const gameEvent = useListenGameEvent();

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
        submitType === MINES_SUBMIT_TYPE.CASHOUT ||
        MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT ||
        MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT
          ? true
          : false,
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
        formValues.selectedCells.length
          ? formValues.selectedCells
          : (Array(25).fill(false) as any),
        submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false,
      ]
    );

    console.log(
      "encodedReveal",
      encodedRevealCellData,
      formValues.selectedCells.length
        ? formValues.selectedCells
        : (Array(25).fill(false) as any),
      submitType === MINES_SUBMIT_TYPE.REVEAL_AND_CASHOUT ? true : false
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

  const onGameSubmit = async () => {
    try {
      if (!allowance.hasAllowance) {
        const handledAllowance = await allowance.handleAllowance({
          errorCb: (e: any) => {
            console.log("error", e);
          },
        });

        console.log("handle allowance", handledAllowance);

        if (!handledAllowance) return;
      }
      if (submitType === MINES_SUBMIT_TYPE.FIRST_REVEAL) {
        console.log("submit Type:", MINES_SUBMIT_TYPE.FIRST_REVEAL);
        await handleTx.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT) {
        console.log(
          "revealing and cashing out",
          MINES_SUBMIT_TYPE.FIRST_REVEAL_AND_CASHOUT
        );

        await handleReveal.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.REVEAL) {
        console.log("submit Type:", submitType);

        const revealedCells = board.map((cell, idx) => {
          return cell.isRevealed ? false : formValues.selectedCells[idx];
        });

        await handleReveal.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.IN_PROGRESS,
        });
      } else if (submitType === MINES_SUBMIT_TYPE.CASHOUT) {
        console.log("submit Type:", submitType);

        await handleCashout.mutateAsync();

        updateMinesGameState({
          gameStatus: MINES_GAME_STATUS.ENDED,
        });
      }
    } catch (e: any) {
      console.log("error", e);
    }
  };

  console.log("gameEvent:", gameEvent);
  // console.log("contract read data", data, gameAddresses.mines);

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
