'use client';

import * as Progress from '@radix-ui/react-progress';
import { Token } from '@winrlabs/types';
import debug from 'debug';
import React from 'react';
import { Unity } from 'react-unity-webgl';

import { UnityGameContainer } from '../../../common/containers';
import { UnityFullscreenButton } from '../../../common/controller';
import { useGameOptions } from '../../../game-provider';
import useMediaQuery from '../../../hooks/use-media-query';
import { wait } from '../../../utils/promise';
import { cn } from '../../../utils/style';
import { toDecimals, toFormatted } from '../../../utils/web3';
import { ReelSpinSettled, Slots_Unity_Events, Slots_Unity_Methods } from '../core/types';
import { useUnityPrincessWinr } from './hooks/use-princess-winr-unity';
import { usePrincessWinrGameStore } from './store';
import { PrincessWinrFormFields } from './types';

interface TemplateProps {
  onRefresh: () => void;
  bet: () => Promise<void>;
  buyFreeSpins: () => Promise<void>;
  freeSpin: () => Promise<void>;
  onError?: (e: any) => void;
  onFormChange: (fields: PrincessWinrFormFields) => void;
  onAutoBetModeChange?: (isAutoBetMode: boolean) => void;

  previousFreeSpinCount: number;
  previousFreeSpinWinnings: number;
  previousMultiplier: number;
  gameEvent: ReelSpinSettled;
  buildedGameUrl: string;
  buildedGameUrlMobile: string;
  selectedToken: Token;
}

declare global {
  interface Window {
    GetMessageFromUnity?: (name: string, eventData: string) => void;
  }
}

type UnityEventData = {
  name: string;
  strParam: string;
};

const unityEventDefaultValue: UnityEventData = {
  name: '',
  strParam: '',
};

const log = debug('worker:PrincessWinrTemplate');

