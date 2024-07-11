"use client";

import React from "react";

import { CDN_URL } from "../../../../constants";
import { genNumberArray } from "../../../../utils/number";
import { cn } from "../../../../utils/style";
import {
  BlackjackCard,
  BlackjackHandStatus,
  calcTotalAmounts,
  GameStruct,
} from "../../../blackjack";
import { SingleBJActiveGameHands } from "../..";
import { Card } from "../card";
import styles from "./single-dealer-card-area.module.css";

interface DealerCardAreaProps {
  hand: SingleBJActiveGameHands["dealer"];
  uiCards: (BlackjackCard | null)[];
  activeGameData: GameStruct;
  isDistributionCompleted: boolean;
  isLastDistributionCompleted: boolean;
}

export const DealerCardArea: React.FC<DealerCardAreaProps> = ({
  uiCards,
  hand,
  activeGameData,
  isDistributionCompleted,
  isLastDistributionCompleted,
}) => {
  const { cards: cardData, handId, settledResult } = hand;

  const { activeHandIndex } = activeGameData;

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

    if (cardAmounts.amount > 21) return true;

    if (handStatus === BlackjackHandStatus.BUST) return true;
    else return false;
  }, [isDistributionCompleted, hand.hand?.status, cardAmounts]);

  const isBlackjack = React.useMemo(() => {
    if (!isDistributionCompleted) return false;

    if (cardAmounts.amount === 21) return true;

    if (cardAmounts.softHandAmount === 21) return true;
    else return false;
  }, [isDistributionCompleted, cardAmounts]);

  React.useEffect(() => {
    if (isDistributionCompleted && isBusted) {
      setTimeout(() => setIsCompletedAndBusted(true), 3500);
    }
  }, [isDistributionCompleted, isBusted]);

  return (
    <div className={styles.dealerCardArea}>
      {genNumberArray(6).map((n) => (
        <Card
          key={n}
          className={cn({
            [styles[`card--${n + 1}`] as any]:
              uiCards[n] && !isCompletedAndBusted,
            [styles.busted as any]: uiCards[n] && isCompletedAndBusted,
          })}
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

      {delayedCardAmounts.amount > 0 ? (
        <div className={styles.cardAmount}>
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
    </div>
  );
};
