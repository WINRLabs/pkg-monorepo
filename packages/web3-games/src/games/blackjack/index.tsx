'use client';

import {
  ActiveGameHands,
  BetHistoryTemplate,
  BlackjackCard,
  BlackjackFormFields,
  BlackjackGameStatus,
  BlackjackHandStatus,
  BlackjackTemplate,
  BlackjackTheme,
  GameStruct,
  GameType,
  toDecimals,
} from '@winrlabs/games';
import {
  blackjackReaderAbi,
  controllerAbi,
  useBalanceStore,
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
  BJ_EVENT_TYPES,
  BlackjackContractHand,
  BlackjackDealerCardsEvent,
  BlackjackPlayerCardsEvent,
  BlackjackPlayerHandEvent,
  BlackjackResultEvent,
  BlackjackSettledEvent,
  BlackjackStandOffEvent,
} from './types';

const log = debug('worker:BlackjackWeb3');

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props extends BaseGameProps {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  hideBetHistory?: boolean;
  onGameCompleted?: (payout: number) => void;
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
  theme?: Partial<BlackjackTheme>;
}

const defaultActiveGameHands = {
  dealer: {
    cards: null,
    hand: null,
  },
  firstHand: {
    cards: null,
    hand: null,
  },
  secondHand: {
    cards: null,
    hand: null,
  },
  thirdHand: {
    cards: null,
    hand: null,
  },
  splittedFirstHand: {
    cards: null,
    hand: null,
  },
  splittedSecondHand: {
    cards: null,
    hand: null,
  },
  splittedThirdHand: {
    cards: null,
    hand: null,
  },
};

const defaultGameData = {
  activeHandIndex: 0,
  canInsure: false,
  status: BlackjackGameStatus.NONE,
  payout: 0,
  payback: 0,
};

const MAX_WAGER_MULTIPLIER = 3;

