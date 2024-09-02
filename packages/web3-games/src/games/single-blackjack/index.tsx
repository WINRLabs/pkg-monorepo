'use client';

import {
  ActiveGameHands,
  BetHistoryTemplate,
  BlackjackCard,
  BlackjackGameStatus,
  BlackjackHandStatus,
  GameStruct,
  GameType,
  SingleBJActiveGameHands,
  SingleBJDealFormFields,
  SingleBlackjackTemplate,
  toDecimals,
} from '@winrlabs/games';
import {
  blackjackReaderAbi,
  controllerAbi,
  useCurrentAccount,
  useHandleTx,
  useNativeTokenBalance,
  usePriceFeed,
  useTokenAllowance,
  useTokenBalances,
  useTokenStore,
  useWrapWinr,
  WRAPPED_WINR_BANKROLL,
} from '@winrlabs/web3';
import React from 'react';
import { Address, encodeAbiParameters, encodeFunctionData, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

import { BaseGameProps } from '../../type';
import {
  BJ_EVENT_TYPES,
  BlackjackContractHand,
  BlackjackDealerCardsEvent,
  BlackjackPlayerCardsEvent,
  BlackjackPlayerHandEvent,
  BlackjackResultEvent,
  BlackjackSettledEvent,
  BlackjackStandOffEvent,
} from '../blackjack/types';
import {
  Badge,
  useBetHistory,
  useGetBadges,
  useListenGameEvent,
  usePlayerGameStatus,
} from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { DecodedEvent, prepareGameTransaction } from '../utils';

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
}

const defaultActiveGameHands: SingleBJActiveGameHands = {
  dealer: {
    cards: null,
    hand: null,
  },
  firstHand: {
    cards: null,
    hand: null,
  },
  splittedFirstHand: {
    cards: null,
    hand: null,
  },
};

const defaultGameData = {
  activeHandIndex: 0,
  canInsure: false,
  status: BlackjackGameStatus.NONE,
  payout: 0,
};

const MAX_WAGER_MULTIPLIER = 3;

