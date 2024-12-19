'use client';

import {
  BetHistoryTemplate,
  GameType,
  ReelSpinSettled,
  WinrBonanza1000Template,
  WinrBonanzaFormFields,
} from '@winrlabs/games';
import {
  controllerAbi,
  generateCommitmentHash,
  useCurrentAccount,
  usePriceFeed,
  useSendTx,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  winrBonanza1000Abi,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import debug from 'debug';
import React from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import {
  Badge,
  RETRY_ATTEMPTS,
  useBetHistory,
  useGetBadges,
  usePlayerGameStatus,
  useRetryLogic,
} from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import { prepareGameTransaction } from '../utils';

const log = debug('worker:WinrBonanzaWeb3');

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

export default function WinrBonanza1000TemplateWithWeb3({
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
      gameAddress: gameAddresses.winrBonanza1000,
      gameType: GameType.WINR_BONANZA_1000,
      wagmiConfig,
      onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = React.useState<WinrBonanzaFormFields>({
    betAmount: 1,
    actualBetAmount: 1,
    isDoubleChance: false,
  });

  const gameEvent = useListenGameEvent(gameAddresses.winrBonanza1000);

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { getTokenPrice } = usePriceFeed();

  const [settledResult, setSettledResult] = React.useState<ReelSpinSettled>();
  const [previousFreeSpinCount, setPreviousFreeSpinCount] = React.useState<number>(0);
  const [previousFreeSpinWinnings, setPreviousFreeSpinWinnings] = React.useState<number>(0);

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
      lastPrice: getTokenPrice(selectedToken.priceKey),
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
        gameAddresses.winrBonanza1000 as Address,
        generateCommitmentHash(),
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
      lastPrice: getTokenPrice(selectedToken.priceKey),
    });

    const encodedGameData = encodeAbiParameters([{ name: 'wager', type: 'uint128' }], [wagerInWei]);

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza1000 as Address,
        generateCommitmentHash(),
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyFreeSpins',
        encodedGameData,
      ],
    });
  };

  const getEncodedBuySuperFreeSpinTxData = () => {
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedToken,
      lastPrice: getTokenPrice(selectedToken.priceKey),
    });

    const encodedGameData = encodeAbiParameters([{ name: 'wager', type: 'uint128' }], [wagerInWei]);

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza1000 as Address,
        generateCommitmentHash(),
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buySuperFreeSpins',
        encodedGameData,
      ],
    });
  };

  const getEncodedFreeSpinTxData = () =>
    encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza1000 as Address,
        generateCommitmentHash(),
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'freeSpin',
        '0x',
      ],
    });

  const getEncodedSuperFreeSpinTxData = () =>
    encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza1000 as Address,
        generateCommitmentHash(),
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'superFreeSpin',
        '0x',
      ],
    });

  const sendTx = useSendTx();
  const isPlayerHaltedRef = React.useRef<boolean>(false);
  const hasAllowance = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  React.useEffect(() => {
    hasAllowance.current = allowance.hasAllowance || false;
  }, [allowance.hasAllowance]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });
  const handleBet = async (errCount = 0) => {
    log('spin button called!');
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    if (!hasAllowance.current) {
      await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });
    }

    log('allowance:', hasAllowance.current);

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedBetTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });

      handleErrorLogicBet({}, RETRY_ATTEMPTS - 2 + errCount, null, 2000);
    } catch (e: any) {
      handleErrorLogicBet({}, errCount, e);
      throw new Error(e);
    }
  };

  const {
    handleErrorLogic: handleErrorLogicBet,
    clearIterationIntervals: clearIterationIntervalsBet,
  } = useRetryLogic<any>({
    onSubmit: (v, errCount) => handleBet(errCount),
    playerReIterate,
    cb: () => refetchPlayerGameStatus(),
  });

  const handleBuyFreeSpins = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    if (!hasAllowance.current) {
      await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });
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
      // onError && onError(e);
    }
  };

  const handleBuySuperFreeSpins = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    if (!hasAllowance.current) {
      await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });
    }
    log('buy super feature');

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedBuySuperFreeSpinTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      refetchPlayerGameStatus();
    }
  };

  const handleFreeSpin = async (errCount = 0) => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();
    if (!hasAllowance.current) {
      await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });
    }

    log('handleFreeSpintx called');

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedFreeSpinTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });

      handleErrorLogicFreeSpin({}, RETRY_ATTEMPTS - 2 + errCount, null, 2000);
    } catch (e: any) {
      handleErrorLogicFreeSpin({}, errCount, e);
      throw new Error(e);
    }
  };

  const {
    handleErrorLogic: handleErrorLogicFreeSpin,
    clearIterationIntervals: clearIterationIntervalsFreeSpin,
  } = useRetryLogic<any>({
    onSubmit: (v, errCount) => handleFreeSpin(errCount),
    playerReIterate,
    cb: () => refetchPlayerGameStatus(),
  });

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: winrBonanza1000Abi,
    address: gameAddresses.winrBonanza1000 as `0x${string}`,
    functionName: 'getPlayerStatus',
    args: [currentAccount.address || '0x0000000'],
    query: {
      enabled: !!currentAccount.address,
    },
  });

  React.useEffect(() => {
    const gameData = gameDataRead.data;

    if (gameData) {
      setPreviousFreeSpinCount(gameData.freeSpinCount);
      setPreviousFreeSpinWinnings((gameData?.bufferedFreeSpinWinnings || 0) / 100);
    }
  }, [gameDataRead.data]);

  React.useEffect(() => {
    log(gameEvent, 'GAME EVENT!!');

    if (gameEvent?.program[0]?.type == 'Game' && gameEvent?.program[0].data?.state == 2) {
      const data = gameEvent.program[0].data;
      const betAmount =
        Number(formatUnits(data.wager, selectedToken.decimals)) *
        getTokenPrice(selectedToken.priceKey);

      clearIterationIntervalsFreeSpin();
      clearIterationIntervalsBet();

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

  const onAutoBetModeChange = () => {
    clearIterationIntervalsFreeSpin();
    clearIterationIntervalsBet();
  };

  return (
    <>
      <WinrBonanza1000Template
        onRefresh={handleRefresh}
        onFormChange={(val) => setFormValues(val)}
        buildedGameUrl={buildedGameUrl}
        buildedGameUrlMobile={buildedGameUrlMobile}
        bet={handleBet}
        buyFreeSpins={handleBuyFreeSpins}
        buySuperFreeSpins={handleBuySuperFreeSpins}
        freeSpin={handleFreeSpin}
        gameEvent={settledResult as ReelSpinSettled}
        previousFreeSpinCount={previousFreeSpinCount}
        previousFreeSpinWinnings={previousFreeSpinWinnings}
        onAutoBetModeChange={onAutoBetModeChange}
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