import { Player } from "@lottiefiles/react-lottie-player";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { CDN_URL } from "../../../../constants";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import { wait } from "../../../../utils/promise";
import { cn } from "../../../../utils/style";
import {
  BaccaratGameResult,
  BaccaratGameSettledResult,
  BaccaratSuit,
} from "../../types";
import styles from "./baccarat-card.module.css";
import {
  BaccaratCard,
  countCalculator,
  generateBaccaratSuits,
  getBaccaratIcon,
} from "./card";
import Confetti from "./lottie/confetti.json";

const TIMEOUT = 500;

const initialCountAnimation = {
  opacity: 0,
  y: 20,
};

const countAnimation = {
  opacity: 1,
  y: 0,
};

export interface BaccaratCardAreaProps {
  hands: BaccaratGameResult | null;
  baccaratSettled: BaccaratGameSettledResult | null;
  isDisabled: boolean;
  setIsDisabled: (b: boolean) => void;
  setWinner: (banker: number, player: number) => void;
  onAnimationCompleted: (r: BaccaratGameSettledResult) => void;
}

export const CardArea: React.FC<BaccaratCardAreaProps> = ({
  hands,
  baccaratSettled,
  setIsDisabled,
  setWinner,
  onAnimationCompleted,
}) => {
  const flipEffect = useAudioEffect(SoundEffects.FLIP_CARD);

  const playerLottieRef = React.useRef<any>(null);

  const bankerLottieRef = React.useRef<any>(null);

  const [playerFirstCard, setPlayerFirstCard] =
    React.useState<BaccaratCard | null>(null);

  const [playerSecondCard, setPlayerSecondCard] =
    React.useState<BaccaratCard | null>(null);

  const [playerThirdCard, setPlayerThirdCard] =
    React.useState<BaccaratCard | null>(null);

  const [bankerFirstCard, setBankerFirstCard] =
    React.useState<BaccaratCard | null>(null);

  const [bankerSecondCard, setBankerSecondCard] =
    React.useState<BaccaratCard | null>(null);

  const [bankerThirdCard, setBankerThirdCard] =
    React.useState<BaccaratCard | null>(null);

  const [playerCount, setPlayerCount] = React.useState<number | null>(null);

  const [bankerCount, setBankerCount] = React.useState<number | null>(null);

  const [isAnimationCompleted, setIsAnimationCompleted] =
    React.useState<boolean>(false);

  const isPlayerWinner = React.useMemo(() => {
    if (playerCount !== null && bankerCount !== null && isAnimationCompleted)
      return playerCount > bankerCount;

    return false;
  }, [playerCount, bankerCount, isAnimationCompleted]);

  const isBankerWinner = React.useMemo(() => {
    if (playerCount !== null && bankerCount !== null && isAnimationCompleted)
      return bankerCount > playerCount;

    return false;
  }, [playerCount, bankerCount, isAnimationCompleted]);

  const animate = async () => {
    if (!hands) return;

    const { playerHand, bankerHand } = hands;

    const suits = generateBaccaratSuits();

    const _playerFirstCard = new BaccaratCard(
      playerHand.firstCard,
      suits[0] as BaccaratSuit
    );

    flipEffect.play();

    setPlayerFirstCard(_playerFirstCard);

    setTimeout(() => setPlayerCount(_playerFirstCard.value), TIMEOUT);

    await wait(TIMEOUT);

    const _bankerFirstCard = new BaccaratCard(
      bankerHand.firstCard,
      suits[1] as BaccaratSuit
    );

    flipEffect.play();

    setBankerFirstCard(_bankerFirstCard);

    setTimeout(() => setBankerCount(_bankerFirstCard.value), TIMEOUT);

    await wait(TIMEOUT);

    const _playerSecondCard = new BaccaratCard(
      playerHand.secondCard,
      suits[2] as BaccaratSuit
    );

    flipEffect.play();

    setPlayerSecondCard(_playerSecondCard);

    setTimeout(
      () =>
        setPlayerCount((prev) =>
          prev !== null ? countCalculator(prev, _playerSecondCard.value) : 0
        ),
      TIMEOUT
    );

    await wait(TIMEOUT);

    const _bankerSecondCard = new BaccaratCard(
      bankerHand.secondCard,
      suits[3] as BaccaratSuit
    );

    flipEffect.play();

    setBankerSecondCard(_bankerSecondCard);

    setTimeout(
      () =>
        setBankerCount((prev) =>
          prev !== null ? countCalculator(prev, _bankerSecondCard.value) : 0
        ),
      TIMEOUT
    );

    if (playerHand.hasThirdCard) {
      await wait(TIMEOUT);

      const _playerThirdCard = new BaccaratCard(
        playerHand.thirdCard,
        suits[4] as BaccaratSuit
      );

      flipEffect.play();

      setPlayerThirdCard(_playerThirdCard);

      setTimeout(
        () =>
          setPlayerCount((prev) =>
            prev !== null ? countCalculator(prev, _playerThirdCard.value) : 0
          ),
        TIMEOUT
      );
    }

    if (bankerHand.hasThirdCard) {
      await wait(TIMEOUT);

      const _bankerThirdCard = new BaccaratCard(
        bankerHand.thirdCard,
        suits[5] as BaccaratSuit
      );

      flipEffect.play();

      setBankerThirdCard(_bankerThirdCard);

      setTimeout(
        () =>
          setBankerCount((prev) =>
            prev !== null ? countCalculator(prev, _bankerThirdCard.value) : 0
          ),
        TIMEOUT
      );
    }

    setTimeout(() => {
      setIsAnimationCompleted(true);

      setIsDisabled(false);

      // finish game
    }, TIMEOUT + 350);
  };

  React.useEffect(() => {
    if (hands) animate();

    if (!hands) refresh();
  }, [hands]);

  const refresh = () => {
    setPlayerFirstCard(null);

    setPlayerSecondCard(null);

    setPlayerThirdCard(null);

    setBankerFirstCard(null);

    setBankerSecondCard(null);

    setBankerThirdCard(null);

    setPlayerCount(null);

    setBankerCount(null);

    setIsAnimationCompleted(false);

    flipEffect.play();
  };

  React.useEffect(() => {
    if (isAnimationCompleted && bankerCount !== null && playerCount !== null)
      setWinner(bankerCount, playerCount);
  }, [isAnimationCompleted]);

  React.useEffect(() => {
    if (isAnimationCompleted && baccaratSettled) {
      // on animation completed
      onAnimationCompleted(baccaratSettled);
    }
  }, [isAnimationCompleted, baccaratSettled]);

  React.useEffect(() => {
    if (isPlayerWinner) setTimeout(() => playerLottieRef.current.play(), 100);
  }, [isPlayerWinner]);

  React.useEffect(() => {
    if (isBankerWinner) setTimeout(() => bankerLottieRef.current.play(), 100);
  }, [isBankerWinner]);

  return (
    <div className="wr-absolute wr-left-[47%] wr-top-[45%] wr-z-[5] wr-flex -wr-translate-x-1/2 -wr-translate-y-1/2 wr-items-start wr-justify-center">
      <div className="wr-absolute wr-left-[-325px] wr-top-[110px] wr-h-[200px] wr-w-[160px]">
        <div className="wr-absolute wr-bottom-[-55px] wr-left-1/2 -wr-translate-x-1/2 wr-gap-1 wr-text-center wr-text-md wr-font-bold ">
          <AnimatePresence>
            {playerCount !== null && (
              <motion.div
                initial={initialCountAnimation}
                animate={countAnimation}
                exit={initialCountAnimation}
                className="wr-flex wr-flex-col wr-items-center wr-justify-center wr-gap-2"
              >
                <span>Player</span>
                <div className="wr-flex wr-h-[28px] wr-w-[36px] wr-items-center wr-justify-center wr-overflow-hidden wr-rounded-xl wr-bg-[#396C4C] wr-text-[#8FCDA8]">
                  <motion.div
                    key={playerCount}
                    initial={initialCountAnimation}
                    animate={countAnimation}
                    exit={initialCountAnimation}
                  >
                    {playerCount}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.playerZoneConfetti}>
          {isPlayerWinner && (
            <Player
              ref={playerLottieRef}
              src={Confetti}
              style={{
                width: "200px",
                height: "200px",
              }}
              loop={false}
              speed={1.5}
            />
          )}
        </div>
      </div>
      <div className="wr-absolute wr-left-[220px] wr-top-[110px] wr-h-[200px] wr-w-[160px]">
        <div className="wr-absolute wr-bottom-[-55px] wr-left-1/2 wr-flex -wr-translate-x-1/2 wr-flex-col wr-gap-1 wr-text-center wr-text-md wr-font-bold">
          <AnimatePresence>
            {bankerCount !== null && (
              <motion.div
                initial={initialCountAnimation}
                animate={countAnimation}
                exit={initialCountAnimation}
                className="wr-flex wr-flex-col wr-items-center wr-justify-center wr-gap-2"
              >
                <span>Banker</span>
                <div className="wr-flex wr-h-[28px] wr-w-[36px] wr-items-center wr-justify-center wr-overflow-hidden wr-rounded-xl wr-bg-[#396C4C] wr-text-[#8FCDA8]">
                  <motion.div
                    key={bankerCount}
                    initial={initialCountAnimation}
                    animate={countAnimation}
                    exit={initialCountAnimation}
                  >
                    {bankerCount}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.bankerZoneConfetti}>
          {isBankerWinner && (
            <Player
              ref={bankerLottieRef}
              src={Confetti}
              style={{
                width: "200px",
                height: "200px",
              }}
              loop={false}
              speed={1.5}
            />
          )}
        </div>
      </div>

      <div>
        <img
          width={100}
          height={150}
          className={cn(
            "wr-absolute wr-z-[0] wr-max-h-[150px] wr-max-w-[100px] -wr-translate-x-1/2 -wr-translate-y-1/2",
            styles.playerFirstCard
          )}
          src={`${CDN_URL}/baccarat/stack.svg`}
          alt="Justbet Baccarat Game"
        />

        <img
          width={100}
          height={150}
          className={cn(
            "wr-absolute wr-z-[0] wr-max-h-[150px] wr-max-w-[100px] -wr-translate-x-1/2 -wr-translate-y-1/2",
            styles.bankerFirstCard
          )}
          src={`${CDN_URL}/baccarat/stack.svg`}
          alt="Justbet Baccarat Game"
        />
      </div>

      <div>
        <Card
          card={playerFirstCard}
          flipped={playerFirstCard !== null ? false : true}
          isWinner={isPlayerWinner}
          className={cn(
            playerFirstCard !== null && styles.playerFirstCard,
            playerThirdCard !== null && styles.withThird
          )}
        />
        <Card
          card={playerSecondCard}
          flipped={playerSecondCard !== null ? false : true}
          isWinner={isPlayerWinner}
          className={cn(
            playerSecondCard !== null && styles.playerSecondCard,
            playerThirdCard !== null && styles.withThird
          )}
        />
        <Card
          card={playerThirdCard}
          flipped={playerThirdCard !== null ? false : true}
          isWinner={isPlayerWinner}
          className={cn(playerThirdCard !== null && styles.playerThirdCard)}
        />
        <Card
          card={bankerFirstCard}
          flipped={bankerFirstCard !== null ? false : true}
          isWinner={isBankerWinner}
          className={cn(
            bankerFirstCard !== null && styles.bankerFirstCard,
            bankerThirdCard !== null && styles.withThird
          )}
        />
        <Card
          card={bankerSecondCard}
          flipped={bankerSecondCard !== null ? false : true}
          isWinner={isBankerWinner}
          className={cn(
            bankerSecondCard !== null && styles.bankerSecondCard,
            bankerThirdCard !== null && styles.withThird
          )}
        />
        <Card
          card={bankerThirdCard}
          flipped={bankerThirdCard !== null ? false : true}
          isWinner={isBankerWinner}
          className={cn(bankerThirdCard !== null && styles.bankerThirdCard)}
        />

        {new Array(4).fill(0).map((_, idx) => (
          <Card
            card={null}
            flipped={true}
            className={styles[`fixed-${idx + 1}`]}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};

const Card: React.FC<{
  card: BaccaratCard | null;
  flipped: boolean;
  isWinner?: boolean;
  className?: string;
}> = ({ card, flipped, isWinner, className }) => {
  const [flippedWithDelay, setFlippedWithDelay] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!flipped) setTimeout(() => setFlippedWithDelay(false), 500);

    if (flipped) setFlippedWithDelay(true);
  }, [flipped]);

  return (
    <div
      data-state={flippedWithDelay ? "flipped" : "unflipped"}
      className={cn(styles.card, className && className)}
    >
      <div className={styles.innerWrapper}>
        <div className={cn(styles.front, isWinner && styles.winner)}>
          <div className={styles.cardSuitArea}>
            <CardValue
              suit={card?.suit || BaccaratSuit.CLUBS}
              value={card?.renderValue || ""}
              isUpsideDown={false}
            />
            <div className={styles.logo}>
              <img
                src={`${CDN_URL}/baccarat/card-front-logo.svg`}
                alt="Justbet Baccarat"
              />
            </div>
          </div>
          <div
            className={styles.mainIcon}
            style={{
              backgroundImage: `url(${CDN_URL}/baccarat/card-bg-black.png)`,
            }}
          >
            {getBaccaratIcon(card?.suit || BaccaratSuit.CLUBS)?.main}
          </div>
          <div className={styles.cardSuitArea}>
            <div className={styles.logo}>
              <img
                src={`${CDN_URL}/baccarat/card-front-logo.svg`}
                alt="Justbet Baccarat"
              />
            </div>
            <CardValue
              suit={card?.suit || BaccaratSuit.CLUBS}
              value={card?.renderValue || ""}
              isUpsideDown={true}
            />
          </div>
        </div>
        <div
          className={styles.back}
          style={{
            backgroundImage: `url(${CDN_URL}/baccarat/jb-card-bg.svg)`,
          }}
        />
      </div>
    </div>
  );
};

export const CardValue = ({
  value,
  suit,
  isUpsideDown,
}: {
  value: BaccaratCard["renderValue"];
  suit: BaccaratCard["suit"];
  isUpsideDown: boolean;
}) => {
  return (
    <div
      className={cn(styles.cardValue, {
        [styles.upsideDown as any]: isUpsideDown,
      })}
    >
      <div className={styles.value}> {value} </div>
      <div className={styles.suit}>{getBaccaratIcon(suit)?.suit}</div>
    </div>
  );
};
