import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { CDN_URL } from '../../../../constants';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { cn } from '../../../../utils/style';
import { useVideoPokerTheme } from '../../provider/theme';
import useVideoPokerGameStore, { VideoPokerStatus } from '../../store';
import { Card, CardStatus, VideoPokerForm } from '../../types';
import styles from './video-poker-card.module.css';

const BigDiamonds = <img src={`${CDN_URL}/blackjack/suits/big-diamonds.svg`} />;
const BigClubs = <img src={`${CDN_URL}/blackjack/suits/big-clubs.svg`} />;
const BigHearts = <img src={`${CDN_URL}/blackjack/suits/big-hearts.svg`} />;
const BigSpades = <img src={`${CDN_URL}/blackjack/suits/big-spades.svg`} />;

const SmallClubs = <img src={`${CDN_URL}/blackjack/suits/small-clubs.svg`} />;
const SmallDiamonds = <img src={`${CDN_URL}/blackjack/suits/small-diamonds.svg`} />;
const SmallHearts = <img src={`${CDN_URL}/blackjack/suits/small-hearts.svg`} />;
const SmallSpades = <img src={`${CDN_URL}/blackjack/suits/small-spades.svg`} />;

const getIcon = (className: Card['className']) => {
  switch (className) {
    case 'spades':
      return { main: BigSpades, suite: SmallSpades };

    case 'hearts':
      return { main: BigHearts, suite: SmallHearts };

    case 'diamonds':
      return { main: BigDiamonds, suite: SmallDiamonds };

    case 'clubs':
      return { main: BigClubs, suite: SmallClubs };
  }
};

export const CardValue = ({
  value,
  cardType,
  isUpsideDown,
}: {
  value: Card['value'];
  cardType: Card['className'];
  isUpsideDown: boolean;
}) => {
  return (
    <div
      className={cn('wr-z-10 wr-flex wr-flex-col wr-items-center wr-justify-center', {
        'wr-rotate-180': isUpsideDown,
      })}
    >
      <div className={'wr-mb-[3px] wr-text-2xl wr-font-bold wr-leading-8'}>{value}</div>
      <div>{getIcon(cardType)?.suite}</div>
    </div>
  );
};

const angles = [-30, -15, 0, 15, 30];

