import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { CDN_URL } from "../../../../constants";
import { genNumberArray } from "../../../../utils/number";
import { cn } from "../../../../utils/style";
import {
  BlackjackCard,
  BlackjackGameResult,
  BlackjackHandStatus,
  calcTotalAmounts,
  GameStruct,
} from "../../../blackjack";
import { SingleBJActiveGameHands, SingleBlackjackHandIndex } from "../..";
import { Card } from "../card";
import styles from "./single-card-area.module.css";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";

interface CardAreaProps {
  handType: SingleBlackjackHandIndex;
  uiCards: (BlackjackCard | null)[];
  splittedCard?: BlackjackCard | null;
  hand: SingleBJActiveGameHands["firstHand"];
  activeGameData: GameStruct;
  isDistributionCompleted: boolean;
  isLastDistributionCompleted: boolean;
  hasSplittedCards: boolean;
  className?: string;
}

export const CardArea: React.FC<CardAreaProps> = ({
  handType,
  uiCards,
  splittedCard,
  hand,
  activeGameData,
  isDistributionCompleted,
  isLastDistributionCompleted,
  hasSplittedCards,
}) => {
  const { cards: cardData, settledResult, handId } = hand;

  const [isCompletedAndBusted, setIsCompletedAndBusted] =
    React.useState<boolean>(false);

  const [isSplittedWithDelay, setIsSplittedWithDelay] =
    React.useState<boolean>(false);

  const [hasSplittedCardsWithDelay, setHasSplittedCardsWithDelay] =
    React.useState<boolean>(false);

  const [delayedCardAmounts, setDelayedCardAmounts] = React.useState({
    amount: 0,
    softHandAmount: 0,
  });

  const isTurn = React.useMemo(
    () => isDistributionCompleted && activeGameData.activeHandIndex === handId,
    [isDistributionCompleted, activeGameData.activeHandIndex, handId]
  );

  const cardAmounts = React.useMemo(() => {
    const _uiCards = uiCards;

    if (hand.hand?.isSplitted && splittedCard) {
      _uiCards[1] = splittedCard;

      return calcTotalAmounts(_uiCards);
    } else return calcTotalAmounts(uiCards);
  }, [uiCards, splittedCard, hand.hand?.isSplitted]);

  React.useEffect(() => {
    setTimeout(() => setDelayedCardAmounts(cardAmounts), 1000);
  }, [cardAmounts]);

  React.useEffect(() => {
    setTimeout(() => setHasSplittedCardsWithDelay(hasSplittedCards), 1000);
  }, [hasSplittedCards]);

  const isBusted = React.useMemo(() => {
    const handStatus = hand.hand?.status;

    if (!isDistributionCompleted) return false;

    if (handStatus === BlackjackHandStatus.BUST) return true;
    else return false;
  }, [isDistributionCompleted, hand.hand?.status, cardAmounts]);

  const isBlackjack = React.useMemo(() => {
    if (!isDistributionCompleted) return false;

    if (cardAmounts.amount === 21) return true;

    if (cardAmounts.softHandAmount === 21) return true;
    else return false;
  }, [isDistributionCompleted, cardAmounts]);

  //result checks
  const isWinner = React.useMemo(() => {
    const _result = settledResult?.result as BlackjackGameResult;

    if (!_result || !isLastDistributionCompleted) return false;

    if (_result === BlackjackGameResult.DEALER_STAND_PLAYER_WIN) return true;

    if (_result === BlackjackGameResult.DEALER_BUST_PLAYER_WIN) return true;

    if (_result === BlackjackGameResult.DEALER_BUST_PLAYER_BLACKJACK)
      return true;
    else return false;
  }, [settledResult, isLastDistributionCompleted]);

  const isLoser = React.useMemo(() => {
    const _result = settledResult?.result as BlackjackGameResult;

    if (!_result || !isLastDistributionCompleted) return false;

    if (_result === BlackjackGameResult.DEALER_BLACKJACK_PLAYER_LOST)
      return true;

    if (_result === BlackjackGameResult.DEALER_BUST_PLAYER_LOST) return true;

    if (_result === BlackjackGameResult.DEALER_STAND_PLAYER_LOST) return true;
    else return false;
  }, [settledResult, isLastDistributionCompleted]);

  const isPush = React.useMemo(() => {
    const _result = settledResult?.result as BlackjackGameResult;

    if (!_result || !isLastDistributionCompleted) return false;

    if (_result === BlackjackGameResult.DEALER_STAND_HAND_PUSH) return true;

    if (Number(_result) == BlackjackGameResult.DEALER_BLACKJACK_HAND_PUSH)
      return true;
    else return false;
  }, [settledResult, isLastDistributionCompleted]);

  const isInsured = React.useMemo(() => {
    const _result = settledResult?.result as BlackjackGameResult;

    if (!_result || !isLastDistributionCompleted) return false;

    if (_result === BlackjackGameResult.DEALER_BLACKJACK_PLAYER_INSURED)
      return true;
    else return false;
  }, [settledResult, isLastDistributionCompleted]);

  React.useEffect(() => {
    if (isDistributionCompleted && isBusted) {
      setTimeout(() => setIsCompletedAndBusted(true), 3500);
    }
  }, [isDistributionCompleted, isBusted]);

  React.useEffect(() => {
    const _isSplitted = hand.hand?.isSplitted;

    if (_isSplitted) setTimeout(() => setIsSplittedWithDelay(true), 500);
    else setIsSplittedWithDelay(false);
  }, [hand.hand?.isSplitted]);

  console.log(uiCards, "uicards");
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  React.useEffect(() => {
    if (isWinner) winEffect.play();
  }, [isWinner]);

  return (
    <div
      className={cn(styles.cardArea, {
        [styles.firstHand as any]: SingleBlackjackHandIndex.FIRST === handType,
      })}
    >
      {genNumberArray(6).map((n) => (
        <Card
          key={n}
          className={cn(
            uiCards[n] && n === 1 && isSplittedWithDelay && styles.hidden,
            uiCards[n] && !isCompletedAndBusted && styles[`card--${n + 1}`],
            uiCards[n] && hasSplittedCards && styles.splitted,
            uiCards[n] && isCompletedAndBusted && styles.busted
          )}
          card={uiCards[n] as BlackjackCard}
          flipped={isCompletedAndBusted ? true : false}
          isTurn={isTurn}
        >
          {n === uiCards.length - 1 && isBusted && (
            <div className={styles.state}>
              <img
                src={`${CDN_URL}/blackjack/blackjack-lose.svg`}
                height={180}
                width={75}
                alt="JustBet Blackjack"
              />
            </div>
          )}

          {n === uiCards.length - 1 && isBlackjack && (
            <div className={styles.state}>
              <img
                src={`${CDN_URL}/blackjack/blackjack-win.svg`}
                height={180}
                width={75}
                alt="JustBet Blackjack"
              />
            </div>
          )}
        </Card>
      ))}

      <Card
        className={cn(
          splittedCard && !isCompletedAndBusted && styles[`card--2`],
          splittedCard && hasSplittedCards && styles.splitted,
          splittedCard && isCompletedAndBusted && styles.busted
        )}
        card={splittedCard || null}
        flipped={isCompletedAndBusted ? true : false}
        isTurn={isTurn}
      />

      {delayedCardAmounts.amount > 0 && !isCompletedAndBusted ? (
        <div
          className={cn(styles.cardAmount, {
            [styles.firstHand as any]:
              SingleBlackjackHandIndex.FIRST === handType,
            [styles.splitted as any]: hasSplittedCards,
          })}
        >
          {delayedCardAmounts.softHandAmount < 22 ? (
            cardData?.isSoftHand ? (
              <span>
                {delayedCardAmounts.softHandAmount === 21
                  ? ""
                  : delayedCardAmounts.amount + "/"}
                {delayedCardAmounts.softHandAmount}
              </span>
            ) : (
              <span>{delayedCardAmounts.amount}</span>
            )
          ) : (
            <span> {delayedCardAmounts.amount} </span>
          )}
        </div>
      ) : (
        ""
      )}

      <AnimatedText
        isWinner={isWinner}
        isLoser={isLoser && !isBusted}
        isPush={isPush}
        isInsured={isInsured}
        isBusted={isBusted}
        handType={handType}
        hasSplittedCards={hasSplittedCards}
      />

      {/* {isDistributionCompleted && (
        <BetArea
          className={cn("wr-top-[82%]", {
            "wr-left-[27%]": hasSplittedCards && isDistributionCompleted,
          })}
          isTurn={isTurn}
        />
      )} */}
    </div>
  );
};

