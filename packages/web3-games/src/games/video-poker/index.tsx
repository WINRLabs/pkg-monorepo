'use client';

import {
  BetHistoryTemplate,
  GameType,
  VideoPokerFormFields,
  VideoPokerResult,
  VideoPokerStatus,
  VideoPokerTemplate,
} from '@winrlabs/games';
import {
  controllerAbi,
  useCurrentAccount,
  usePriceFeed,
  useSendTx,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  videoPokerAbi,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import React from 'react';
import { Address, encodeAbiParameters, encodeFunctionData } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import {
  Badge,
  useBetHistory,
  useGetBadges,
  useListenGameEvent,
  usePlayerGameStatus,
} from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { prepareGameTransaction } from '../utils';
import debug from 'debug';

const log = debug('worker:VideoPokerWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  onAnimationCompleted?: (payout: number) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export default function VideoPokerGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.videoPoker,
      gameType: GameType.VIDEO_POKER,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const [formValues, setFormValues] = React.useState<VideoPokerFormFields>({
    wager: props?.minWager || 1,
    cardsToSend: [0, 0, 0, 0, 0],
  });
  const [settledCards, setSettledCards] = React.useState<{
    status: VideoPokerStatus;
    cards: number;
    result: VideoPokerResult;
    payout: number;
  }>();

  const gameEvent = useListenGameEvent();
  const currentAccount = useCurrentAccount();
  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { priceFeed } = usePriceFeed();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedToken.address],
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const getEncodedStartTxData = () => {
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: 0,
      stopLoss: 0,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters([{ name: 'wager', type: 'uint128' }], [wagerInWei]);

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.videoPoker as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'start',
        encodedGameData,
      ],
    });
  };

  const getEncodedFinishTxData = () => {
    const mappedCards = formValues.cardsToSend
      .map((item) => (item === 0 ? 1 : 0))
      .reverse()
      .join('');

    const _cardsToSend = parseInt(mappedCards, 2);

    const encodedGameData = encodeAbiParameters(
      [{ name: 'change', type: 'uint32' }],
      [_cardsToSend]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.videoPoker as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'finish',
        encodedGameData,
      ],
    });
  };

  const sendTx = useSendTx();
  const isPlayerHaltedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
  }, [isPlayerHalted]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });

  const handleStartGame = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    log('SUBMITTING!');
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedStartTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
  };

  const handleFinishGame = async () => {
    log('FINISHING!');
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedFinishTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
  };

  const gameRead = useReadContract({
    config: wagmiConfig,
    abi: videoPokerAbi,
    address: gameAddresses.videoPoker,
    account: currentAccount.address,
    functionName: 'games',
    args: [currentAccount.address as Address],
    query: {
      enabled: !!currentAccount.address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });

  const activeGameData = React.useMemo(
    () => ({
      status: (gameRead.data?.[0] || 0) as unknown as VideoPokerStatus,
      cards: gameRead.data?.[1] || 0,
      hasActiveGame: !!(gameRead.data?.[0] == 2),
    }),
    [gameRead.dataUpdatedAt]
  );

  React.useEffect(() => {
    if (!gameEvent) return;

    if (gameEvent?.program[0]?.type == 'Game') {
      const data = gameEvent.program[0].data;

      log('event');

      setSettledCards({
        cards: data.game.cards,
        status: data.game.status,
        result: data.detail.win,
        payout: data.detail.payout,
      });
    }
  }, [gameEvent]);

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.VIDEO_POKER,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const onGameCompleted = (payout: number) => {
    props.onAnimationCompleted && props.onAnimationCompleted(payout);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    const totalPayout =
      (settledCards?.result !== VideoPokerResult.LOST ? settledCards?.payout : 0) || 0;

    handleGetBadges({ totalWager: formValues.wager, totalPayout });
  };

  return (
    <>
      <VideoPokerTemplate
        {...props}
        minWager={props.minWager || 1}
        maxWager={props.maxWager || 2000}
        handleStartGame={handleStartGame}
        handleFinishGame={handleFinishGame}
        onFormChange={(val) => setFormValues(val)}
        onAnimationCompleted={onGameCompleted}
        activeGame={activeGameData}
        settledCards={settledCards}
        isLoading={gameRead.isLoading}
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
}