export default function SingleBlackjackGame(props: TemplateWithWeb3Props) {
  const maxWager = toDecimals((props.maxWager || 100) / MAX_WAGER_MULTIPLIER, 2);

  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.singleBlackjack,
      gameType: GameType.ONE_HAND_BLACKJACK,
      wagmiConfig,
      onPlayerStatusUpdate: props.onPlayerStatusUpdate,
    });

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));

  const gameEvent = useListenGameEvent();

  const { priceFeed } = usePriceFeed();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<SingleBJDealFormFields>({
    wager: props.minWager || 1,
  });
  const [activeMove, setActiveMove] = React.useState<
    'Created' | 'HitCard' | 'StandOff' | 'DoubleDown' | 'Split' | 'Insurance'
  >();

  const [activeGameData, setActiveGameData] = React.useState<GameStruct>(defaultGameData);

  const [activeGameHands, setActiveGameHands] =
    React.useState<SingleBJActiveGameHands>(defaultActiveGameHands);

  const [initialDataFetched, setInitialDataFetched] = React.useState<boolean>(false);

  const resetGame = () => {
    setActiveGameData(defaultGameData);
    setActiveGameHands(defaultActiveGameHands);
  };

  // TRANSACTIONS
  const currentAccount = useCurrentAccount();
  const { refetch: updateBalances } = useTokenBalances({
    account: currentAccount.address || '0x',
  });
  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const encodedBetParams = React.useMemo(() => {
    const { tokenAddress, wagerInWei } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'chipAmounts', type: 'uint16[3]' },
        { name: 'amountHands', type: 'uint8' },
      ],
      [wagerInWei, [1, 0, 0], 1]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack as Address,
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
  }, [formValues.wager, selectedToken.address, priceFeed[selectedToken.priceKey]]);

  const encodedHitParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [activeGameData.activeHandIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'hitAnotherCard',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [selectedToken.address, activeGameData.activeHandIndex]);

  const encodedStandParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [activeGameData.activeHandIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'standOff',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [activeGameData.activeHandIndex, selectedToken.address]);

  const encodedDoubleParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [activeGameData.activeHandIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'doubleDown',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [activeGameData.activeHandIndex, selectedToken.address]);

  const encodedSplitParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [activeGameData.activeHandIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'splitHand',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [activeGameData.activeHandIndex, selectedToken.address]);

  const encodedBuyInsuranceParams = React.useMemo(() => {
    const { tokenAddress } = prepareGameTransaction({
      wager: formValues.wager,
      selectedCurrency: selectedToken,
      lastPrice: priceFeed[selectedToken.priceKey],
    });

    const encodedGameData = encodeAbiParameters(
      [{ name: 'handIndex', type: 'uint256' }],
      [activeGameData.activeHandIndex as unknown as bigint]
    );

    const encodedData: `0x${string}` = encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack as Address,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyInsurance',
        encodedGameData,
      ],
    });

    return {
      tokenAddress,
      encodedGameData,
      encodedTxData: encodedData,
    };
  }, [activeGameData.activeHandIndex, selectedToken.address]);

  const handleBetTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedBetParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedBetParams.encodedTxData,
  });

  const handleHitTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'hitAnotherCard',
        encodedHitParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedHitParams.encodedTxData,
  });

  const handleStandTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'standOff',
        encodedStandParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedStandParams.encodedTxData,
  });

  const handleDoubleTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'doubleDown',
        encodedDoubleParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedDoubleParams.encodedTxData,
  });

  const handleSplitTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'splitHand',
        encodedSplitParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedSplitParams.encodedTxData,
  });

  const handleBuyInsuranceTx = useHandleTx<typeof controllerAbi, 'perform'>({
    writeContractVariables: {
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.singleBlackjack,
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'buyInsurance',
        encodedBuyInsuranceParams.encodedGameData,
      ],
      address: controllerAddress as Address,
    },
    options: {
      method: 'sendGameOperation',
    },
    encodedTxData: encodedBuyInsuranceParams.encodedTxData,
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

  const handleStart = async () => {
    if (nativeWinr.balance > 0.1 && selectedToken.bankrollIndex == WRAPPED_WINR_BANKROLL)
      await wrapWinrTx();

    setIsLoading(true); // Set loading state to true
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleBetTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleHit = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleHitTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleStand = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      await handleStandTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleDoubleDown = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleDoubleTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleSplit = async () => {
    setIsLoading(true); // Set loading state to true
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await handleSplitTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
      refetchPlayerGameStatus();
    }
    setIsLoading(false); // Set loading state to false
  };

  const handleBuyInsurance = async () => {
    setIsLoading(true); // Set loading state to true
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      await handleBuyInsuranceTx.mutateAsync();
    } catch (e: any) {
      console.log('error', e);
    }
    setIsLoading(false); // Set loading state to false
  };

  const gameDataRead = useReadContract({
    config: wagmiConfig,
    abi: blackjackReaderAbi,
    address: gameAddresses.singleBlackjackReader,
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

    console.log(gameDataRead.data, 'initial');

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

        if (i == 3) {
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
            playerCardsEvent.cards.totalCount == 21
          ) {
            console.log('edge case');
            setInitialDataFetched(true);
            handleFirstBlackjackDistribution(gameEvent);
            setTimeout(() => {
              setInitialDataFetched(false);
            }, 1000);
          } else {
            console.log('game finished');
            handleGameFinalizeEvent(gameEvent);
          }
        }

        console.log(activeMove, 'ACTIVE MOVE!');
        console.log(playerCardsEvent);
        // handle events by active move
        if (activeMove == 'Created' && playerCardsEvent.cards.totalCount !== 21) {
          console.log('created event');

          setTimeout(() => {
            gameDataRead.refetch();
          }, 200);
        } else if (activeMove == 'HitCard') {
          console.log('player hit move!');
          handlePlayerEvent(gameEvent);
        } else if (activeMove == 'DoubleDown') {
          console.log('player double move!');
          handlePlayerEvent(gameEvent);
        } else if (activeMove == 'Split') {
          console.log('player split move!');
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
        console.log('player stand move!');
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
        chipsAmount: 0,
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

    console.log('interested hand id:', handId);

    console.log(activeGameHands, 'inner active game hands');

    if (activeGameHands.firstHand.handId === handId) prevHand = activeGameHands.firstHand;

    if (activeGameHands.splittedFirstHand.handId === handId)
      prevHand = activeGameHands.splittedFirstHand;

    console.log(prevHand, 'previous hand', activeGameHands);

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
        isInsured: playerHandEvent?.isInsured || false,
        status: playerHandEvent.status,
        isDouble: playerHandEvent.isDouble,
        isSplitted: prevHand.hand?.isSplitted || false,
        splittedHandIndex: prevHand.hand?.splittedHandIndex || null,
      },
      handId,
    };

    console.log(newHand, 'newHandObject with new fields');

    // set new hand data
    if (activeGameHands.firstHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, firstHand: newHand }));

    if (activeGameHands.firstHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedFirstHand: newHand }));

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
  };

  const handleSplitEventCards = (
    playerCardsEvent: BlackjackPlayerCardsEvent,
    playerHandEvent: BlackjackPlayerHandEvent,
    settledEvent: BlackjackSettledEvent
  ) => {
    const handId = Number(playerCardsEvent.handIndex);

    let prevHand: ActiveGameHands['firstHand' | 'secondHand' | 'thirdHand'] =
      defaultActiveGameHands.firstHand;

    console.log('interested hand id:', handId);

    console.log(activeGameHands, 'inner active game hands');

    if (activeGameHands.firstHand.handId === handId) prevHand = activeGameHands.firstHand;

    if (activeGameHands.splittedFirstHand.handId === handId)
      prevHand = activeGameHands.splittedFirstHand;

    console.log(prevHand, 'previous hand', activeGameHands);

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

    console.log(newHand, 'newHandObject with new fields');

    // set new hand data
    if (activeGameHands.firstHand.handId === handId)
      setActiveGameHands((prev) => ({ ...prev, firstHand: newHand }));

    if (activeGameHands.firstHand.hand?.splittedHandIndex === handId)
      setActiveGameHands((prev) => ({ ...prev, splittedFirstHand: newHand }));

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
  };

  const handleGameFinalizeEvent = (gameEvent: DecodedEvent<any, any>) => {
    const results = gameEvent.program[1]?.data as BlackjackResultEvent;

    const dealerCardsEvent = gameEvent.program.find((e) => e.type == BJ_EVENT_TYPES.DealerCards)
      ?.data as BlackjackDealerCardsEvent;
    const gameResults = results.hands;
    const gamePayout = Number(formatUnits(BigInt(results.payout), selectedToken.decimals));
    const gamePayoutAsDollar = gamePayout * priceFeed[selectedToken.priceKey];

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
      splittedFirstHand: {
        ...prev.splittedFirstHand,
        settledResult: {
          result: Number(gameResults[1]),
        },
      },
    }));

    setActiveGameData((prev) => ({
      ...prev,
      status: BlackjackGameStatus.FINISHED,
      payout: gamePayoutAsDollar,
    }));
  };

  const { betHistory, isHistoryLoading, mapHistoryTokens, setHistoryFilter, refetchHistory } =
    useBetHistory({
      gameType: GameType.ONE_HAND_BLACKJACK,
      options: {
        enabled: !props.hideBetHistory,
      },
    });

  const { handleGetBadges } = useGetBadges({
    onPlayerStatusUpdate: props.onPlayerStatusUpdate,
  });

  const totalWager = React.useMemo(() => {
    let totalChipAmount = 0;
    const { firstHand, splittedFirstHand } = activeGameHands;

    const hands = [firstHand, splittedFirstHand];

    for (const h of hands) {
      totalChipAmount += h.hand?.chipsAmount || 0;

      if (h.hand?.isDouble) totalChipAmount += h.hand.chipsAmount || 0;
      if (h.hand?.isInsured) totalChipAmount += (h.hand.chipsAmount || 0) / 2;
    }

    return formValues.wager * totalChipAmount;
  }, [activeGameHands, formValues.wager]);

  const onGameCompleted = () => {
    console.log('on game completed');
    props.onGameCompleted && props.onGameCompleted(activeGameData.payout || 0);
    refetchHistory();
    refetchPlayerGameStatus();
    updateBalances();

    handleGetBadges({
      totalWager,
      totalPayout: (activeGameData.payout || 0) + (activeGameData.payback || 0),
    });
  };

  React.useEffect(() => {
    console.log(activeGameData, 'activeGameData', activeGameHands, 'activegaMEhaNDS');
  }, [activeGameData, activeGameHands]);

  return (
    <>
      <SingleBlackjackTemplate
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