export const PrincessWinrTemplate = ({
  onRefresh,
  bet,
  buyFreeSpins,
  freeSpin,
  onError,
  onFormChange,
  onAutoBetModeChange,

  gameEvent,
  previousFreeSpinCount,
  previousFreeSpinWinnings,
  previousMultiplier,
  buildedGameUrl,
  buildedGameUrlMobile,
  selectedToken,
}: TemplateProps) => {
  const {
    sendMessage,
    isLoaded,
    loadingProgression,
    unityProvider,
    handleLogin,
    handleSetBalance,
    detachAndUnloadImmediate,
    handleUpdateWinText,
    handleUnlockUi,
    handleSendGrid,
    handleEnterFreespinWithoutScatter,
    handleExitFreespin,
    handleFreespinAmount,
    hideFreeSpinText,
    handleUpdateMultiplier,
    handleSpinStatus,
  } = useUnityPrincessWinr({ buildedGameUrl, buildedGameUrlMobile });

  const {
    betAmount,
    freeSpins,
    isDoubleChance,
    setBetAmount,
    setIsDoubleChance,
    setFreeSpins,
    setCurrentPayoutAmount,
    currentPayoutAmount,
    setIsInFreeSpinMode,
    isInFreeSpinMode,
    isLoggedIn,
    setIsLoggedIn,
  } = usePrincessWinrGameStore();

  const { account } = useGameOptions();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [currentTumbleAmount, setCurrentTumbleAmount] = React.useState(0);
  const [isInAutoPlay, setIsInAutoPlay] = React.useState(false);
  const [initialBuyEvent, setInitialBuyEvent] = React.useState<any>(undefined);
  const [wonFreeSpins, setWonFreeSpins] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const percentageRef = React.useRef(0);

  const [currentAction, setCurrentAction] = React.useState<
    'submit' | 'initialAutoplay' | 'buyFeature' | 'freeSpin' | 'autoPlay'
  >();

  const currentBalanceInDollar = React.useMemo(
    () => account?.balanceAsDollar || 0,
    [account?.balanceAsDollar]
  );

  React.useEffect(() => {
    percentageRef.current = loadingProgression * 100;
  }, [loadingProgression]);

  const actualBetAmount = isDoubleChance ? betAmount + betAmount * 0.5 : betAmount;

  const handleFreespin = async () => {
    log('FREESPIN');
    await wait(300);
    setCurrentTumbleAmount(0);
    setWonFreeSpins(false);
    setInitialBuyEvent(undefined);
    setCurrentAction('freeSpin');

    try {
      await freeSpin();
    } catch (e: any) {}
  };

  const handleBuy = async () => {
    setCurrentPayoutAmount(0);
    setCurrentTumbleAmount(0);
    handleUpdateWinText('0');
    setInitialBuyEvent(undefined);
    setWonFreeSpins(false);

    setCurrentAction('buyFeature');

    try {
      await buyFreeSpins();
    } catch (e: any) {
      setInitialBuyEvent(undefined);
      handleExitFreespin();
      handleFreespinAmount(0);
      hideFreeSpinText();
      setIsInFreeSpinMode(false);
    }
  };

  const handleSubmit = async () => {
    if (isInFreeSpinMode) return;
    if (isInAutoPlay) return;

    setInitialBuyEvent(undefined);
    hideFreeSpinText();
    setCurrentPayoutAmount(0);
    setCurrentTumbleAmount(0);
    setWonFreeSpins(false);
    // for event handling
    setCurrentAction('submit');

    try {
      await bet();
    } catch (e: any) {
      handleUnlockUi();
    }
  };

  const handleAutoPlay = async () => {
    setInitialBuyEvent(undefined);

    if (isInFreeSpinMode) return;
    if (!isInAutoPlay) return;

    setCurrentPayoutAmount(0);
    setCurrentTumbleAmount(0);
    setWonFreeSpins(false);
    setCurrentAction('autoPlay');

    try {
      await bet();
    } catch (e: any) {
      handleUnlockUi();
    }
  };

  const handleInitialAutoPlay = async () => {
    log('INITIAL AUTOPLAY');

    setInitialBuyEvent(undefined);

    if (isInFreeSpinMode) return;

    setCurrentPayoutAmount(0);
    setCurrentTumbleAmount(0);
    setWonFreeSpins(false);

    setCurrentAction('initialAutoplay');

    try {
      await bet();
    } catch (e: any) {
      handleUnlockUi();
    }
  };

  // Wrap the listener in a useCallback
  const handleMessageFromUnity = React.useCallback(
    (name: string, strParam: string) => {
      const obj: UnityEventData = {
        name,
        strParam,
      };

      setTimeout(() => {
        if (obj.name === Slots_Unity_Events.BET) {
          if (!isInFreeSpinMode || !isInAutoPlay) {
            handleSubmit();
          } else {
            return;
          }
        }

        if (obj.name === 'M3_OnActiveAutoSpinMode') {
          log('ACTIVATE AUTOPLAY');

          handleInitialAutoPlay();

          setIsInAutoPlay(true);
        }

        if (obj.name === 'M3_ScatterMatch') {
          log('SCATTER MATCH');

          if (currentAction == 'buyFeature') {
            handleEnterFreespinWithoutScatter();
          }

          if (!isInFreeSpinMode) {
            setIsDoubleChance(false);

            handleFreespinAmount(freeSpins);

            setIsInFreeSpinMode(true);

            setIsInAutoPlay(false);

            handleEnterFreespinWithoutScatter();
          }
        }

        if (obj.name === 'M3_OnDeactiveAutoSpinMode') {
          log('DEACTIVATE AUTOPLAY');

          setIsInAutoPlay(false);
        }

        if (obj.name === 'M3_WelcomeSpinClick') {
          handleLogin();

          setIsLoggedIn(true);
        }

        if (obj.name === Slots_Unity_Events.CHANGE_BET) {
          setBetAmount(Number(obj.strParam));
        }

        if (obj.name === Slots_Unity_Events.DOUBLE_CHANCE_CLICK) {
          log('DOUBLE CHANCE CLICK', obj.strParam);

          log('DOUBLE CHANCE CLICK VAL', obj.strParam === 'true');

          setIsDoubleChance(obj.strParam === 'true');
        }

        if (obj.name === Slots_Unity_Events.GRID_ANIMATION_FINISHED) {
          log('GRID ANIMATION FINISHED');

          const payout = toDecimals(gameEvent?.payoutMultiplier * gameEvent?.betAmount, 2);

          if (payout > 0 && gameEvent.payoutMultiplier > 0) {
            setCurrentPayoutAmount(currentPayoutAmount + payout);
            handleUpdateWinText((currentPayoutAmount + payout).toString());
          }

          if (isInFreeSpinMode) {
            sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SetFreeSpinCount|${freeSpins}`);

            if (freeSpins === 0) {
              setTimeout(() => {
                handleExitFreespin();

                setIsInFreeSpinMode(false);

                setIsInAutoPlay(false);

                sendMessage(
                  'WebGLHandler',
                  'ReceiveMessage',
                  Slots_Unity_Methods.DEACTIVE_AUTOBET_MODE
                );

                sendMessage(
                  'WebGLHandler',
                  'ReceiveMessage',
                  `M3_OpenCongForEndFreeSpin|${toDecimals(currentPayoutAmount + payout, 2)}`
                );

                handleUnlockUi();
              }, 2000);
            } else {
              handleFreespin();
            }
          } else if (isInAutoPlay && !wonFreeSpins) {
            log('GRID ANIMATION FINISHED AND CALLED AUTOPLAY');

            handleAutoPlay();
          } else if (!wonFreeSpins) {
            handleUnlockUi();
          }

          onRefresh();
        }

        if (obj.name === Slots_Unity_Events.BUY_FEATURE_CLICK) {
          handleBuy();

          setIsInFreeSpinMode(true);
        }

        if (obj.name === Slots_Unity_Events.CLOSED_CONGRATULATIONS_PANEL) {
          if (isInFreeSpinMode && initialBuyEvent && initialBuyEvent?.freeSpinsLeft > 0) {
            const event = initialBuyEvent;

            sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

            handleSendGrid(event.grid);

            setFreeSpins(event.freeSpinsLeft);

            sendMessage(
              'WebGLHandler',
              'ReceiveMessage',
              `M3_SetFreeSpinCount|${event.freeSpinsLeft}`
            );
          }

          if (isInFreeSpinMode && !initialBuyEvent) {
            handleFreespin();
          }
        }

        if (obj.name === Slots_Unity_Events.SCATTER_TUMBLE_AMOUNT) {
          log('SCATTER TUMBLE AMOUNT', obj.strParam);
          const event = gameEvent;

          if (event.payoutMultiplier > 0) {
            const payout = toDecimals(event.payoutMultiplier * event.betAmount, 2);

            setCurrentPayoutAmount(payout);

            handleUpdateWinText(payout.toString());
          }
        }

        if (obj.name === Slots_Unity_Events.TUMBLE_AMOUNT) {
          log('TUMBLE AMOUNT', obj.strParam);

          setCurrentTumbleAmount(currentTumbleAmount + Number(obj.strParam));
          handleUpdateWinText(
            (currentPayoutAmount + currentTumbleAmount + Number(obj.strParam)).toString()
          );
        }
      }, 10);
    },
    [
      sendMessage,
      betAmount,
      currentPayoutAmount,
      currentTumbleAmount,
      isInFreeSpinMode,
      freeSpins,
      initialBuyEvent,
      isInAutoPlay,
      setIsDoubleChance,
      isDoubleChance,
      wonFreeSpins,
      previousFreeSpinCount,
      currentAction,
      handleSubmit,
      handleFreespin,
      handleBuy,
      handleAutoPlay,
    ]
  );

  React.useEffect(() => {
    if (currentAction == 'submit' && gameEvent?.type == 'Game') {
      handleSendGrid(gameEvent.grid);

      onFormChange({ betAmount, actualBetAmount, isDoubleChance });
      log('SUBMIT gameEvent', gameEvent);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      setFreeSpins(gameEvent.freeSpinsLeft);
    }

    if (currentAction == 'buyFeature' && gameEvent?.type == 'Game') {
      if (
        !window.GetMessageFromUnity ||
        typeof window.GetMessageFromUnity === 'undefined' ||
        typeof window.GetMessageFromUnity !== 'function'
      ) {
        window.GetMessageFromUnity = handleMessageFromUnity;
      }

      log('buy feature event', gameEvent.grid);
      log('grid', JSON.stringify(gameEvent.grid).replace(/,/g, ', '));

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

      handleSendGrid(gameEvent.grid);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      setFreeSpins(gameEvent.freeSpinsLeft);
      onRefresh();
    }

    if (currentAction == 'freeSpin' && gameEvent?.type == 'Game') {
      const _betAmount = toDecimals(gameEvent.betAmount, 2);

      if (
        !window.GetMessageFromUnity ||
        typeof window.GetMessageFromUnity === 'undefined' ||
        typeof window.GetMessageFromUnity !== 'function'
      ) {
        window.GetMessageFromUnity = handleMessageFromUnity;
      }

      if (previousFreeSpinCount > 0)
        sendMessage(
          'WebGLHandler',
          'ReceiveMessage',
          `M3_SetBetValue|${Math.round(_betAmount / 0.1) * 0.1}`
        );

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

      log('free spin event', gameEvent);

      log('grid', JSON.stringify(gameEvent.grid).replace(/,/g, ', '));

      handleSendGrid(gameEvent.grid);

      setFreeSpins(gameEvent.freeSpinsLeft);
    }

    if (currentAction == 'autoPlay' && gameEvent?.type == 'Game') {
      log('AUTOPLAY SUCCESS gameEvent', gameEvent);

      if (
        !window.GetMessageFromUnity ||
        typeof window.GetMessageFromUnity === 'undefined' ||
        typeof window.GetMessageFromUnity !== 'function'
      ) {
        window.GetMessageFromUnity = handleMessageFromUnity;
      }

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      handleSendGrid(gameEvent.grid);

      setFreeSpins(gameEvent.freeSpinsLeft);
    }

    if (currentAction == 'initialAutoplay' && gameEvent?.type == 'Game') {
      if (
        !window.GetMessageFromUnity ||
        typeof window.GetMessageFromUnity === 'undefined' ||
        typeof window.GetMessageFromUnity !== 'function'
      ) {
        window.GetMessageFromUnity = handleMessageFromUnity;
      }

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

      log('INITIAL AUTOPLAY RESULT');

      handleSendGrid(gameEvent.grid);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      setFreeSpins(gameEvent.freeSpinsLeft);
    }

    // if (gameEvent?.grid) {
    //   const multipliers = [];
    //   gameEvent?.grid.forEach((arr) => {
    //     arr.forEach((n) => n >= 1000 && multipliers.push(n));
    //   });

    //   if (multipliers.length)
    //     sendMessage(
    //       'WebGLHandler',
    //       'ReceiveMessage',
    //       WinrOfOlympus_Unity_Methods.ZEUS_ANIMATION_PLAY
    //     );
    // }
  }, [gameEvent]);

  React.useEffect(() => {
    // Check if GetMessageFromUnity is not already defined to avoid overwriting
    if (typeof window !== 'undefined' && typeof window.GetMessageFromUnity === 'undefined') {
      // Assign the listener to the window object
      window.GetMessageFromUnity = handleMessageFromUnity;
    }

    // Cleanup function to remove the listener
    return () => {
      if (typeof window !== 'undefined' && window.GetMessageFromUnity === handleMessageFromUnity) {
        delete window.GetMessageFromUnity;
      }
    };
  }, [handleMessageFromUnity, isInFreeSpinMode, currentPayoutAmount, freeSpins, wonFreeSpins]);

  React.useEffect(() => {
    if (!sendMessage) return;
    if (isInFreeSpinMode) return;
    if (!isLoggedIn) return;
    if (!freeSpins) return;
    if (wonFreeSpins) return;
    if (!previousFreeSpinCount) return;

    setIsDoubleChance(false);
    handleEnterFreespinWithoutScatter();
    handleFreespinAmount(freeSpins);
    setIsInFreeSpinMode(true);
    setIsInAutoPlay(false);
  }, [
    freeSpins,
    isLoggedIn,
    isInFreeSpinMode,
    currentTumbleAmount,
    currentPayoutAmount,
    sendMessage,
    wonFreeSpins,
    previousFreeSpinCount,
  ]);

  // IMPORTANT
  React.useEffect(() => {
    if (previousFreeSpinCount > 0) {
      setFreeSpins(previousFreeSpinCount || 0);

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SetFreeSpinCount|${freeSpins}`);
    }
  }, [previousFreeSpinCount]);

  React.useEffect(() => {
    if (previousFreeSpinWinnings > 0 && isLoaded) {
      setCurrentPayoutAmount(previousFreeSpinWinnings);
      handleUpdateWinText(previousFreeSpinWinnings.toString());
    }
  }, [previousFreeSpinWinnings, isLoaded]);

  React.useEffect(() => {
    if (previousMultiplier > 0 && isLoaded) {
      handleUpdateMultiplier(previousMultiplier.toString());
    }
  }, [previousMultiplier, isLoaded]);

  React.useEffect(() => {
    if (!sendMessage) return;

    handleSetBalance(toFormatted(currentBalanceInDollar, 2));
  }, [handleSetBalance, currentBalanceInDollar, sendMessage]);

  React.useEffect(() => {
    return () => {
      detachAndUnloadImmediate();
    };
  }, [detachAndUnloadImmediate]);

  const formFields = React.useMemo(
    () => ({ betAmount, actualBetAmount, isDoubleChance }),
    [betAmount, actualBetAmount, isDoubleChance]
  );

  React.useEffect(() => {
    onFormChange(formFields);
  }, [formFields]);

  React.useEffect(() => {
    onAutoBetModeChange?.(isInAutoPlay);
  }, [isInAutoPlay]);

  return (
    <UnityGameContainer
      className={cn(
        'wr-flex wr-overflow-hidden wr-rounded-xl wr-border wr-border-zinc-800 max-lg:wr-flex-col-reverse lg:wr-h-[672px]',
        {
          'wr-fixed wr-z-[60] wr-w-[100dvw] lg:wr-h-[100dvh] wr-bg-black wr-top-0 wr-left-0':
            isFullscreen,
        }
      )}
    >
      <div
        className={cn('wr-w-full max-lg:wr-border-b max-lg:wr-border-zinc-800', {
          'wr-flex wr-justify-center wr-items-center': isFullscreen,
        })}
      >
        {percentageRef.current !== 100 && (
          <div className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-flex wr-h-full wr-w-full wr-flex-col wr-items-center wr-justify-center wr-gap-4">
            <img
              src={`${buildedGameUrl + '/loader.jpg'}`}
              className="wr-absolute wr-left-0 wr-top-0 wr-z-[5] wr-h-full wr-w-full wr-rounded-md wr-object-cover"
            />
            <span
              style={{
                textShadow: '0 0 5px black, 0 0 5px black',
              }}
              className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
            >
              {toFormatted(percentageRef.current, 2)} %
            </span>
            <Progress.Root
              className="wr-radius-[1000px] wr-relative wr-z-50 wr-h-[25px] wr-w-[320px] wr-overflow-hidden wr-rounded-md wr-bg-black"
              style={{
                transform: 'translateZ(0)',
              }}
              value={percentageRef.current}
            >
              <Progress.Indicator
                className="wr-h-full wr-w-full wr-bg-gradient-to-l wr-from-pink-400 wr-to-pink-700"
                style={{
                  transform: `translateX(-${100 - percentageRef.current}%)`,
                  transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
                }}
              />
            </Progress.Root>
            <span
              style={{
                textShadow: '0 0 5px black, 0 0 5px black',
              }}
              className="wr-z-50 wr-text-2xl wr-font-bold wr-text-white"
            >
              Princess WINR
            </span>
          </div>
        )}
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={2}
          className={cn(
            'wr-h-full wr-w-full wr-rounded-t-md wr-bg-zinc-900 max-md:wr-h-[575px] lg:wr-rounded-md',
            {
              'wr-w-auto wr-h-auto wr-max-w-full wr-max-h-full wr-aspect-[1140/670]': isFullscreen,
            }
          )}
        />

        <UnityFullscreenButton
          isFullscreen={isFullscreen}
          onChange={setIsFullscreen}
          className="wr-absolute wr-right-2 wr-top-2"
        />
      </div>
    </UnityGameContainer>
  );
};
