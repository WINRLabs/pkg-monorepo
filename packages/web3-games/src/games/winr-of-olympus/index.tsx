'use client';

import {
  BetHistoryTemplate,
  GameType,
  ReelSpinSettled,
  WinrOfOlympusFormFields,
  WinrOfOlympusTemplate,
} from '@winrlabs/games';
import {
  controllerAbi,
  delay,
  ErrorCode,
  useCurrentAccount,
  usePriceFeed,
  useSendTx,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  winrOfOlympusAbi,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import debug from 'debug';
import React from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import { Badge, useBetHistory, useGetBadges, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import { prepareGameTransaction } from '../utils';

const log = debug('worker:WinrOfOlympusWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  buildedGameUrl: string;
  buildedGameUrlMobile: string;
  hideBetHistory?: boolean;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function WinrOfOlympusGame({
  buildedGameUrl,
  buildedGameUrlMobile,
  hideBetHistory,
  onPlayerStatusUpdate,
  onError,
}: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.winrOfOlympus,
      gameType: 'winr_of_olympus',
      wagmiConfig,
      onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = React.useState<WinrOfOlympusFormFields>({
    betAmount: 1,
    actualBetAmount: 1,
    isDoubleChance: false,
  });

  const gameEvent = useListenGameEvent();

  const iterationTimeoutRef = React.useRef<NodeJS.Timeout>();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();

  const [settledResult, setSettledResult] = React.useState<ReelSpinSettled>();
  const [previousFreeSpinCount, setPreviousFreeSpinCount] = React.useState<number>(0);
  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedToken.address],
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x',
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const getEncodedBetTxData = () => {
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'isDoubleChance', type: 'bool' },
      ],
      [wagerInWei, formValues.isDoubleChance]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrOfOlympus as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });
  };

  const getEncodedBuyFreeSpinTxData = () => {
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters([{ name: 'wager', type: 'uint128' }], [wagerInWei]);

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrOfOlympus as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyFreeSpins',
        encodedGameData,
      ],
    });
  };

  const getEncodedFreeSpinTxData = () =>
    encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrOfOlympus as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'freeSpin',
        '0x',
      ],
    });

  const sendTx = useSendTx();
  const isPlayerHaltedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });

  const checkIsGameIterableAfterTx = () => {
    const t = setTimeout(async () => {
      await playerReIterate();
    }, 3500);

    iterationTimeoutRef.current = t;
  };

  const handleBet = async (errorCount = 0) => {
    log('spin button called!');
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //       log('error', e);
    //     },
    //   });

    //   if (!handledAllowance) return;
    // }

    log('allowance available');

    // await handleTx.mutateAsync();

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedBetTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      refetchPlayerGameStatus();
      // onError && onError(e);
      if (e?.code == ErrorCode.SessionWaitingIteration) {
        log('SESSION WAITING ITERATION');
        checkIsGameIterableAfterTx();
        return;
      }
      if (
        (e?.code == ErrorCode.InvalidInputRpcError || e?.code == ErrorCode.FailedOp) &&
        errorCount < 3
      ) {
        await delay(150);
        handleBet(errorCount + 1);
      }

      throw new Error(e);
    }
  };

  const handleBuyFreeSpins = async (errorCount = 0) => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });
      if (!handledAllowance) return;
    }
    log('buy feature');
    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedBuyFreeSpinTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      refetchPlayerGameStatus();
      if (e?.code == ErrorCode.SessionWaitingIteration) {
        log('SESSION WAITING ITERATION');
        checkIsGameIterableAfterTx();
        return;
      }
      if (
        (e?.code == ErrorCode.InvalidInputRpcError || e?.code == ErrorCode.FailedOp) &&
        errorCount < 3
      ) {
        await delay(150);
        handleBuyFreeSpins(errorCount + 1);
      }
      // onError && onError(e);
    }
  };

  const handleFreeSpin = async (errorCount = 0) => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();
    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //   log("error", e);
    //     },
    //   });
    //   if (!handledAllowance) return;
    // }

    log('handleFreeSpintx called');

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedFreeSpinTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      refetchPlayerGameStatus();
      if (e?.code == ErrorCode.SessionWaitingIteration) {
        log('SESSION WAITING ITERATION');
        checkIsGameIterableAfterTx();
        return;
      }
      if (
        (e?.code == ErrorCode.InvalidInputRpcError || e?.code == ErrorCode.FailedOp) &&
        errorCount < 3
      ) {
        await delay(150);
        handleFreeSpin(errorCount + 1);
      }
    }
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: winrOfOlympusAbi,
    address: gameAddresses.winrOfOlympus as `0x${string}`,
    functionName: 'getPlayerStatus',
    args: [currentAccount.address || '0x0000000'],
    query: {
      enabled: !!currentAccount.address,
    },
  });

  React.useEffect(() => {
    const gameData = gameDataRead.data as any;

    if (gameData) {
      setPreviousFreeSpinCount(gameData.freeSpinCount);
    }
  }, [gameDataRead.data]);

  React.useEffect(() => {
    log(gameEvent, 'GAME EVENT!!');

    if (gameEvent?.program[0]?.type == 'Game' && gameEvent?.program[0].data?.state == 2) {
      const data = gameEvent.program[0].data;
      const betAmount =
        Number(formatUnits(data.wager, selectedToken.decimals)) * priceFeed[selectedToken.priceKey];

      // clearIterationTimeout
      clearTimeout(iterationTimeoutRef.current);

      setSettledResult({
        betAmount: betAmount,
        scatterCount: data.result.scatter,
        tumbleCount: data.result.tumble,
        freeSpinsLeft: data.freeSpinCount,
        payoutMultiplier: data.result.payoutMultiplier / 100,
        grid: data.result.outcomes,
        type: 'Game',
        spinType: data.spinType,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.WINR_BONANZA,
      options: {
        enabled: !hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate,
  });

  const handleRefresh = async () => {
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const wager = settledResult?.betAmount || 0;
    const payoutMultiplier = settledResult?.payoutMultiplier || 0;
    handleGetBadges({
      totalPayout: wager * payoutMultiplier,
      totalWager: wager,
    });
  };

  return (
    <>
      <WinrOfOlympusTemplate
        onRefresh={handleRefresh}
        onFormChange={(val) => setFormValues(val)}
        buildedGameUrl={buildedGameUrl}
        buildedGameUrlMobile={buildedGameUrlMobile}
        bet={handleBet}
        buyFreeSpins={handleBuyFreeSpins}
        freeSpin={handleFreeSpin}
        gameEvent={settledResult as ReelSpinSettled}
        previousFreeSpinCount={previousFreeSpinCount}
      />
      {!hideBetHistory && (
        <BetHistoryTemplate
          betHistory={betHistory || []}
          loading={isHistoryLoading}
          onChangeFilter={(filter) => setHistoryFilter(filter)}
          currencyList={mapHistoryTokens}
        />
      )}
    </>
  );
}