export const CardComponent: React.FC<{
  card: Card;

  index: number;
  field: ControllerRenderProps<
    {
      wager: number;
      cardsToSend: CardStatus[];
    },
    'cardsToSend'
  >;
}> = ({ card, index }) => {
  const theme = useVideoPokerTheme();

  const [flipped, setFlipped] = React.useState(false);

  const flipCardEffect = useAudioEffect(SoundEffects.POKER_CARD_FOLD);
  const clickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const [isFirstAnimationFinished, setIsFirstAnimationFinished] = React.useState(false);

  const [transformDegree, setTransformDegree] = React.useState(0);

  const form = useFormContext() as VideoPokerForm;

  const { status } = useVideoPokerGameStore(['status']);

  const cardsToSend = form.watch('cardsToSend');

  const [animatedObj, setAnimatedObj] = React.useState<any>({
    'wr-mr-0 wr-ml-0 wr-p-0': true,
  });

  React.useEffect(() => {
    if (status === VideoPokerStatus.Dealt && isFirstAnimationFinished) {
      if (cardsToSend[index] === CardStatus.CLOSED) setFlipped(true);
      else setFlipped(false);
    }
  }, [isFirstAnimationFinished, status, cardsToSend]);

  React.useEffect(() => {
    const openHand = {
      'lg:!-wr-bottom-14 wr-mr-40 wr-mt-5': index === 0,
      'wr-mr-20': index === 1,
      '': index === 2,
      'wr-ml-20 ': index === 3,
      'lg:!-wr-bottom-14 wr-ml-40 wr-mt-5': index === 4,
    };

    const isMobile = window.innerWidth < 768;
    if (status === VideoPokerStatus.None) {
      setIsFirstAnimationFinished(false);

      flipCardEffect.play();

      setFlipped(true);

      setTransformDegree(0);

      if (isMobile) {
        setTransformDegree(angles[index] as number);
        setAnimatedObj(openHand);
      } else {
        setAnimatedObj({
          'wr-mr-0 wr-ml-0 wr-p-0': true,
        });
      }
    } else {
      flipCardEffect.play();

      const timeout = setTimeout(() => {
        setFlipped(false);
      }, 1000);

      setTimeout(() => {
        setTransformDegree(angles[index] as number);

        setAnimatedObj(openHand);

        setIsFirstAnimationFinished(true);
      }, 1200);
    }
  }, [status, index]);

  console.log(theme.cardBack);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'wr-absolute wr-mb-0 wr-h-[190px] wr-w-[128px] wr-transform-gpu wr-rounded-lg wr-bg-transparent wr-transition-[bottom_750ms,margin-left_300ms,margin-right_300ms,padding-top_300ms] wr-duration-[750ms] wr-perspective-1000 wr-top-14 lg:wr-top-[unset]',
          animatedObj,

          {
            'wr-bottom-full lg:wr-opacity-0': status === VideoPokerStatus.None,
          },
          {
            'lg:-wr-bottom-10 wr-block wr-opacity-100':
              status === VideoPokerStatus.Dealt || status === VideoPokerStatus.Final,
          }
        )}
        data-state={flipped ? 'flipped' : 'unflipped'}
        style={{
          transform: `rotate(${transformDegree}deg)`,
          transformOrigin: 'bottom center',
          boxShadow: '0px 0px 10px #09090B20',
        }}
      >
        <CheckboxPrimitive.Root
          className={cn(
            'wr-relative wr-h-full wr-w-full wr-text-center wr-transition-all wr-duration-500 [transform-style:preserve-3d]',
            [styles[card.className]],
            { '[transform:rotateY(180deg)]': flipped }
          )}
          checked={cardsToSend[index] === CardStatus.OPEN}
          onCheckedChange={(checked) => {
            const newCards = [...cardsToSend];

            newCards[index] = checked ? CardStatus.OPEN : CardStatus.CLOSED;

            form.setValue('cardsToSend', newCards);
            clickEffect.play();
          }}
          disabled={status !== VideoPokerStatus.Dealt}
        >
          <div
            className={cn(
              'wr-absolute wr-left-0 wr-top-0 wr-z-20 wr-flex wr-h-full wr-w-full wr-flex-col wr-justify-between wr-rounded-lg wr-bg-white wr-text-black wr-backface-hidden'
              /*   {
                "rounded-lg border-4 border-green-500":
                  cardsToSend[index] === CardStatus.CLOSED &&
                  status === VideoPokerStatus.Active,
              }, */
            )}
          >
            <div className={'wr-flex wr-items-center wr-justify-between wr-px-2 wr-py-3'}>
              <CardValue value={card.value} cardType={card.className} isUpsideDown={false} />
              <div className={'wr-relative wr-z-20 wr-h-8 wr-w-8 wr-rounded-full'}>
                <img
                  src={theme.cardFrontLogo || `${CDN_URL}/baccarat/card-front-logo.svg`}
                  alt="Justbet Video Poker"
                />
              </div>
            </div>
            <div
              className={
                'wr-absolute wr-left-1/2 wr-top-1/2 wr-z-0 wr-flex wr-h-[calc(100%-40px)] wr-w-[calc(100%-40px)] -wr-translate-x-1/2 -wr-translate-y-1/2 wr-items-center wr-justify-center'
              }
            >
              {getIcon(card.className)?.main}
            </div>
            <div className={'wr-flex wr-items-center wr-justify-between wr-px-2 wr-py-3'}>
              <div className={'wr-relative wr-z-20 wr-h-8 wr-w-8 wr-rounded-full'}>
                <img
                  src={theme.cardFrontLogo || `${CDN_URL}/baccarat/card-front-logo.svg`}
                  alt="Justbet Video Poker"
                />
              </div>
              <CardValue value={card.value} cardType={card.className} isUpsideDown={true} />
            </div>
          </div>
          <div
            className={
              'wr-absolute wr-left-0 wr-top-0 wr-z-50 wr-h-full wr-w-full wr-bg-cover wr-bg-no-repeat wr-backface-hidden [transform:rotateY(180deg)]'
            }
            style={{
              backgroundImage: `url(${theme.cardBack})`,
            }}
          />
        </CheckboxPrimitive.Root>
      </motion.div>
    </AnimatePresence>
  );
};
