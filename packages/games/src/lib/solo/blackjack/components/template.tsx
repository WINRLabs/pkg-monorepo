'use client';

import React from 'react';
import { useDebounce } from 'use-debounce';

import { Chip } from '../../../common/chip-controller/types';
import { GameContainer, SceneContainer } from '../../../common/containers';
import { RotatedBackButton } from '../../../common/rotated-back-button';
import { CDN_URL } from '../../../constants';
import { useGameOptions } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { RotationWrapper } from '../../../ui/rotation-wrapper';
import { wait } from '../../../utils/promise';
import { cn } from '../../../utils/style';
import { BlackjackGameProps, BlackjackGameStatus, BlackjackHandIndex, TIMEOUT } from '..';
import { BlackjackCard, distributeNewCards, getBlackjackSuit } from '../utils';
import { BetArea } from './bet-area';
import { BetController } from './bet-controller';
import { CardArea } from './card-area';
import { CurrencySelect } from './currency-select';
import { DealerCardArea } from './dealer-card-area';
import { MoveController } from './move-controller';
import { SplittedCardArea } from './splitted-card-area';
import styles from './styles.module.css';

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = BlackjackGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  onError?: (error: any) => void;
  onLogin?: () => void;
};

const BlackjackTemplate: React.FC<TemplateProps> = ({
  activeGameData,
  activeGameHands,
  isControllerDisabled = false,
  initialDataFetched,
  minWager,
  maxWager,
  currencyList,
  selectedCurrency,
  balances,
  onChangeCurrency,

  onGameCompleted,
  onDeal,
  onReset,
  onHit,
  onSplit,
  onDoubleDown,
  onInsure,
  onStand,
  onFormChange,
  onLogin,
}) => {
  const [wager, setWager] = React.useState<number>(minWager || 1);
  const [selectedChip, setSelectedChip] = React.useState<Chip>(Chip.ONE);

  const [firstHandWager, setFirstHandWager] = React.useState<number>(0);
  const [secondHandWager, setSecondHandWager] = React.useState<number>(0);
  const [thirdHandWager, setThirdHandWager] = React.useState<number>(0);

  // ui cards
  const [dealerCards, setDealerCards] = React.useState<(BlackjackCard | null)[]>([]);

  const [firstHandCards, setFirstHandCards] = React.useState<(BlackjackCard | null)[]>([]);

  const [secondHandCards, setSecondHandCards] = React.useState<(BlackjackCard | null)[]>([]);

  const [thirdHandCards, setThirdHandCards] = React.useState<(BlackjackCard | null)[]>([]);

  const [splittedFirstHandCards, setSplittedFirstHandCards] = React.useState<
    (BlackjackCard | null)[]
  >([]);

  const [splittedSecondHandCards, setSplittedSecondHandCards] = React.useState<
    (BlackjackCard | null)[]
  >([]);

  const [splittedThirdHandCards, setSplittedThirdHandCards] = React.useState<
    (BlackjackCard | null)[]
  >([]);

  // splitted card states
  const [firstHandSplittedCard, setFirstHandSplittedCard] = React.useState<BlackjackCard | null>(
    null
  );

  const [secondHandSplittedCard, setSecondHandSplittedCard] = React.useState<BlackjackCard | null>(
    null
  );

  const [thirdHandSplittedCard, setThirdHandSplittedCard] = React.useState<BlackjackCard | null>(
    null
  );

  const [isDistributionCompleted, setIsDistrubitionCompleted] = React.useState<boolean>(false);

  const { account } = useGameOptions();

  const selectEffect = useAudioEffect(SoundEffects.CHIP_EFFECT);

  const flipEffect = useAudioEffect(SoundEffects.FLIP_CARD);

  const addWager = (wager: number, handIndex: number) => {
    if (handIndex === 0) setFirstHandWager((prev) => prev + wager);

    if (handIndex === 1) setSecondHandWager((prev) => prev + wager);

    if (handIndex === 2) setThirdHandWager((prev) => prev + wager);

    selectEffect.play();
  };

  const handleClearWagers = () => {
    setFirstHandWager(0);
    setSecondHandWager(0);
    setThirdHandWager(0);
  };

  const canPlaceBet = React.useCallback(
    (handIndex: BlackjackHandIndex) => {
      if (activeGameData.status !== BlackjackGameStatus.NONE) return false;

      if (handIndex === BlackjackHandIndex.FIRST) return true;

      if (handIndex === BlackjackHandIndex.SECOND && firstHandWager > 0) return true;

      if (handIndex === BlackjackHandIndex.THIRD && secondHandWager > 0) return true;

      return false;
    },
    [firstHandWager, secondHandWager, activeGameData.status]
  );

  const isLastDistributionCompleted = React.useMemo(() => {
    const dealerCardAmount = activeGameHands.dealer.cards?.amountCards || 0;

    if (
      activeGameData.status === BlackjackGameStatus.FINISHED &&
      isDistributionCompleted &&
      dealerCardAmount === dealerCards.length &&
      dealerCards.length > 1
    )
      return true;
    else return false;
  }, [dealerCards, activeGameHands.dealer, isDistributionCompleted, activeGameData.status]);

  const activeHandByIndex = React.useMemo(() => {
    switch (activeGameData.activeHandIndex) {
      case activeGameHands.firstHand.handId:
        return activeGameHands.firstHand;

      case activeGameHands.secondHand.handId:
        return activeGameHands.secondHand;

      case activeGameHands.thirdHand.handId:
        return activeGameHands.thirdHand;

      case activeGameHands.splittedFirstHand.handId:
        return activeGameHands.splittedFirstHand;

      case activeGameHands.splittedSecondHand.handId:
        return activeGameHands.splittedSecondHand;

      case activeGameHands.splittedThirdHand.handId:
        return activeGameHands.splittedThirdHand;

      default:
        return {
          hand: null,
          cards: null,
        };
    }
  }, [activeGameData, isDistributionCompleted, activeGameHands]);

  const isTurn = React.useCallback(
    (handId?: number) => isDistributionCompleted && activeHandByIndex?.handId === handId,
    [isDistributionCompleted, activeHandByIndex]
  );

  const activeHandChipAmount = React.useMemo(() => {
    switch (activeGameData.activeHandIndex) {
      case activeGameHands.firstHand.handId:
        return activeGameHands.firstHand.hand?.chipsAmount;

      case activeGameHands.secondHand.handId:
        return activeGameHands.secondHand.hand?.chipsAmount;

      case activeGameHands.thirdHand.handId:
        return activeGameHands.thirdHand.hand?.chipsAmount;

      case activeGameHands.splittedFirstHand.handId:
        return activeGameHands.firstHand.hand?.chipsAmount;

      case activeGameHands.splittedSecondHand.handId:
        return activeGameHands.secondHand.hand?.chipsAmount;

      case activeGameHands.splittedThirdHand.handId:
        return activeGameHands.thirdHand.hand?.chipsAmount;

      default:
        return 0;
    }
  }, [activeGameData, activeGameHands]);

  const totalWager = React.useMemo(() => {
    let wager = firstHandWager + secondHandWager + thirdHandWager;

    activeGameHands.firstHand.hand?.isDouble &&
      (wager += activeGameHands.firstHand.hand?.chipsAmount || 0);

    activeGameHands.firstHand.hand?.isInsured &&
      (wager += activeGameHands.firstHand.hand?.chipsAmount / 2 || 0);

    activeGameHands.secondHand.hand?.isDouble &&
      (wager += activeGameHands.secondHand.hand?.chipsAmount || 0);

    activeGameHands.secondHand.hand?.isInsured &&
      (wager += activeGameHands.secondHand.hand?.chipsAmount / 2 || 0);

    activeGameHands.thirdHand.hand?.isDouble &&
      (wager += activeGameHands.thirdHand.hand?.chipsAmount || 0);

    activeGameHands.thirdHand.hand?.isInsured &&
      (wager += activeGameHands.thirdHand.hand?.chipsAmount / 2 || 0);

    if (activeGameData.activeHandIndex) {
      wager += activeGameHands.splittedFirstHand.hand?.chipsAmount || 0;

      activeGameHands.splittedFirstHand.hand?.isDouble &&
        (wager += activeGameHands.splittedFirstHand.hand?.chipsAmount || 0);

      activeGameHands.splittedFirstHand.hand?.isInsured &&
        (wager += activeGameHands.splittedFirstHand.hand?.chipsAmount / 2 || 0);

      wager += activeGameHands.splittedSecondHand.hand?.chipsAmount || 0;

      activeGameHands.splittedSecondHand.hand?.isDouble &&
        (wager += activeGameHands.splittedSecondHand.hand?.chipsAmount || 0);

      activeGameHands.splittedSecondHand.hand?.isInsured &&
        (wager += activeGameHands.splittedSecondHand.hand?.chipsAmount / 2 || 0);

      wager += activeGameHands.splittedThirdHand.hand?.chipsAmount || 0;

      activeGameHands.splittedThirdHand.hand?.isDouble &&
        (wager += activeGameHands.splittedThirdHand.hand?.chipsAmount || 0);

      activeGameHands.splittedThirdHand.hand?.isInsured &&
        (wager += activeGameHands.splittedThirdHand.hand?.chipsAmount / 2 || 0);
    }

    return wager;
  }, [firstHandWager, secondHandWager, thirdHandWager, activeGameHands]);

  const animateFirstDistribution = async () => {
    const {
      firstHand,
      secondHand,
      thirdHand,
      splittedFirstHand,
      splittedSecondHand,
      splittedThirdHand,
      dealer,
    } = activeGameHands;

    //for first cards

    const firstHandFirstCard = firstHand.cards?.cards[0];

    if (firstHandFirstCard) {
      setFirstHandCards((prev) => [
        ...prev,
        new BlackjackCard(firstHandFirstCard, getBlackjackSuit()),
      ]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    const secondHandFirstCard = secondHand.cards?.cards[0];

    if (secondHandFirstCard) {
      setSecondHandCards((prev) => [
        ...prev,
        new BlackjackCard(secondHandFirstCard, getBlackjackSuit()),
      ]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    const thirdHandFirstCard = thirdHand.cards?.cards[0];

    if (thirdHandFirstCard) {
      setThirdHandCards((prev) => [
        ...prev,
        new BlackjackCard(thirdHandFirstCard, getBlackjackSuit()),
      ]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    const dealerFirstCard = dealer.cards?.cards[0];

    if (dealerFirstCard) {
      setDealerCards((prev) => [...prev, new BlackjackCard(dealerFirstCard, getBlackjackSuit())]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    // distribute another hand cards
    for (let i = 1; i <= 5; i++) {
      const firstHandCard = firstHand.cards?.cards[i];

      if (firstHandCard) {
        setFirstHandCards((prev) => [
          ...prev,
          new BlackjackCard(firstHandCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }

      const secondHandCard = secondHand.cards?.cards[i];

      if (secondHandCard) {
        setSecondHandCards((prev) => [
          ...prev,
          new BlackjackCard(secondHandCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }

      const thirdHandCard = thirdHand.cards?.cards[i];

      if (thirdHandCard) {
        setThirdHandCards((prev) => [
          ...prev,
          new BlackjackCard(thirdHandCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }
    }

    // distribute splitted first hands for initial load
    const splittedFirstHandFirstCard = splittedFirstHand.cards?.cards[0];

    if (splittedFirstHandFirstCard) {
      setSplittedFirstHandCards((prev) => [
        ...prev,
        new BlackjackCard(splittedFirstHandFirstCard, getBlackjackSuit()),
      ]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    const splittedSecondHandFirstCard = splittedSecondHand.cards?.cards[0];

    if (splittedSecondHandFirstCard) {
      setSplittedSecondHandCards((prev) => [
        ...prev,
        new BlackjackCard(splittedSecondHandFirstCard, getBlackjackSuit()),
      ]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    const splittedThirdHandFirstCard = splittedThirdHand.cards?.cards[0];

    if (splittedThirdHandFirstCard) {
      setSplittedThirdHandCards((prev) => [
        ...prev,
        new BlackjackCard(splittedThirdHandFirstCard, getBlackjackSuit()),
      ]);

      flipEffect.play();

      await wait(TIMEOUT);
    }

    // distribute another splitted hand cards
    for (let i = 1; i <= 5; i++) {
      const splittedFirstHandCard = splittedFirstHand.cards?.cards[i];

      if (splittedFirstHandCard) {
        setSplittedFirstHandCards((prev) => [
          ...prev,
          new BlackjackCard(splittedFirstHandCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }

      const splittedSecondHandCard = splittedSecondHand.cards?.cards[i];

      if (splittedSecondHandCard) {
        setSplittedSecondHandCards((prev) => [
          ...prev,
          new BlackjackCard(splittedSecondHandCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }

      const splittedThirdHandCard = splittedThirdHand.cards?.cards[i];

      if (splittedThirdHandCard) {
        setSplittedThirdHandCards((prev) => [
          ...prev,
          new BlackjackCard(splittedThirdHandCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }
    }

    //distribute another dealer cards
    for (let i = 1; i <= 5; i++) {
      const dealerCard = dealer.cards?.cards[i];

      if (dealerCard) {
        setDealerCards((prev) => [...prev, new BlackjackCard(dealerCard, getBlackjackSuit())]);

        flipEffect.play();

        await wait(TIMEOUT);
      }
    }

    setIsDistrubitionCompleted(true);
  };

  const resetUiCards = () => {
    setDealerCards([]);
    setFirstHandCards([]);
    setSecondHandCards([]);
    setThirdHandCards([]);
    setSplittedFirstHandCards([]);
    setSplittedSecondHandCards([]);
    setSplittedThirdHandCards([]);

    setFirstHandSplittedCard(null);
    setSecondHandSplittedCard(null);
    setThirdHandSplittedCard(null);
    setIsDistrubitionCompleted(false);
  };

  // distribute new card effects
  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.firstHand.cards?.cards || [];

      distributeNewCards(cards, firstHandCards, setFirstHandCards, flipEffect.play);
    }
  }, [activeGameHands.firstHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.secondHand.cards?.cards || [];

      distributeNewCards(cards, secondHandCards, setSecondHandCards, flipEffect.play);
    }
  }, [activeGameHands.secondHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.thirdHand.cards?.cards || [];

      distributeNewCards(cards, thirdHandCards, setThirdHandCards, flipEffect.play);
    }
  }, [activeGameHands.thirdHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.splittedFirstHand.cards?.cards || [];

      distributeNewCards(cards, splittedFirstHandCards, setSplittedFirstHandCards, flipEffect.play);
    }
  }, [activeGameHands.splittedFirstHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.splittedSecondHand.cards?.cards || [];

      distributeNewCards(
        cards,
        splittedSecondHandCards,
        setSplittedSecondHandCards,
        flipEffect.play
      );
    }
  }, [activeGameHands.splittedSecondHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.splittedThirdHand.cards?.cards || [];

      distributeNewCards(cards, splittedThirdHandCards, setSplittedThirdHandCards, flipEffect.play);
    }
  }, [activeGameHands.splittedThirdHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.dealer.cards?.cards || [];

      setTimeout(() => {
        distributeNewCards(cards, dealerCards, setDealerCards, flipEffect.play);
      }, 500);
    }
  }, [activeGameHands.dealer.cards?.cards]);

  // split animations
  React.useEffect(() => {
    const card = activeGameHands.firstHand.cards?.cards[1];

    if (card && activeGameHands.firstHand.hand?.isSplitted) {
      setFirstHandSplittedCard(new BlackjackCard(card, getBlackjackSuit()));

      flipEffect.play();
    }
  }, [activeGameHands.firstHand.hand?.isSplitted, activeGameHands.firstHand.cards?.cards[1]]);

  React.useEffect(() => {
    const card = activeGameHands.secondHand.cards?.cards[1];

    if (card && activeGameHands.secondHand.hand?.isSplitted) {
      setSecondHandSplittedCard(new BlackjackCard(card, getBlackjackSuit()));

      flipEffect.play();
    }
  }, [activeGameHands.secondHand.hand?.isSplitted, activeGameHands.secondHand.cards?.cards[1]]);

  React.useEffect(() => {
    const card = activeGameHands.thirdHand.cards?.cards[1];

    if (card && activeGameHands.thirdHand.hand?.isSplitted) {
      setThirdHandSplittedCard(new BlackjackCard(card, getBlackjackSuit()));

      flipEffect.play();
    }
  }, [activeGameHands.thirdHand.hand?.isSplitted, activeGameHands.thirdHand.cards?.cards[1]]);

  React.useEffect(() => {
    if (initialDataFetched) {
      animateFirstDistribution();
    }
  }, [initialDataFetched]);

  React.useEffect(() => {
    if (!account) {
      onReset();

      resetUiCards();
    }
  }, [account]);

  // this effects used for get initial betAmounts
  React.useEffect(() => {
    if (initialDataFetched) setFirstHandWager(activeGameHands.firstHand.hand?.chipsAmount || 0);
  }, [activeGameHands.firstHand.hand?.chipsAmount, initialDataFetched]);

  React.useEffect(() => {
    if (initialDataFetched) setSecondHandWager(activeGameHands.secondHand.hand?.chipsAmount || 0);
  }, [activeGameHands.secondHand.hand?.chipsAmount, initialDataFetched]);

  React.useEffect(() => {
    if (initialDataFetched) setThirdHandWager(activeGameHands.thirdHand.hand?.chipsAmount || 0);
  }, [activeGameHands.thirdHand.hand?.chipsAmount, initialDataFetched]);

  React.useEffect(() => {
    if (isLastDistributionCompleted) onGameCompleted();
  }, [isLastDistributionCompleted]);

  const formFields = React.useMemo(
    () => ({
      wager,
      firstHandWager,
      secondHandWager,
      thirdHandWager,
      handIndex: activeGameData.activeHandIndex,
    }),
    [wager, firstHandWager, secondHandWager, thirdHandWager, activeGameData.activeHandIndex]
  );

  const debouncedFormFields = useDebounce(formFields, 400);

  React.useEffect(() => {
    onFormChange && onFormChange(debouncedFormFields[0]);
  }, [debouncedFormFields[0]]);

  return (
    <RotationWrapper>
      <span className="lg:wr-hidden">
        <RotatedBackButton />
        <CurrencySelect
          currencyList={currencyList || []}
          selectedCurrency={selectedCurrency}
          balances={balances}
          onChange={onChangeCurrency}
        />
      </span>
      <GameContainer className="wr-relative wr-overflow-hidden wr-pt-0 wr-max-w-[1140px]">
        <SceneContainer
          style={{
            backgroundImage: `url(${CDN_URL}/blackjack/blackjack-bg.png)`,
          }}
          className={cn(
            styles.bjSceneWrapper,
            'wr-relative wr-flex wr-h-[675px] wr-border-0 wr-bg-center !wr-p-0'
          )}
        >
          {/* canvas start */}
          <div
            className={cn(
              styles.canvas,
              'wr-absolute wr-h-full wr-max-h-[675px] wr-w-[1140px] wr-select-none'
            )}
          >
            <img
              src={`${CDN_URL}/blackjack/deck.svg`}
              width={105}
              height={115}
              alt="Justbet Blackjack Deck"
              className="wr-absolute wr-right-[-10px] wr-top-[-20px] wr-z-[5]"
            />
            <img
              src={`${CDN_URL}/blackjack/distributed-deck.svg`}
              width={80}
              height={128}
              alt="Justbet Blackjack Distributed Deck"
              className="wr-absolute wr-left-[-35px] wr-top-[100px] wr-z-[5]"
            />

            {/* dealer cards area start */}
            <div className="wr-absolute wr-h-full wr-w-full">
              {activeGameData.status !== BlackjackGameStatus.NONE && (
                <DealerCardArea
                  hand={activeGameHands.dealer}
                  uiCards={dealerCards}
                  activeGameData={activeGameData}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                />
              )}
            </div>
            {/* dealer cards area end */}

            {/* bet area start */}
            <BetArea
              onClick={() => addWager(selectedChip, BlackjackHandIndex.THIRD)}
              isDisabled={!canPlaceBet(BlackjackHandIndex.THIRD) || isControllerDisabled}
              isDouble={activeGameHands.thirdHand.hand?.isDouble}
              chipAmount={thirdHandWager}
              isInsured={activeGameHands.thirdHand.hand?.isInsured}
              isTurn={isTurn(activeGameHands.thirdHand.handId)}
              className="wr-left-[200px] wr-top-[380px] -wr-translate-x-1/2 -wr-translate-y-1/2"
            />

            <BetArea
              onClick={() => addWager(selectedChip, BlackjackHandIndex.SECOND)}
              isDisabled={!canPlaceBet(BlackjackHandIndex.SECOND) || isControllerDisabled}
              isDouble={activeGameHands.secondHand.hand?.isDouble}
              chipAmount={secondHandWager}
              isInsured={activeGameHands.secondHand.hand?.isInsured}
              isTurn={isTurn(activeGameHands.secondHand.handId)}
              className="wr-left-[50%] wr-top-[520px] -wr-translate-x-1/2 -wr-translate-y-1/2"
            />

            <BetArea
              onClick={() => addWager(selectedChip, BlackjackHandIndex.FIRST)}
              isDisabled={!canPlaceBet(BlackjackHandIndex.FIRST) || isControllerDisabled}
              isDouble={activeGameHands.firstHand.hand?.isDouble}
              chipAmount={firstHandWager}
              isInsured={activeGameHands.firstHand.hand?.isInsured}
              isTurn={isTurn(activeGameHands.firstHand.handId)}
              className="wr-right-[120px] wr-top-[380px] -wr-translate-x-1/2 -wr-translate-y-1/2"
            />
            {/* bet area end */}

            {/* card area start */}
            {activeGameData.status !== BlackjackGameStatus.NONE && (
              <>
                <SplittedCardArea
                  handType={BlackjackHandIndex.SPLITTED_FIRST}
                  hand={activeGameHands.splittedFirstHand}
                  uiCards={splittedFirstHandCards}
                  activeGameData={activeGameData}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                  isSplitted={activeGameHands.firstHand.hand?.isSplitted}
                >
                  <BetArea
                    onClick={() => addWager(selectedChip, BlackjackHandIndex.SPLITTED_FIRST)}
                    isDisabled={
                      !canPlaceBet(BlackjackHandIndex.SPLITTED_FIRST) || isControllerDisabled
                    }
                    isDouble={activeGameHands.splittedFirstHand.hand?.isDouble}
                    chipAmount={activeGameHands.splittedFirstHand.hand?.chipsAmount || 0}
                    isInsured={activeGameHands.splittedFirstHand.hand?.isInsured}
                    isTurn={isTurn(activeGameHands.splittedFirstHand.handId)}
                    className="wr-right-[120px] wr-top-[170px] -wr-translate-x-1/2 -wr-translate-y-1/2"
                  />
                </SplittedCardArea>

                <SplittedCardArea
                  handType={BlackjackHandIndex.SPLITTED_SECOND}
                  hand={activeGameHands.splittedSecondHand}
                  uiCards={splittedSecondHandCards}
                  activeGameData={activeGameData}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                  isSplitted={activeGameHands.secondHand.hand?.isSplitted}
                >
                  <BetArea
                    onClick={() => addWager(selectedChip, BlackjackHandIndex.SPLITTED_SECOND)}
                    isDisabled={
                      !canPlaceBet(BlackjackHandIndex.SPLITTED_SECOND) || isControllerDisabled
                    }
                    isDouble={activeGameHands.splittedSecondHand.hand?.isDouble}
                    chipAmount={activeGameHands.splittedSecondHand.hand?.chipsAmount || 0}
                    isInsured={activeGameHands.splittedSecondHand.hand?.isInsured}
                    isTurn={isTurn(activeGameHands.splittedSecondHand.handId)}
                    className="wr-bottom-[275px] wr-left-[50%] -wr-translate-x-1/2 -wr-translate-y-1/2"
                  />
                </SplittedCardArea>

                <SplittedCardArea
                  handType={BlackjackHandIndex.SPLITTED_THIRD}
                  hand={activeGameHands.splittedThirdHand}
                  uiCards={splittedThirdHandCards}
                  activeGameData={activeGameData}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                  isSplitted={activeGameHands.thirdHand.hand?.isSplitted}
                >
                  <BetArea
                    onClick={() => addWager(selectedChip, BlackjackHandIndex.SPLITTED_THIRD)}
                    isDisabled={
                      !canPlaceBet(BlackjackHandIndex.SPLITTED_THIRD) || isControllerDisabled
                    }
                    isDouble={activeGameHands.splittedThirdHand.hand?.isDouble}
                    chipAmount={activeGameHands.splittedThirdHand.hand?.chipsAmount || 0}
                    isInsured={activeGameHands.splittedThirdHand.hand?.isInsured}
                    isTurn={isTurn(activeGameHands.splittedThirdHand.handId)}
                    className="wr-left-[200px] wr-top-[170px] -wr-translate-x-1/2 -wr-translate-y-1/2"
                  />
                </SplittedCardArea>

                <CardArea
                  handType={BlackjackHandIndex.FIRST}
                  hand={activeGameHands.firstHand}
                  uiCards={firstHandCards}
                  activeGameData={activeGameData}
                  splittedCard={firstHandSplittedCard}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                />
                <CardArea
                  handType={BlackjackHandIndex.SECOND}
                  hand={activeGameHands.secondHand}
                  uiCards={secondHandCards}
                  activeGameData={activeGameData}
                  splittedCard={secondHandSplittedCard}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                />
                <CardArea
                  handType={BlackjackHandIndex.THIRD}
                  hand={activeGameHands.thirdHand}
                  uiCards={thirdHandCards}
                  activeGameData={activeGameData}
                  splittedCard={thirdHandSplittedCard}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                />
              </>
            )}
            {/* card area end */}

            {/* controller start */}
            {activeGameData.status !== BlackjackGameStatus.FINISHED &&
              activeGameData.status !== BlackjackGameStatus.NONE && (
                <MoveController
                  isDistributionCompleted={isDistributionCompleted}
                  isControllerDisabled={isControllerDisabled}
                  activeHandByIndex={activeHandByIndex}
                  activeGameData={activeGameData}
                  activeHandChipAmount={activeHandChipAmount}
                  wager={wager}
                  onHit={onHit}
                  onSplit={onSplit}
                  onDoubleDown={onDoubleDown}
                  onInsure={onInsure}
                  onStand={onStand}
                />
              )}

            <BetController
              wager={wager}
              chipAmount={firstHandWager + secondHandWager + thirdHandWager}
              onWagerChange={setWager}
              maxWager={maxWager}
              minWager={minWager}
              totalWager={totalWager}
              selectedChip={selectedChip}
              onSelectedChipChange={setSelectedChip}
              isDisabled={isControllerDisabled}
              isDistributionCompleted={isDistributionCompleted}
              isLastDistributionCompleted={isLastDistributionCompleted}
              status={activeGameData.status}
              onDeal={() => onDeal(firstHandWager, secondHandWager, thirdHandWager)}
              onClear={() => {
                handleClearWagers();
                onReset();
                resetUiCards();
              }}
              onRebet={() => {
                onReset();
                resetUiCards();
              }}
              onLogin={onLogin}
            />
            {/* controller end */}
          </div>
          {/* canvas end */}
        </SceneContainer>
      </GameContainer>
    </RotationWrapper>
  );
};

export default BlackjackTemplate;
