import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { CDN_URL } from "../../../../constants";
import { genNumberArray } from "../../../../utils/number";
import { cn } from "../../../../utils/style";
import {
  ActiveGameHands,
  BlackjackGameResult,
  BlackjackHandIndex,
  BlackjackHandStatus,
  GameStruct,
} from "../..";
import { BlackjackCard, calcTotalAmounts } from "../../utils";
import { Card } from "../card";
import styles from "./splitted-card-area.module.css";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";

interface SplittedCardAreaProps {
  handType: BlackjackHandIndex;
  uiCards: (BlackjackCard | null)[];
  hand:
    | ActiveGameHands["splittedFirstHand"]
    | ActiveGameHands["splittedSecondHand"]
    | ActiveGameHands["splittedThirdHand"];
  activeGameData: GameStruct;
  isDistributionCompleted: boolean;
  isLastDistributionCompleted: boolean;
  isSplitted: boolean | undefined;
  className?: string;
  children: React.ReactNode;
}

export const SplittedCardArea: React.FC<SplittedCardAreaProps> = ({
  handType,
  uiCards,
  activeGameData,
  isSplitted,
  hand,
  isDistributionCompleted,
  isLastDistributionCompleted,
  children,
}) => {
  const { cards: cardData, settledResult } = hand;
  const winEffect = useAudioEffect(SoundEffects.WIN_COIN_DIGITAL);

  const [isCompletedAndBusted, setIsCompletedAndBusted] =
    React.useState<boolean>(false);

  const [delayedCardAmounts, setDelayedCardAmounts] = React.useState({
    amount: 0,
    softHandAmount: 0,
  });

  const cardAmounts = React.useMemo(() => calcTotalAmounts(uiCards), [uiCards]);

  React.useEffect(() => {
    setTimeout(() => setDelayedCardAmounts(cardAmounts), 1000);
  }, [cardAmounts]);

  const isBusted = React.useMemo(() => {
    const handStatus = hand.hand?.status;

    if (!isDistributionCompleted) return false;

    if (handStatus === BlackjackHandStatus.BUST) return true;
    else return false;
  }, [isDistributionCompleted, hand.hand?.status]);

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
  }, [settledResult, isLastDistributionCompleted]);

  const isLoser = React.useMemo(() => {
    const _result = settledResult?.result as BlackjackGameResult;

    if (!_result || !isLastDistributionCompleted) return false;

    if (_result === BlackjackGameResult.DEALER_BLACKJACK_PLAYER_LOST)
      return true;

    if (_result === BlackjackGameResult.DEALER_BUST_PLAYER_LOST) return true;

    if (_result === BlackjackGameResult.DEALER_STAND_PLAYER_LOST) return true;
  }, [settledResult, isLastDistributionCompleted]);

  const isPush = React.useMemo(() => {
    const _result = settledResult?.result as BlackjackGameResult;

    if (!_result || !isLastDistributionCompleted) return false;

    if (_result === BlackjackGameResult.DEALER_STAND_HAND_PUSH) return true;

    if (Number(_result) === BlackjackGameResult.DEALER_BLACKJACK_HAND_PUSH)
      return true;
  }, [settledResult, isLastDistributionCompleted]);

  React.useEffect(() => {
    if (isDistributionCompleted && isBusted) {
      setTimeout(() => setIsCompletedAndBusted(true), 3500);
    }
  }, [isDistributionCompleted, isBusted]);

  React.useEffect(() => {
    if (isWinner) winEffect.play();
  }, [isWinner]);

  return (
    <div
      className={cn(styles.splittedCardArea, {
        [styles[`firstHand--${uiCards.length}`] as any]:
          BlackjackHandIndex.SPLITTED_FIRST === handType,
        [styles[`secondHand--${uiCards.length}`] as any]:
          BlackjackHandIndex.SPLITTED_SECOND === handType,
        [styles[`thirdHand--${uiCards.length}`] as any]:
          BlackjackHandIndex.SPLITTED_THIRD === handType,
      })}
    >
      {genNumberArray(6).map((n) => (
        <Card
          key={n}
          className={cn(
            uiCards[n] && isSplitted && n === 0 && styles.hidden,
            uiCards[n] && !isCompletedAndBusted && styles[`card--${n + 1}`],
            uiCards[n] && isCompletedAndBusted && styles.busted
          )}
          card={uiCards[n] as BlackjackCard}
          flipped={isCompletedAndBusted ? true : false}
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

      {isDistributionCompleted && isSplitted && (
        <Card
          className={cn(
            handType === BlackjackHandIndex.SPLITTED_FIRST &&
              styles.unsplittedFirstHand,
            handType === BlackjackHandIndex.SPLITTED_SECOND &&
              styles.unsplittedSecondHand,
            handType === BlackjackHandIndex.SPLITTED_THIRD &&
              styles.unsplittedThirdHand,
            uiCards[0] &&
              isSplitted &&
              !isCompletedAndBusted &&
              styles[`card--1`],
            uiCards[0] && isCompletedAndBusted && styles.busted
          )}
          card={uiCards[0] as BlackjackCard}
          flipped={false}
          removeDelayFromFlipped
        />
      )}

      {delayedCardAmounts.amount > 0 && !isCompletedAndBusted ? (
        <div
          className={cn(styles.cardAmount, {
            [styles.firstHand as any]:
              BlackjackHandIndex.SPLITTED_FIRST === handType,
            [styles.secondHand as any]:
              BlackjackHandIndex.SPLITTED_SECOND === handType,
            [styles.thirdHand as any]:
              BlackjackHandIndex.SPLITTED_THIRD === handType,
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

      <div
        className={cn("wr-transition-all wr-duration-200", {
          "wr-opacity-0": !cardAmounts.amount && !isCompletedAndBusted,
        })}
      >
        {children}
      </div>

      <AnimatedText
        isWinner={isWinner}
        isLoser={isLoser && !isBusted}
        isPush={isPush}
        isBusted={isBusted}
        handType={handType}
      />
    </div>
  );
};

const AnimatedText: React.FC<{
  isWinner: boolean | undefined;
  isLoser: boolean | undefined;
  isPush: boolean | undefined;
  isBusted: boolean | undefined;
  handType: BlackjackHandIndex;
}> = ({ isWinner, isLoser, isPush, isBusted, handType }) => {
  const [showAnimation, setShowAnimation] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isWinner) setShowAnimation(true);

    if (isLoser) setShowAnimation(true);

    if (isPush) setShowAnimation(true);

    if (isBusted) setShowAnimation(true);
  }, [isWinner, isLoser, isPush, isBusted]);

  React.useEffect(() => {
    if (showAnimation) setTimeout(() => setShowAnimation(false), 5500);
  }, [showAnimation]);

  return (
    <div
      className={cn(
        styles.animatedText,
        handType === BlackjackHandIndex.SPLITTED_FIRST && styles.firstHand,
        handType === BlackjackHandIndex.SPLITTED_SECOND && styles.secondHand,
        handType === BlackjackHandIndex.SPLITTED_THIRD && styles.thirdHand
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
              [styles.push as any]: isPush,
            })}
          >
            {isWinner && showAnimation && "Win!"}
            {isLoser && showAnimation && "Lost!"}
            {isPush && showAnimation && "Push!"}
            {isBusted && showAnimation && "Bust!"}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