export default function BlackjackTemplateWithWeb3(props: TemplateWithWeb3Props) {
  const maxWager = toDecimals((props?.maxWager || 100) / MAX_WAGER_MULTIPLIER, 2);

  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.blackjack,
      gameType: GameType.BLACKJACK,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const { tokens, selectedToken, setSelectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
    tokens: s.tokens,
    setSelectedToken: s.setSelectedToken,
  }));

  const balances = useBalanceStore((state) => state.balances);

  const gameEvent = useListenGameEvent(gameAddresses.blackjack);

  const { getTokenPrice } = usePriceFeed();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<BlackjackFormFields>({
    wager: props.minWager || 1,
    handIndex: 0,
    firstHandWager: 0,
    secondHandWager: 0,
    thirdHandWager: 0,
  });
  const [activeMove, setActiveMove] = React.useState<
    'Created' | 'HitCard' | 'StandOff' | 'DoubleDown' | 'Split' | 'Insurance'
  >();

  const [activeGameData, setActiveGameData] = React.useState<GameStruct>(defaultGameData);

  const [activeGameHands, setActiveGameHands] =
    React.useState<ActiveGameHands>(defaultActiveGameHands);

  const [initialDataFetched, setInitialDataFetched] = React.useState<boolean>(false);

  const resetGame = () => {
    setActiveGameData(defaultGameData);
    setActiveGameHands(defaultActiveGameHands);
  };

  // TRANSACTIONS
  const currentAccount = useCurrentAccount();
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

  const getEncodedBetTxData = () => {
    const { wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: getTokenPrice(selectedToken.priceKey),
    });

    const { firstHandWager, secondHandWager, thirdHandWager } = formValues;

    const betAmounts: any = [];

    if (firstHandWager > 0) betAmounts.push(firstHandWager);

    if (secondHandWager > 0) betAmounts.push(secondHandWager);

    if (thirdHandWager > 0) betAmounts.push(thirdHandWager);

    const amountHands = betAmounts.length;

    for (let i = 0; i < 3; i++) {
      log(betAmounts[i], 'betamounts');

      if (!betAmounts[i]) betAmounts.push(0);
    }

    log(betAmounts, 'betamounts', amountHands);
    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'chipAmounts', type: 'uint16[3]' },
        { name: 'amountHands', type: 'uint8' },
      ],
      [wagerInWei, betAmounts, amountHands]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });
  };

  const getEncodedHitTxData = () => {
    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [formValues.handIndex as unknown as bigint]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'hitAnotherCard',
        encodedGameData,
      ],
    });
  };

  const getEncodedStandTxData = () => {
    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [formValues.handIndex as unknown as bigint]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'standOff',
        encodedGameData,
      ],
    });
  };

  const getEncodedDoubleTxData = () => {
    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [formValues.handIndex as unknown as bigint]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'doubleDown',
        encodedGameData,
      ],
    });
  };

  const getEncodedSplitTxData = () => {
    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [formValues.handIndex as unknown as bigint]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'splitHand',
        encodedGameData,
      ],
    });
  };

  const getEncodedBuyInsuranceTxData = () => {
    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [formValues.handIndex as unknown as bigint]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.blackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyInsurance',
        encodedGameData,
      ],
    });
  };

  const sendTx = useSendTx();
  const isPlayerHaltedRef = React.useRef<boolean>(false);
  const isReIterableRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
    isReIterableRef.current = isReIterable;
  }, [isPlayerHalted, isReIterable]);

  const wrapWinrTx = useWrapWinr({
    account: currentAccount.address || '0x',
  });

  const handleStart = async () => {
    if (selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL) await wrapWinrTx();

    setIsLoading(true); // Set loading state to true
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
      if (isReIterableRef.current) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedBetTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });

      updateBalances();
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleHit = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedHitTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleStand = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      await sendTx.mutateAsync({
        encodedTxData: getEncodedStandTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });
    } catch (e: any) {
      log('error', e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleDoubleDown = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterableRef.current) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedDoubleTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });
      updateBalances();
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleSplit = async () => {
    setIsLoading(true); // Set loading state to true
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
      if (isReIterableRef.current) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedSplitTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });

      updateBalances();
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleBuyInsurance = async () => {
    setIsLoading(true); // Set loading state to true
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
        encodedTxData: getEncodedBuyInsuranceTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });
      updateBalances();
    } catch (e: any) {
      log('error', e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: blackjackReaderAbi,
    address: gameAddresses.blackjackReader,
    functionName: 'getPlayerStatus',
    args: [currentAccount.address || '0x0000000'],
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

    const { game, hands } = gameDataRead.data;
    const { activeHandIndex, status, canInsure } = game;

    if (!activeHandIndex) return;

    log(gameDataRead.data, 'initial');

    setActiveGameData({
      activeHandIndex: status === BlackjackGameStatus.FINISHED ? 0 : Number(activeHandIndex),
      canInsure: canInsure,
      status: status,
    });

    setTimeout(() => {
      const _hands = hands as unknown as BlackjackContractHand[];

      for (let i = 0; i < _hands.length; i++) {
        const handId = Number(_hands[i]?.handIndex);
        const hand = hands[i] as unknown as BlackjackContractHand;

        if (i == 5) {
          // DEALER HAND
          const _amountCards = hand.cards.cards.filter((n) => n !== 0).length;

          const _totalCount = hand.cards.cards.reduce((acc, cur) => acc + cur, 0);

          setActiveGameHands((prev) => ({
            ...prev,
            dealer: {
              cards: {
                cards: hand.cards.cards,
                amountCards: _amountCards,
                totalCount: _totalCount,
                isSoftHand: hand.cards.isSoftHand,
                canSplit: false,
              },
              hand: null,
            },
          }));
        } else {
          // PLAYER HANDS
          if (handId == 0) continue;

          const _amountCards = hand.cards.cards.filter((n) => n !== 0).length;
          const _totalCount = hand.cards.cards.reduce((acc, cur) => acc + cur, 0);
          const _canSplit =
            _amountCards === 2 &&
            new BlackjackCard(hand.cards.cards[0] as number).value ===
              new BlackjackCard(hand.cards.cards[1] as number).value &&
            !hand.hand.isInsured &&
            i < 3;

          const handObject = {
            cards: {
              cards: hand.cards.cards,
              amountCards: _amountCards,
              totalCount: _totalCount,
              isSoftHand: hand.cards.isSoftHand,
              canSplit: _canSplit,
            },
            hand: {
              chipsAmount: Number(hand.hand.chipsAmount),
              isInsured: hand.hand.isInsured,
              status: hand.hand.status,
              isDouble: hand.hand.isDouble,
              isSplitted: false,
              splittedHandIndex: Number(hand.splitHandIndex),
            },
            handId,
            isCompleted:
              hand.hand.status !== BlackjackHandStatus.AWAITING_HIT ||
              hand.hand.status !== (BlackjackHandStatus.PLAYING as any),
          };

          if (i === 0)
            setActiveGameHands((prev) => ({
              ...prev,
              firstHand: handObject,
            }));

          if (i === 1)
            setActiveGameHands((prev) => ({
              ...prev,
              secondHand: handObject,
            }));

          if (i === 2)
            setActiveGameHands((prev) => ({
              ...prev,
              thirdHand: handObject,
            }));

          // splitted hands
          if (Number(_hands[0]?.splitHandIndex) === handId)
            setActiveGameHands((prev) => ({
              ...prev,
              splittedFirstHand: handObject,
            }));

          if (Number(_hands[1]?.splitHandIndex) === handId)
            setActiveGameHands((prev) => ({
              ...prev,
              splittedSecondHand: handObject,
            }));

          if (Number(_hands[2]?.splitHandIndex) === handId)
            setActiveGameHands((prev) => ({
              ...prev,
              splittedThirdHand: handObject,
            }));
        }
      }

      setInitialDataFetched(true);

      setTimeout(() => {
        setInitialDataFetched(false);
      }, 1000);
    }, 50);
  }, [gameDataRead.data]);

  React.useEffect(() => {
    if (!gameEvent) return;

    handleGameEvent(gameEvent);
  }, [gameEvent]);

  const handleGameEvent = (gameEvent: DecodedEvent<any, any>) => {
    switch (gameEvent.program[0]?.type) {
      case BJ_EVENT_TYPES.Settled: {
        const status = Number(gameEvent.program[0].data.game.status);
        const playerCardsEvent = gameEvent.program[2]?.data as BlackjackPlayerCardsEvent;

        // handle events by game status
        if (status == BlackjackGameStatus.FINISHED) {
          if (
            gameEvent.program[2]?.type == 'PlayerCards' &&
            playerCardsEvent.cards.amountCards == 2 &&
            playerCardsEvent.cards.totalCount == 21 &&
            activeMove == 'Created'
          ) {
            log('edge case');
            setInitialDataFetched(true);
            handleFirstBlackjackDistribution(gameEvent);
            setTimeout(() => {
              setInitialDataFetched(false);
            }, 1000);
          } else {
            log('game finished');
            handleGameFinalizeEvent(gameEvent);
          }
        }

        log(activeMove, 'ACTIVE MOVE!');
        // handle events by active move
        if (activeMove == 'Created' && playerCardsEvent.cards.totalCount !== 21) {
          setTimeout(() => {
            gameDataRead.refetch();
          }, 200);
        } else if (activeMove == 'HitCard') {
          log('player hit move!');
          handlePlayerEvent(gameEvent);
        } else if (activeMove == 'DoubleDown') {
          log('player double move!');
          handlePlayerEvent(gameEvent);
        } else if (activeMove == 'Split') {
          log('player split move!');
          const playerCardsEvent = gameEvent.program[2]?.data as BlackjackPlayerCardsEvent;
          const playerHandEvent = gameEvent.program[3]?.data as BlackjackPlayerHandEvent;
          const splittedPlayerCardsEvent = gameEvent.program[4]?.data as BlackjackPlayerCardsEvent;
          const splittedPlayerHandEvent = gameEvent.program[5]?.data as BlackjackPlayerHandEvent;
          const settledEvent = gameEvent.program[0]?.data as BlackjackSettledEvent;
          handleSplitEventCards(playerCardsEvent, playerHandEvent, settledEvent);
          handleSplitEventCards(splittedPlayerCardsEvent, splittedPlayerHandEvent, settledEvent);
        }
        break;
      }
      case BJ_EVENT_TYPES.Created:
        setActiveMove('Created');
        break;

      case BJ_EVENT_TYPES.HitCard: {
        setActiveMove('HitCard');
        break;
      }
      case BJ_EVENT_TYPES.StandOff: {
        log('player stand move!');
        setActiveMove('StandOff');
        handlePlayerStandEvent(gameEvent);
        break;
      }
      case BJ_EVENT_TYPES.DoubleDown: {
        setActiveMove('DoubleDown');
        break;
      }
      case BJ_EVENT_TYPES.Split: {
        setActiveMove('Split');
        handlePlayerSplitEvent(gameEvent);
        break;
      }
      case BJ_EVENT_TYPES.Insurance: {
        setActiveMove('Insurance');
        handleBuyInsuranceEvent(gameEvent);
      }
      default: {
        return;
      }
    }
  };

  // event handlers
  const handleFirstBlackjackDistribution = (results: DecodedEvent<any, any>) => {
    const settledEvent = results.program[0]?.data as BlackjackSettledEvent;
    const playerCardsEvent = results.program[2]?.data as BlackjackPlayerCardsEvent;
    const dealerCardsEvent = results.program[3]?.data as BlackjackPlayerCardsEvent;

    const newPlayerHand = {
      cards: {
        cards: playerCardsEvent.cards.cards,
        amountCards: playerCardsEvent.cards.cards.filter((n) => n !== 0).length,
        totalCount: playerCardsEvent.cards.totalCount,
        isSoftHand: playerCardsEvent.cards.isSoftHand,
        canSplit: playerCardsEvent.cards?.canSplit || false,
      },
      hand: {
        chipsAmount: formValues.firstHandWager,
        isInsured: false,
        status: BlackjackHandStatus.BLACKJACK,
        isDouble: false,
        isSplitted: false,
        splittedHandIndex: null,
      },
      handId: playerCardsEvent.handIndex,
    };

    const newDealerHand = {
      cards: {
        cards: dealerCardsEvent.cards.cards,
        amountCards: dealerCardsEvent.cards.cards.filter((n) => n !== 0).length,
        totalCount: dealerCardsEvent.cards.totalCount,
        isSoftHand: dealerCardsEvent.cards.isSoftHand,
        canSplit: dealerCardsEvent.cards?.canSplit || false,
      },
      hand: {
        chipsAmount: 0,
        isInsured: false,
        status: BlackjackHandStatus.BLACKJACK,
        isDouble: false,
        isSplitted: false,
        splittedHandIndex: null,
      },
      handId: playerCardsEvent.handIndex,
    };

    setActiveGameHands((prev) => ({ ...prev, firstHand: newPlayerHand, dealer: newDealerHand }));

    // set new game data
    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(settledEvent.game.activeHandIndex),
      status: Number(settledEvent.game.status),
    }));
  };

  const handlePlayerEvent = (results: DecodedEvent<any, any>) => {
    const hitCardEvent = results.program[0]?.data as BlackjackSettledEvent;
    const playerCardsEvent = results.program[2]?.data as BlackjackPlayerCardsEvent;
    const playerHandEvent = results.program[3]?.data as BlackjackPlayerHandEvent;

    const handId = Number(playerCardsEvent.handIndex);

    let prevHand: ActiveGameHands['firstHand' | 'secondHand' | 'thirdHand'] =
      defaultActiveGameHands.firstHand;

    log('interested hand id:', handId);

    log(activeGameHands, 'inner active game hands');

    if (activeGameHands.firstHand.handId === handId) prevHand = activeGameHands.firstHand;

    if (activeGameHands.secondHand.handId === handId) prevHand = activeGameHands.secondHand;

    if (activeGameHands.thirdHand.handId === handId) prevHand = activeGameHands.thirdHand;

    if (activeGameHands.splittedFirstHand.handId === handId)
      prevHand = activeGameHands.splittedFirstHand;

    if (activeGameHands.splittedSecondHand.handId === handId)
      prevHand = activeGameHands.splittedSecondHand;

    if (activeGameHands.splittedThirdHand.handId === handId)
      prevHand = activeGameHands.splittedThirdHand;

    log(prevHand, 'previous hand', activeGameHands);

    const newHand: ActiveGameHands['firstHand' | 'secondHand' | 'thirdHand'] = {
      cards: {
        cards: playerCardsEvent.cards.cards,
        amountCards: playerCardsEvent.cards.cards.filter((n) => n !== 0).length,
        totalCount: playerCardsEvent.cards.totalCount,
        isSoftHand: playerCardsEvent.cards.isSoftHand,
        canSplit: prevHand.cards?.canSplit || false,
      },
      hand: {
        chipsAmount: prevHand.hand?.chipsAmount || 0,
        isInsured: playerHandEvent.isInsured,
        status: playerHandEvent.status,
        isDouble: playerHandEvent.isDouble,
        isSplitted: prevHand.hand?.isSplitted || false,
        splittedHandIndex: prevHand.hand?.splittedHandIndex || null,
      },
      handId,
    };

    log(newHand, 'newHandObject with new fields');

    // set new hand data
    if (activeGameHands.firstHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, firstHand: newHand }));

    if (activeGameHands.secondHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, secondHand: newHand }));

    if (activeGameHands.thirdHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, thirdHand: newHand }));

    if (activeGameHands.firstHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedFirstHand: newHand }));

    if (activeGameHands.secondHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedSecondHand: newHand }));

    if (activeGameHands.thirdHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedThirdHand: newHand }));

    // set new game data
    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(hitCardEvent.game.activeHandIndex),
      status: Number(hitCardEvent.game.status),
    }));
  };

  const handlePlayerStandEvent = (gameEvent: DecodedEvent<any, any>) => {
    const standOffEvent = gameEvent.program[0]?.data as BlackjackStandOffEvent;

    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(standOffEvent.game.activeHandIndex),
    }));
  };

  const handlePlayerSplitEvent = (gameEvent: DecodedEvent<any, any>) => {
    const playerCardsEvent = gameEvent.program[2]?.data as BlackjackPlayerCardsEvent;
    const splittedPlayerCardsEvent = gameEvent.program[4]?.data as BlackjackPlayerCardsEvent;

    const handId = Number(playerCardsEvent.handIndex);
    const splittedHandId = Number(splittedPlayerCardsEvent.handIndex);

    if (handId === activeGameHands.firstHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        firstHand: {
          ...prev.firstHand,
          hand: {
            ...(prev.firstHand.hand as any),
            isSplitted: true,
            splittedHandIndex: splittedHandId,
          },
        },
        splittedFirstHand: {
          ...prev.splittedFirstHand,
          hand: {
            ...(prev.splittedFirstHand as any),
            chipsAmount: prev.firstHand.hand?.chipsAmount || 0,
          },
          cards: {
            ...(prev.splittedFirstHand.cards as any),
            canSplit: false,
          },
          handId: splittedHandId,
        },
      }));
    }

    if (handId === activeGameHands.secondHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        secondHand: {
          ...prev.secondHand,
          hand: {
            ...(prev.secondHand.hand as any),
            isSplitted: true,
            splittedHandIndex: splittedHandId,
          },
        },
        splittedSecondHand: {
          ...prev.splittedSecondHand,
          hand: {
            ...(prev.splittedSecondHand as any),
            chipsAmount: prev.secondHand.hand?.chipsAmount || 0,
          },
          cards: {
            ...(prev.splittedSecondHand.cards as any),
            canSplit: false,
          },
          handId: splittedHandId,
        },
      }));
    }

    if (handId === activeGameHands.thirdHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        thirdHand: {
          ...prev.thirdHand,
          hand: {
            ...(prev.thirdHand.hand as any),
            isSplitted: true,
            splittedHandIndex: splittedHandId,
          },
        },
        splittedThirdHand: {
          ...prev.splittedThirdHand,
          hand: {
            ...(prev.splittedThirdHand as any),
            chipsAmount: prev.thirdHand.hand?.chipsAmount || 0,
          },
          cards: {
            ...(prev.splittedThirdHand.cards as any),
            canSplit: false,
          },
          handId: splittedHandId,
        },
      }));
    }
  };

  const handleSplitEventCards = (
    playerCardsEvent: BlackjackPlayerCardsEvent,
    playerHandEvent: BlackjackPlayerHandEvent,
    settledEvent: BlackjackSettledEvent
  ) => {
    const handId = Number(playerCardsEvent.handIndex);

    let prevHand: ActiveGameHands['firstHand' | 'secondHand' | 'thirdHand'] =
      defaultActiveGameHands.firstHand;

    log('interested hand id:', handId);

    log(activeGameHands, 'inner active game hands');

    if (activeGameHands.firstHand.handId === handId) prevHand = activeGameHands.firstHand;

    if (activeGameHands.secondHand.handId === handId) prevHand = activeGameHands.secondHand;

    if (activeGameHands.thirdHand.handId === handId) prevHand = activeGameHands.thirdHand;

    if (activeGameHands.splittedFirstHand.handId === handId)
      prevHand = activeGameHands.splittedFirstHand;

    if (activeGameHands.splittedSecondHand.handId === handId)
      prevHand = activeGameHands.splittedSecondHand;

    if (activeGameHands.splittedThirdHand.handId === handId)
      prevHand = activeGameHands.splittedThirdHand;

    log(prevHand, 'previous hand', activeGameHands);

    const newHand: ActiveGameHands['firstHand' | 'secondHand' | 'thirdHand'] = {
      cards: {
        cards: playerCardsEvent.cards.cards,
        amountCards: playerCardsEvent.cards.cards.filter((n) => n !== 0).length,
        totalCount: playerCardsEvent.cards.totalCount,
        isSoftHand: playerCardsEvent.cards.isSoftHand,
        canSplit: prevHand.cards?.canSplit || false,
      },
      hand: {
        chipsAmount: prevHand.hand?.chipsAmount || 0,
        isInsured: playerHandEvent.isInsured,
        status: playerHandEvent.status,
        isDouble: playerHandEvent.isDouble,
        isSplitted: prevHand.hand?.isSplitted || false,
        splittedHandIndex: prevHand.hand?.splittedHandIndex || null,
      },
      handId,
    };

    log(newHand, 'newHandObject with new fields');

    // set new hand data
    if (activeGameHands.firstHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, firstHand: newHand }));

    if (activeGameHands.secondHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, secondHand: newHand }));

    if (activeGameHands.thirdHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, thirdHand: newHand }));

    if (activeGameHands.firstHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedFirstHand: newHand }));

    if (activeGameHands.secondHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedSecondHand: newHand }));

    if (activeGameHands.thirdHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedThirdHand: newHand }));

    // set new game data
    setActiveGameData((prev) => ({
      ...prev,
      activeHandIndex: Number(settledEvent.game.activeHandIndex),
      status: Number(settledEvent.game.status),
    }));
  };

  const handleBuyInsuranceEvent = (gameEvent: DecodedEvent<any, any>) => {
    const playerHandEvent = gameEvent.program[1]?.data as BlackjackPlayerHandEvent;
    const handId = Number(playerHandEvent.handIndex);

    if (handId === activeGameHands.firstHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        firstHand: {
          ...prev.firstHand,
          cards: {
            ...(prev.firstHand.cards as any),
            canSplit: false,
          },
          hand: {
            ...(prev.firstHand.hand as any),
            isInsured: true,
          },
        },
      }));
    }

    if (handId === activeGameHands.secondHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        secondHand: {
          ...prev.secondHand,
          cards: {
            ...(prev.secondHand.cards as any),
            canSplit: false,
          },
          hand: {
            ...(prev.secondHand.hand as any),
            isInsured: true,
          },
        },
      }));
    }

    if (handId === activeGameHands.thirdHand.handId) {
      setActiveGameHands((prev) => ({
        ...prev,
        thirdHand: {
          ...prev.thirdHand,
          cards: {
            ...(prev.thirdHand.cards as any),
            canSplit: false,
          },
          hand: {
            ...(prev.thirdHand.hand as any),
            isInsured: true,
          },
        },
      }));
    }
  };

  const handleGameFinalizeEvent = (gameEvent: DecodedEvent<any, any>) => {
    const results = gameEvent.program[1]?.data as BlackjackResultEvent;

    const dealerCardsEvent = gameEvent.program.find((e) => e.type == BJ_EVENT_TYPES.DealerCards)
      ?.data as BlackjackDealerCardsEvent;
    const gameResults = results.hands;
    const gamePayout = Number(formatUnits(BigInt(results.payout), selectedToken.decimals));
    const gamePayback = Number(formatUnits(BigInt(results.payback), selectedToken.decimals));
    const gamePayoutAsDollar = gamePayout * getTokenPrice(selectedToken.priceKey);
    const gamePaybackAsDollar = gamePayback * getTokenPrice(selectedToken.priceKey);

    setActiveGameHands((prev) => ({
      ...prev,
      dealer: {
        cards: {
          cards: dealerCardsEvent.cards.cards,
          amountCards: dealerCardsEvent.cards.cards.filter((n) => n !== 0).length,
          totalCount: dealerCardsEvent.cards.totalCount,
          isSoftHand: dealerCardsEvent.cards.isSoftHand,
          canSplit: false,
        },
        hand: null,
      },
      firstHand: {
        ...prev.firstHand,
        settledResult: {
          result: Number(gameResults[0]),
        },
      },
      secondHand: {
        ...prev.secondHand,
        settledResult: {
          result: Number(gameResults[1]),
        },
      },
      thirdHand: {
        ...prev.thirdHand,
        settledResult: {
          result: Number(gameResults[2]),
        },
      },
    }));

    for (let i = 3; i < 5; i++) {
      const result = Number(gameResults[i]);
      const handId = results.handIndexes[i];

      if (handId == activeGameHands.splittedFirstHand.handId) {
        setActiveGameHands((prev) => ({
          ...prev,
          splittedFirstHand: {
            ...prev.splittedFirstHand,
            settledResult: {
              result: result,
            },
          },
        }));
      }
      if (handId == activeGameHands.splittedSecondHand.handId) {
        setActiveGameHands((prev) => ({
          ...prev,
          splittedSecondHand: {
            ...prev.splittedSecondHand,
            settledResult: {
              result: result,
            },
          },
        }));
      }
      if (handId == activeGameHands.splittedThirdHand.handId) {
        setActiveGameHands((prev) => ({
          ...prev,
          splittedThirdHand: {
            ...prev.splittedThirdHand,
            settledResult: {
              result: result,
            },
          },
        }));
      }
    }

    setActiveGameData((prev) => ({
      ...prev,
      status: BlackjackGameStatus.FINISHED,
      payout: gamePayoutAsDollar,
      payback: gamePaybackAsDollar,
    }));
  };

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.BLACKJACK,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const totalWager = React.useMemo(() => {
    let totalChipAmount = 0;
    const {
      firstHand,
      secondHand,
      thirdHand,
      splittedFirstHand,
      splittedSecondHand,
      splittedThirdHand,
    } = activeGameHands;

    const hands = [
      firstHand,
      secondHand,
      thirdHand,
      splittedFirstHand,
      splittedSecondHand,
      splittedThirdHand,
    ];

    for (const h of hands) {
      totalChipAmount += h.hand?.chipsAmount || 0;

      if (h.hand?.isDouble) totalChipAmount += h.hand.chipsAmount || 0;
      if (h.hand?.isInsured) totalChipAmount += (h.hand.chipsAmount || 0) / 2;
    }

    return formValues.wager * totalChipAmount;
  }, [activeGameHands, formValues.wager]);

  const onGameCompleted = () => {
    props.onGameCompleted && props.onGameCompleted(activeGameData.payout || 0);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    handleGetBadges({
      totalWager,
      totalPayout: (activeGameData.payout || 0) + (activeGameData.payback || 0),
    });
  };

  return (
    <>
      <BlackjackTemplate
        {...props}
        activeGameData={activeGameData}
        activeGameHands={activeGameHands}
        initialDataFetched={initialDataFetched}
        minWager={props.minWager}
        maxWager={maxWager}
        onFormChange={(v) => setFormValues(v)}
        onGameCompleted={onGameCompleted}
        isControllerDisabled={isLoading}
        onDeal={handleStart}
        onHit={handleHit}
        onDoubleDown={handleDoubleDown}
        onInsure={handleBuyInsurance}
        onSplit={handleSplit}
        onStand={handleStand}
        onReset={resetGame}
        options={{}}
        currencyList={tokens}
        selectedCurrency={selectedToken}
        balances={balances}
        onChangeCurrency={(t) => setSelectedToken(t)}
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
