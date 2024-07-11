"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { GameContainer, SceneContainer } from "../../../common/containers";
import { CDN_URL } from "../../../constants";
import { useGameOptions } from "../../../game-provider";
import { SoundEffects, useAudioEffect } from "../../../hooks/use-audio-effect";
import { Form } from "../../../ui/form";
import { wait } from "../../../utils/promise";
import { cn } from "../../../utils/style";
import {
  BlackjackCard,
  BlackjackGameStatus,
  distributeNewCards,
  getBlackjackSuit,
  TIMEOUT,
} from "../../blackjack";
import {
  SingleBJDealFormFields,
  SingleBlackjackGameProps,
  SingleBlackjackHandIndex,
} from "..";
import { BetController } from "./bet-controller";
import { CardArea } from "./card-area";
import { DealerCardArea } from "./dealer-card-area";
import styles from "./single-styles.module.css";
import { SplittedCardArea } from "./splitted-card-area";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

type TemplateProps = SingleBlackjackGameProps & {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
};

const SingleBlackjackTemplate: React.FC<TemplateProps> = ({
  minWager,
  maxWager,
  activeGameData,
  activeGameHands,
  initialDataFetched,
  isControllerDisabled = false,

  options,

  onDeal,
  onReset,

  onHit,
  onDoubleDown,
  onSplit,
  onStand,
  onInsure,
  onGameCompleted,
}) => {
  // ui cards
  const [dealerCards, setDealerCards] = React.useState<
    (BlackjackCard | null)[]
  >([]);

  const [firstHandCards, setFirstHandCards] = React.useState<
    (BlackjackCard | null)[]
  >([]);

  const [splittedFirstHandCards, setSplittedFirstHandCards] = React.useState<
    (BlackjackCard | null)[]
  >([]);

  // splitted card states
  const [firstHandSplittedCard, setFirstHandSplittedCard] =
    React.useState<BlackjackCard | null>(null);

  const [isDistributionCompleted, setIsDistrubitionCompleted] =
    React.useState<boolean>(false);

  const flipEffect = useAudioEffect(SoundEffects.FLIP_CARD);

  const { account } = useGameOptions();

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
  }, [
    dealerCards,
    activeGameHands.dealer,
    isDistributionCompleted,
    activeGameData.status,
  ]);

  const activeHandByIndex = React.useMemo(() => {
    switch (activeGameData.activeHandIndex) {
      case activeGameHands.firstHand.handId:
        return activeGameHands.firstHand;

      case activeGameHands.splittedFirstHand.handId:
        return activeGameHands.splittedFirstHand;

      default:
        return {
          hand: null,
          cards: null,
        };
    }
  }, [activeGameData, isDistributionCompleted, activeGameHands]);

  const activeHandChipAmount = React.useMemo(() => {
    switch (activeGameData.activeHandIndex) {
      case activeGameHands.firstHand.handId:
        return activeGameHands.firstHand.hand?.chipsAmount;

      case activeGameHands.splittedFirstHand.handId:
        return activeGameHands.firstHand.hand?.chipsAmount;

      default:
        return 0;
    }
  }, [activeGameData, activeGameHands]);

  const animateFirstDistribution = async () => {
    const { firstHand, splittedFirstHand, dealer } = activeGameHands;

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

    const dealerFirstCard = dealer.cards?.cards[0];

    if (dealerFirstCard) {
      setDealerCards((prev) => [
        ...prev,
        new BlackjackCard(dealerFirstCard, getBlackjackSuit()),
      ]);

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
    }

    //distribute another dealer cards
    for (let i = 1; i <= 5; i++) {
      const dealerCard = dealer.cards?.cards[i];

      if (dealerCard) {
        setDealerCards((prev) => [
          ...prev,
          new BlackjackCard(dealerCard, getBlackjackSuit()),
        ]);

        flipEffect.play();

        await wait(TIMEOUT);
      }
    }

    setIsDistrubitionCompleted(true);
  };

  const resetUiCards = () => {
    setDealerCards([]);
    setFirstHandCards([]);
    setSplittedFirstHandCards([]);

    setFirstHandSplittedCard(null);
    setIsDistrubitionCompleted(false);
  };

  // distribute new card effects
  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.firstHand.cards?.cards || [];

      distributeNewCards(
        cards,
        firstHandCards,
        setFirstHandCards,
        flipEffect.play
      );
    }
  }, [activeGameHands.firstHand.cards?.cards]);

  React.useEffect(() => {
    if (isDistributionCompleted) {
      const cards = activeGameHands.splittedFirstHand.cards?.cards || [];

      distributeNewCards(
        cards,
        splittedFirstHandCards,
        setSplittedFirstHandCards,
        flipEffect.play
      );
    }
  }, [activeGameHands.splittedFirstHand.cards?.cards]);

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
  }, [
    activeGameHands.firstHand.hand?.isSplitted,
    activeGameHands.firstHand.cards?.cards[1],
  ]);

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

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager || 2, {
        message: `Minimum wager is ${minWager}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is ${maxWager}`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: "onSubmit",
    defaultValues: {
      wager: minWager || 2,
    },
  });

  // this effects used for get initial betAmounts
  React.useEffect(() => {
    if (initialDataFetched)
      form.setValue("wager", activeGameHands.firstHand.hand?.chipsAmount || 0);
  }, [activeGameHands.firstHand.hand?.chipsAmount, initialDataFetched]);

  React.useEffect(() => {
    if (isLastDistributionCompleted) onGameCompleted();
  }, [isLastDistributionCompleted]);

  const handleSubmit = (values: SingleBJDealFormFields) => {
    onReset();
    resetUiCards();
    onDeal(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <GameContainer>
          <BetController
            minWager={minWager || 2}
            maxWager={maxWager || 1000}
            activeHandByIndex={activeHandByIndex}
            activeHandChipAmount={activeHandChipAmount || 0}
            canInsure={activeGameData.canInsure}
            status={activeGameData.status}
            isControllerDisabled={isControllerDisabled}
            isDistributionCompleted={isDistributionCompleted}
            onHit={onHit}
            onDoubleDown={onDoubleDown}
            onSplit={onSplit}
            onStand={onStand}
            onInsure={onInsure}
          />
          <SceneContainer
            className={cn(
              "wr-relative wr-flex !wr-p-0 wr-max-w-full",
              styles.sceneWrapper
            )}
            style={{
              backgroundImage: options?.scene?.backgroundImage,
            }}
          >
            {/* canvas start */}
            <div
              className={cn(
                styles.canvas,
                "wr-absolute wr-h-full wr-max-w-[750px] wr-w-[calc(100%_-_28px)] wr-select-none wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-overflow-hidden"
              )}
            >
              <img
                src={`${CDN_URL}/blackjack/bj-table.png`}
                width={410}
                height={105}
                className="wr-absolute wr-z-0 wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-select-none wr-pointer-events-none"
              />

              <img
                src={`${CDN_URL}/blackjack/deck.svg`}
                width={105}
                height={115}
                alt="Justbet Blackjack Deck"
                className="wr-absolute wr-right-0 wr-top-[-20px] wr-z-[5]"
              />
              <img
                src={`${CDN_URL}/blackjack/distributed-deck.svg`}
                width={80}
                height={128}
                alt="Justbet Blackjack Distributed Deck"
                className="wr-absolute wr-left-0 wr-top-[-20px] wr-z-[5]"
              />

              {/* dealer card area start */}
              {activeGameData.status !== BlackjackGameStatus.NONE && (
                <DealerCardArea
                  hand={activeGameHands.dealer}
                  uiCards={dealerCards}
                  activeGameData={activeGameData}
                  isDistributionCompleted={isDistributionCompleted}
                  isLastDistributionCompleted={isLastDistributionCompleted}
                />
              )}
              {/* dealer card area end */}

              {/* card area start */}
              {activeGameData.status !== BlackjackGameStatus.NONE && (
                <>
                  <SplittedCardArea
                    handType={SingleBlackjackHandIndex.SPLITTED_FIRST}
                    hand={activeGameHands.splittedFirstHand}
                    uiCards={splittedFirstHandCards}
                    activeGameData={activeGameData}
                    isDistributionCompleted={isDistributionCompleted}
                    isLastDistributionCompleted={isLastDistributionCompleted}
                    isSplitted={activeGameHands.firstHand.hand?.isSplitted}
                  />
                  <CardArea
                    handType={SingleBlackjackHandIndex.FIRST}
                    hand={activeGameHands.firstHand}
                    uiCards={firstHandCards}
                    activeGameData={activeGameData}
                    splittedCard={firstHandSplittedCard}
                    isDistributionCompleted={isDistributionCompleted}
                    isLastDistributionCompleted={isLastDistributionCompleted}
                    hasSplittedCards={
                      !!activeGameHands.splittedFirstHand.cards?.amountCards
                    }
                  />
                </>
              )}
              {/* card area start end */}
            </div>
            {/* canvas end */}
          </SceneContainer>
        </GameContainer>
      </form>
    </Form>
  );
};

export default SingleBlackjackTemplate;
