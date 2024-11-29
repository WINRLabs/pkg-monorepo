'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'debounce';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { Form, FormField } from '../../../ui/form';
import { VideoPokerResult } from '../constants';
import { useVideoPokerTheme, VideoPokerTheme, VideoPokerThemeProvider } from '../provider/theme';
import useVideoPokerGameStore, { VideoPokerStatus } from '../store';
import { CardStatus, parseCards, VideoPokerFormFields } from '../types';
import { VideoPokerBetController } from './bet-controller';
import { VideoPokerResults } from './game-scene';
import { CardComponent } from './game-scene/card';

interface TemplateProps {
  minWager?: number;
  maxWager?: number;
  isLoading: boolean;
  activeGame: {
    status: VideoPokerStatus;
    cards: number;
    hasActiveGame: boolean;
  };
  settledCards?: {
    status: VideoPokerStatus;
    cards: number;
    result: VideoPokerResult;
    payout: number;
  };
  isPinNotFound?: boolean;
  handleFinishGame: (data: VideoPokerFormFields) => Promise<void>;
  handleStartGame: (data: VideoPokerFormFields) => Promise<void>;
  onFormChange?: (fields: VideoPokerFormFields) => void;
  onAnimationCompleted?: (payout: number) => void;
  onLogin?: () => void;
  theme?: Partial<VideoPokerTheme>;
}

const VideoPokerTemplate = ({
  minWager,
  maxWager,
  isLoading,
  activeGame,
  settledCards,
  isPinNotFound,
  onFormChange,
  handleFinishGame,
  handleStartGame,
  onAnimationCompleted,
  onLogin,
  theme,
}: TemplateProps) => {
  const [currentCards, setCurrentCards] = React.useState<any[]>(new Array(5).fill(0));

  const { updateState, status } = useVideoPokerGameStore(['updateState', 'status']);

  const { cardStackImage } = useVideoPokerTheme();

  const formSchema = z.object({
    wager: z
      .number()
      .min(minWager || 1, {
        message: `Minimum wager is $${minWager || 1}`,
      })
      .max(maxWager || 2000, {
        message: `Maximum wager is $${maxWager || 2000}`,
      }),
    cardsToSend: z.array(z.nativeEnum(CardStatus)).length(5),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'onSubmit',
    defaultValues: {
      wager: 1,
      cardsToSend: [
        CardStatus.CLOSED,
        CardStatus.CLOSED,
        CardStatus.CLOSED,
        CardStatus.CLOSED,
        CardStatus.CLOSED,
      ],
    },
  });

  const wager = form.watch('wager');

  const maxPayout = React.useMemo(() => {
    return wager * 100;
  }, [wager]);

  const handleSubmit = async (values: VideoPokerFormFields) => {
    updateState({
      status: VideoPokerStatus.None,
      gameResult: VideoPokerResult.LOST,
    });

    if (status === VideoPokerStatus.Dealt) {
      await handleFinishGame(values);
    } else {
      await handleStartGame(values);
    }
  };

  React.useEffect(() => {
    if (!activeGame.hasActiveGame) return;

    form.setValue('cardsToSend', [
      CardStatus.OPEN,
      CardStatus.OPEN,
      CardStatus.OPEN,
      CardStatus.OPEN,
      CardStatus.OPEN,
    ]);

    const cards = activeGame.cards == 0 ? new Array(5).fill(0) : parseCards(activeGame.cards);

    setCurrentCards(cards);

    updateState({
      status: VideoPokerStatus.Dealt,
    });
  }, [activeGame]);

  React.useEffect(() => {
    if (!settledCards) return;

    form.setValue('cardsToSend', [
      CardStatus.OPEN,
      CardStatus.OPEN,
      CardStatus.OPEN,
      CardStatus.OPEN,
      CardStatus.OPEN,
    ]);

    if (settledCards.status == VideoPokerStatus.Final) {
      const parsedCards = parseCards(settledCards.cards);

      setCurrentCards(parsedCards);

      updateState({
        status: VideoPokerStatus.Final,
      });

      setTimeout(() => {
        updateState({
          gameResult: Number(settledCards.result),
        });

        onAnimationCompleted && onAnimationCompleted(settledCards.payout);
      }, 1000);
    }

    if (settledCards.status == VideoPokerStatus.Dealt) {
      const parsedCards = parseCards(settledCards.cards);

      setCurrentCards(parsedCards);

      updateState({
        status: VideoPokerStatus.Dealt,
      });
    }
  }, [settledCards]);

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      onFormChange && onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <VideoPokerThemeProvider theme={theme || {}}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <GameContainer>
            <VideoPokerBetController
              maxPayout={maxPayout}
              maxWager={maxWager || 2000}
              minWager={minWager || 1}
              isPinNotFound={isPinNotFound}
              onLogin={onLogin}
            />
            <SceneContainer
              className="wr-relative max-lg:wr-h-[420px] wr-h-[640px] lg:!wr-justify-start wr-overflow-hidden lg:wr-pb-0 lg:wr-pt-0 wr-flex wr-justify-end"
              style={{
                perspectiveOrigin: 'bottom',
                perspective: '1000px',
              }}
            >
              <img
                src={theme?.cardStackImage || cardStackImage}
                width={170}
                height={234}
                alt={'card_stack'}
                className="wr-mb-[68px] wr-hidden lg:!wr-block"
              />
              <VideoPokerResults />
              <div className="wr-left-0 max-lg:wr-top-3 lg:wr-bottom-0 wr-w-full lg:wr-h-full wr-flex wr-justify-center  wr-absolute max-lg:wr-scale-[.6] max-lg:wr-w-full max-lg:wr-flex max-lg:wr-justify-center wr-items-center">
                {isLoading ? (
                  <>loading</>
                ) : (
                  <>
                    <FormField
                      name="cardsToSend"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <React.Fragment>
                            <FormField
                              control={form.control}
                              name="cardsToSend"
                              render={({ field }) => {
                                return (
                                  <React.Fragment>
                                    {currentCards?.map((card, i) => (
                                      <CardComponent card={card} index={i} key={i} field={field} />
                                    ))}
                                  </React.Fragment>
                                );
                              }}
                            />
                          </React.Fragment>
                        );
                      }}
                    />
                  </>
                )}
              </div>
            </SceneContainer>
          </GameContainer>
        </form>
      </Form>
    </VideoPokerThemeProvider>
  );
};

export default VideoPokerTemplate;
