'use client';

import React from 'react';

import { CDN_URL } from '../../../../constants';
import { cn } from '../../../../utils/style';
import { BlackjackCard, BlackjackSuit, getBlackjackIcon } from '../../utils';
import styles from './card.module.css';
import { TIMEOUT } from '../../constants';

interface CardProps {
  card: BlackjackCard | null;
  flipped: boolean;
  removeDelayFromFlipped?: boolean;
  isWinner?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  card,
  flipped,
  removeDelayFromFlipped,
  isWinner,
  className,
  children,
}) => {
  const [flippedWithDelay, setFlippedWithDelay] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!card) return;

    if (removeDelayFromFlipped) setFlippedWithDelay(flipped);

    if (!flipped) setTimeout(() => setFlippedWithDelay(false), TIMEOUT);

    if (flipped) setFlippedWithDelay(true);
  }, [flipped, card, removeDelayFromFlipped]);

  return (
    <div
      data-state={flippedWithDelay ? 'flipped' : 'unflipped'}
      className={cn(styles.card, className && className)}
    >
      <div className={styles.innerWrapper}>
        <div className={cn(styles.front, isWinner && styles.winner)}>
          <div className={styles.cardSuitArea}>
            <CardValue
              suit={card?.suit || BlackjackSuit.CLUBS}
              value={card?.renderValue || ''}
              isUpsideDown={false}
            />
            <div className={styles.logo}>
              <img src={`${CDN_URL}/blackjack/card-front-logo.svg`} alt="Justbet Blackjack" />
            </div>
          </div>
          <div
            className={styles.mainIcon}
            style={{
              backgroundImage: `url(${CDN_URL}/blackjack/card-bg-black.png)`,
            }}
          >
            {getBlackjackIcon(card?.suit || BlackjackSuit.CLUBS)?.main}
          </div>
          <div className={styles.cardSuitArea}>
            <div className={styles.logo}>
              <img src={`${CDN_URL}/blackjack/card-front-logo.svg`} alt="Justbet Blackjack" />
            </div>
            <CardValue
              suit={card?.suit || BlackjackSuit.CLUBS}
              value={card?.renderValue || ''}
              isUpsideDown={true}
            />
          </div>
        </div>
        <div
          className={styles.back}
          style={{
            backgroundImage: `url(${CDN_URL}/blackjack/card-bg.svg)`,
          }}
        />
      </div>

      {children && !flippedWithDelay && children}
    </div>
  );
};

export const CardValue = ({
  value,
  suit,
  isUpsideDown,
}: {
  value: BlackjackCard['renderValue'];
  suit: BlackjackCard['suit'];
  isUpsideDown: boolean;
}) => {
  return (
    <div
      className={cn(styles.cardValue, {
        [styles.upsideDown as any]: isUpsideDown,
      })}
    >
      <div className={styles.value}> {value} </div>
      <div className={styles.suit}>{getBlackjackIcon(suit)?.suit}</div>
    </div>
  );
};