const AnimatedText: React.FC<{
  isWinner: boolean;
  isLoser: boolean;
  isPush: boolean;
  isInsured: boolean;
  isBusted: boolean;
  handType: SingleBlackjackHandIndex;
  hasSplittedCards: boolean;
}> = ({
  isWinner,
  isLoser,
  isPush,
  isInsured,
  isBusted,
  handType,
  hasSplittedCards,
}) => {
  const [showAnimation, setShowAnimation] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isWinner) setShowAnimation(true);

    if (isLoser) setShowAnimation(true);

    if (isPush) setShowAnimation(true);

    if (isInsured) setShowAnimation(true);

    if (isBusted) setShowAnimation(true);
  }, [isWinner, isLoser, isPush, isInsured, isBusted]);

  React.useEffect(() => {
    if (showAnimation) setTimeout(() => setShowAnimation(false), 5500);
  }, [showAnimation]);

  return (
    <div
      className={cn(
        styles.animatedText,
        handType === SingleBlackjackHandIndex.FIRST && styles.firstHand,
        hasSplittedCards && styles.splitted
      )}
    >
      <AnimatePresence>
        <motion.div
          key={`${String(showAnimation)}`}
          initial={{
            opacity: 0.6,
            translateY: 30,
            scaleY: 0.4,
          }}
          animate={{ opacity: 1, translateY: 0, scaleY: 1 }}
          exit={{ opacity: 0.0, translateY: -30, scaleY: 0.4 }}
        >
          <span
            className={cn(styles.text, "font-furore", {
              [styles.loser as any]: isLoser || isBusted,
              [styles.push as any]: isPush || isInsured,
            })}
          >
            {isWinner && showAnimation && "Win!"}
            {isLoser && !isInsured && showAnimation && "Lost!"}
            {isPush && showAnimation && "Push!"}
            {isInsured && showAnimation && "Insured!"}
            {isBusted && showAnimation && "Bust!"}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
