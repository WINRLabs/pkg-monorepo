'use client';
import {
  BetHistoryTemplate,
  GameType,
  HoldemPokerActiveGame,
  HoldemPokerFormFields,
  HoldemPokerTemplate,
} from '@winrlabs/games';
import {
  controllerAbi,
  holdemPokerAbi,
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
import React from 'react';
import { useDebounce } from 'use-debounce';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
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
import { DecodedEvent, prepareGameTransaction } from '../utils';
import {
  HOLDEM_POKER_EVENT_TYPES,
  HoldemPokerContractStatus,
  HoldemPokerGameDealtEvent,
  HoldemPokerSettledEvent,
  HoldemPokerSideBetSettledEvent,
} from './types';
import { checkPairOfAcesOrBetter } from './utils';

const log = debug('worker:HoldemPokerWeb3');

interface TemplateWithWeb3Props extends BaseGameProps {
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  buildedGameUrl: string;
  onGameCompleted?: () => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

const defaultActiveGame: HoldemPokerActiveGame = {
  gameIndex: null,
  cards: [],
  anteChipAmount: 0,
  aaBonusChipAmount: 0,

  player: {
    combination: 0,
    cards: [],
  },

  dealer: {
    combination: 0,
    cards: [],
  },
  payoutAmount: 0,
  paybackAmount: 0,
  result: 0,
  initialWager: 0,
};

export default function HoldemPokerGame(props: TemplateWithWeb3Props) {
  const [activeGame, setActiveGame] = React.useState<HoldemPokerActiveGame>(defaultActiveGame);
  const [formValues, setFormValues] = React.useState<HoldemPokerFormFields>({
    aaBonus: 0,
    ante: 0,
    wager: props.minWager || 1,
  });

  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.holdemPoker,
      gameType: GameType.HOLDEM_POKER,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const currentAccount = useCurrentAccount();

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));

  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
    balancesToRead: [selectedToken.address],
  });

  const tokens = useTokenStore((s) => s.tokens);

  const { priceFeed } = usePriceFeed();

  const gameEvent = useListenGameEvent();

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const getEncodedBetTxData = () => {
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const { ante, aaBonus } = formValues;

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'anteChipAmount_', type: 'uint16' },
        { name: 'sideBetChipAmount_', type: 'uint16' },
        { name: 'wager_', type: 'uint128' },
      ],
      [ante, aaBonus, wagerInWei]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.holdemPoker as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });
  };

  const getEncodedFinalizeTxData = (isFold = false) => {
    const encodedGameData = encodeAbiParameters([{ name: 'fold', type: 'bool' }], [isFold]);

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.holdemPoker as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'decide',
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

  const handleDeal = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

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
        encodedTxData: getEncodedBetTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
  };

  const handleFinalize = async () => {
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
        encodedTxData: getEncodedFinalizeTxData(),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
    }
  };

  const handleFinalizeFold = async () => {
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await sendTx.mutateAsync({
        encodedTxData: getEncodedFinalizeTxData(true),
        target: controllerAddress,
        method: 'sendGameOperation',
      });
    } catch (e: any) {
      log('error', e);
    }
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: holdemPokerAbi,
    address: gameAddresses.holdemPoker,
    functionName: 'getPlayerStatus',
    args: [currentAccount.address || '0x'],
    query: {
      enabled: !!currentAccount.address,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
  });

  React.useEffect(() => {
    if (!gameDataRead.data) return;
    log(gameDataRead.data, 'initial');
    if (
      gameDataRead.data.state == HoldemPokerContractStatus.NONE ||
      gameDataRead.data.state == HoldemPokerContractStatus.RESOLVED
    )
      return;

    const initialToken = tokens.find((t) => t.bankrollIndex == gameDataRead.data.bankroll) as Token;
    const initialWagerAsDollar =
      Number(formatUnits(gameDataRead.data.wager, initialToken.decimals)) *
      priceFeed[initialToken.priceKey];

    const _activeGame = {
      cards: gameDataRead.data.cards as unknown as number[],
      gameIndex: gameDataRead.data.gameIndex,
      anteChipAmount: gameDataRead.data.anteChips,
      aaBonusChipAmount: gameDataRead.data.sideBetChips,
      player: {
        combination: checkPairOfAcesOrBetter([...gameDataRead.data.cards]),
        cards: [],
      },
      initialWager: initialWagerAsDollar,
    };

    setActiveGame((prev) => ({ ...prev, ..._activeGame }));
  }, [gameDataRead.data]);

  const onRefresh = () => {
    props.onGameCompleted && props.onGameCompleted();
    updateBalances();
  };

  const isFetchedWithDelay = useDebounce(gameDataRead.isFetched, 50);

  React.useEffect(() => {
    if (!gameEvent) return;
    handleGameEvent(gameEvent);
  }, [gameEvent]);

  const handleGameEvent = (gameEvent: DecodedEvent<any, any>) => {
    switch (gameEvent.program[0]?.type) {
      case HOLDEM_POKER_EVENT_TYPES.InitialGameDealt: {
        const result = gameEvent.program[0]?.data as HoldemPokerGameDealtEvent;

        setActiveGame((prev) => ({
          ...prev,
          cards: result.cards,
          player: {
            ...prev.player,
            combination: checkPairOfAcesOrBetter([...result.cards]),
          },
        }));
        break;
      }
      case HOLDEM_POKER_EVENT_TYPES.SideBetSettled: {
        const result = gameEvent.program[0]?.data as HoldemPokerSideBetSettledEvent;

        setActiveGame((prev) => ({
          ...prev,
          cards: result.cards,
          player: {
            ...prev.player,
            combination: checkPairOfAcesOrBetter([...result.cards]),
          },
        }));
        break;
      }
      case HOLDEM_POKER_EVENT_TYPES.Settled: {
        const result = gameEvent.program[0]?.data as HoldemPokerSettledEvent;

        const token = tokens.find((t) => t.bankrollIndex == result.game.bankroll) as Token;

        const paybackAmountAsDollar =
          Number(formatUnits(result.payback, token.decimals)) * priceFeed[token.priceKey];
        const payoutAmountAsDollar =
          Number(formatUnits(result.payout, token.decimals)) * priceFeed[token.priceKey];

        setActiveGame((prev) => ({
          ...prev,
          cards: result.cards,
          player: {
            cards: result.playerHand.cards,
            combination: Number(result.playerHand.combination),
          },
          dealer: {
            cards: result.dealerHand.cards,
            combination: Number(result.dealerHand.combination),
          },
          paybackAmount: paybackAmountAsDollar,
          payoutAmount: payoutAmountAsDollar,
          result: Number(result.result),
        }));
        break;
      }
      default: {
        return;
      }
    }
  };

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.HOLDEM_POKER,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const onGameCompleted = (move: 'fold' | 'call') => {
    props.onGameCompleted && props.onGameCompleted();
    refetchPlayerGameStatus();
    refetchHistory();

    const { ante, aaBonus, wager } = formValues;
    let totalWager = 0;

    if (move == 'fold') totalWager = wager * (ante + aaBonus);
    else if (move == 'call') totalWager = wager * (ante + aaBonus + ante * 2);

    handleGetBadges({
      totalWager,
      totalPayout: activeGame.payoutAmount,
    });
  };

  return (
    <>
      <HoldemPokerTemplate
        minWager={props.minWager}
        maxWager={props.maxWager}
        buildedGameUrl={props.buildedGameUrl}
        activeGameData={activeGame}
        isInitialDataFetched={isFetchedWithDelay[0]}
        isLoggedIn={!!currentAccount.address}
        handleDeal={handleDeal}
        handleFinalize={handleFinalize}
        handleFinalizeFold={handleFinalizeFold}
        onRefresh={onRefresh}
        onFormChange={(v) => setFormValues(v)}
        onGameCompleted={onGameCompleted}
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
