'use client';

import {
  BetHistoryTemplate,
  GameType,
  ReelSpinSettled,
  WinrBonanzaFormFields,
  WinrBonanzaTemplate,
} from '@winrlabs/games';
import {
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useNativeTokenBalance,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  winrBonanzaAbi,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import React from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import { Badge, useBetHistory, useGetBadges, usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import { prepareGameTransaction } from '../utils';

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

export default function WinrBonanzaTemplateWithWeb3({
  buildedGameUrl,
  buildedGameUrlMobile,
  hideBetHistory,
  onPlayerStatusUpdate,
  onError,
}: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.winrBonanza,
      gameType: GameType.WINR_BONANZA,
      wagmiConfig,
      onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = React.useState<WinrBonanzaFormFields>({
    betAmount: 1,
    actualBetAmount: 1,
    isDoubleChance: false,
  });

  const gameEvent = useListenGameEvent();

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

  const encodedParams = React.useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
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

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [
    formValues.isDoubleChance,
    formValues.betAmount,
    selectedToken.address,
    priceFeed[selectedToken.priceKey],
  ]);

  const encodedBuyFreeSpinParams = React.useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters([{ name: 'wager', type: 'uint128' }], [wagerInWei]);

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyFreeSpins',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [formValues.betAmount, selectedToken.address, priceFeed[selectedToken.priceKey]]);

  const encodedFreeSpinParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.betAmount,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'freeSpin',
        '0x',
      ],
    });

    return {
      tokenAddress,
      encodedTxData: encodedData,
    };
  }, [formValues.betAmount, selectedToken.address, priceFeed[selectedToken.priceKey]]);

  const handleTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedParams.encodedTxData,
  });

  const handleBuyFeatureTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyFreeSpins',
        encodedBuyFreeSpinParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedBuyFreeSpinParams.encodedTxData,
  });

  const handleFreeSpinTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.winrBonanza as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'freeSpin',
        encodedFreeSpinParams.encodedTxData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedFreeSpinParams.encodedTxData,
  });

  const isPlayerHaltedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });

  const handleBet = async (errorCount = 0) => {
    console.log('spin button called!');
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //       console.log("error", e);
    //     },
    //   });

    //   if (!handledAllowance) return;
    // }

    console.log('allowance available');

    // await handleTx.mutateAsync();

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleTx.mutateAsync();
    } catch (e: any) {
      refetchPlayerGameStatus();
      if (errorCount < 10) handleBet(errorCount + 1);
      // onError && onError(e);
      throw new Error(e);
    }
  };

  const handleBuyFreeSpins = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log('error', e);
        },
      });
      if (!handledAllowance) return;
    }
    console.log('buy feature');
    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleBuyFeatureTx.mutateAsync();
    } catch (e) {
      refetchPlayerGameStatus();
      // onError && onError(e);
    }
  };

  const handleFreeSpin = async (errorCount = 0) => {
    // if (!allowance.hasAllowance) {
    //   const handledAllowance = await allowance.handleAllowance({
    //     errorCb: (e: any) => {
    //       console.log("error", e);
    //     },
    //   });
    //   if (!handledAllowance) return;
    // }

    console.log('handleFreeSpintx called');

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleFreeSpinTx.mutateAsync();
    } catch (e: any) {
      refetchPlayerGameStatus();
      if (errorCount < 10) handleFreeSpin(errorCount + 1);
    }
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: winrBonanzaAbi,
    address: gameAddresses.winrBonanza as `0x${string}`,
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
    console.log(gameEvent, 'GAME EVENT!!');

    if (gameEvent?.program[0]?.type == 'Game' && gameEvent?.program[0].data?.state == 2) {
      const data = gameEvent.program[0].data;
      const betAmount =
        Number(formatUnits(data.wager, selectedToken.decimals)) * priceFeed[selectedToken.priceKey];

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
      <WinrBonanzaTemplate
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
