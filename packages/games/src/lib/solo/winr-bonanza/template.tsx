'use client';

import React from 'react';
import { Unity } from 'react-unity-webgl';
import { useDebounce } from 'use-debounce';

import { UnityGameContainer } from '../../common/containers';
import { useGameOptions } from '../../game-provider';
import { wait } from '../../utils/promise';
import { toDecimals, toFormatted } from '../../utils/web3';
import { useUnityBonanza } from './hooks/use-bonanza-unity';
import { useBonanzaGameStore } from './store';
import { Bonanza_Unity_Events, ReelSpinSettled, SpinType, WinrBonanzaFormFields } from './types';

interface TemplateProps {
  onRefresh: () => void;
  bet: () => Promise<void>;
  buyFreeSpins: () => Promise<void>;
  freeSpin: () => Promise<void>;
  onError?: (e: any) => void;
  onFormChange: (fields: WinrBonanzaFormFields) => void;

  previousFreeSpinCount: number;
  gameEvent: ReelSpinSettled;
  buildedGameUrl: string;
  buildedGameUrlMobile: string;
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

export const WinrBonanzaTemplate = ({
  onRefresh,
  bet,
  buyFreeSpins,
  freeSpin,
  onError,
  onFormChange,

  gameEvent,
  previousFreeSpinCount,
  buildedGameUrl,
  buildedGameUrlMobile,
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
    handleSpinStatus,
  } = useUnityBonanza({ buildedGameUrl, buildedGameUrlMobile });

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
  } = useBonanzaGameStore();

  const { account } = useGameOptions();

  const [freeSpinWinAmount, setFreeSpinWinAmount] = React.useState(0);
  const [isInAutoPlay, setIsInAutoPlay] = React.useState(false);
  const [initialBuyEvent, setInitialBuyEvent] = React.useState<any>(undefined);
  const [wonFreeSpins, setWonFreeSpins] = React.useState(false);

  const [currentAction, setCurrentAction] = React.useState<
    'submit' | 'initialAutoplay' | 'buyFeature' | 'freeSpin' | 'autoPlay'
  >();

  const currentBalanceInDollar = React.useMemo(
    () => account?.balanceAsDollar || 0,
    [account?.balanceAsDollar]
  );

  const actualBetAmount = isDoubleChance ? betAmount + betAmount * 0.5 : betAmount;

  // Wrap the listener in a useCallback
  const handleMessageFromUnity = React.useCallback(
    (name: string, strParam: string) => {
      const obj: UnityEventData = {
        name,
        strParam,
      };

      setTimeout(() => {
        if (obj.name === Bonanza_Unity_Events.BET) {
          if (!isInFreeSpinMode || !isInAutoPlay) {
            handleSubmit();
          } else {
            return;
          }
        }

        if (obj.name === 'M3_OnActiveAutoSpinMode') {
          console.log('ACTIVATE AUTOPLAY');

          handleInitialAutoPlay();

          setIsInAutoPlay(true);
        }

        if (obj.name === 'M3_ScatterMatch') {
          console.log('SCATTER MATCH');

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
          console.log('DEACTIVATE AUTOPLAY');

          setIsInAutoPlay(false);
        }

        if (obj.name === 'M3_WelcomeSpinClick') {
          handleLogin();

          setIsLoggedIn(true);
        }

        if (obj.name === Bonanza_Unity_Events.CHANGE_BET) {
          setBetAmount(Number(obj.strParam));
        }

        if (obj.name === Bonanza_Unity_Events.DOUBLE_CHANCE_CLICK) {
          console.log('DOUBLE CHANCE CLICK', obj.strParam);

          console.log('DOUBLE CHANCE CLICK VAL', obj.strParam === 'true');

          setIsDoubleChance(obj.strParam === 'true');
        }
        /* 
        if (obj.name === "M3_EnterFreeSpinAnimEnd") {
          handleFreespin();
        } */

        if (obj.name === Bonanza_Unity_Events.GRID_ANIMATION_FINISHED) {
          console.log('GRID ANIMATION FINISHED');

          if (isInFreeSpinMode) {
            sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SetFreeSpinCount|${freeSpins}`);

            if (freeSpins === 0) {
              setTimeout(() => {
                handleExitFreespin();

                setIsInFreeSpinMode(false);

                sendMessage(
                  'WebGLHandler',
                  'ReceiveMessage',
                  `M3_OpenCongForEndFreeSpin|${toDecimals(freeSpinWinAmount, 2)}`
                );

                handleUnlockUi();
              }, 2000);
            } else {
              handleFreespin();
            }
          } else if (isInAutoPlay && !wonFreeSpins) {
            console.log('GRID ANIMATION FINISHED AND CALLED AUTOPLAY');

            handleAutoPlay();
          } else if (!wonFreeSpins) {
            handleUnlockUi();
          }

          if (currentPayoutAmount > 0) {
            if (!isInFreeSpinMode) {
              handleUpdateWinText(currentPayoutAmount.toString());
            } else {
              handleUpdateWinText(freeSpinWinAmount.toString());
            }
          }

          onRefresh();
        }

        if (obj.name === Bonanza_Unity_Events.BUY_FEATURE_CLICK) {
          handleBuy();

          setIsInFreeSpinMode(true);

          // handleEnterFreespin();
        }

        if (obj.name === Bonanza_Unity_Events.CLOSED_CONGRATULATIONS_PANEL) {
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

            if (event.payoutMultiplier > 0) {
              const payout = toDecimals(event.payoutMultiplier * event.betAmount, 2);

              setCurrentPayoutAmount(payout);

              setFreeSpinWinAmount(payout);
            }
          }

          if (isInFreeSpinMode && !initialBuyEvent) {
            handleFreespin();
          }

          // handleBuy();
          // handleEnterFreespin();
          // freeSpinTx();
        }
      }, 10);
    },
    [
      sendMessage,
      betAmount,
      currentPayoutAmount,
      isInFreeSpinMode,
      freeSpinWinAmount,
      freeSpins,
      initialBuyEvent,
      isInAutoPlay,
      setIsDoubleChance,
      isDoubleChance,
      wonFreeSpins,
      previousFreeSpinCount,
      currentAction,
    ]
  );

  const handleFreespin = async () => {
    console.log('FREESPIN');
    await wait(300);
    setCurrentPayoutAmount(0);
    setWonFreeSpins(false);
    setInitialBuyEvent(undefined);
    setCurrentAction('freeSpin');

    try {
      await freeSpin();
    } catch (e: any) {}
  };

  const handleBuy = async () => {
    setCurrentPayoutAmount(0);
    handleUpdateWinText('0');
    setFreeSpinWinAmount(0);
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
    handleUpdateWinText('0');
    setFreeSpinWinAmount(0);
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
    handleUpdateWinText('0');
    setFreeSpinWinAmount(0);
    setWonFreeSpins(false);
    setCurrentAction('autoPlay');

    try {
      await bet();
    } catch (e: any) {
      handleUnlockUi();
    }
  };

  const handleInitialAutoPlay = async () => {
    console.log('INITIAL AUTOPLAY');

    setInitialBuyEvent(undefined);

    if (isInFreeSpinMode) return;

    setCurrentPayoutAmount(0);
    handleUpdateWinText('0');
    setFreeSpinWinAmount(0);
    setWonFreeSpins(false);

    setCurrentAction('initialAutoplay');

    try {
      await bet();
    } catch (e: any) {
      handleUnlockUi();
    }
  };

  React.useEffect(() => {
    if (currentAction == 'submit' && gameEvent?.type == 'Game') {
      handleSendGrid(gameEvent.grid);

      onFormChange({ betAmount, actualBetAmount, isDoubleChance });
      console.log('SUBMIT gameEvent', gameEvent);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      setFreeSpins(gameEvent.freeSpinsLeft);

      if (gameEvent.payoutMultiplier > 0) {
        let _wager = gameEvent.betAmount;

        console.log('betamount', gameEvent.betAmount);

        if (gameEvent.spinType === SpinType.DOUBLE_CHANCE) {
          _wager = (gameEvent.betAmount * 2) / 3;
        } else {
          _wager = gameEvent.betAmount;
        }

        console.log('WAGER', _wager);

        const payout = toDecimals(gameEvent.payoutMultiplier * _wager, 2);

        setCurrentPayoutAmount(payout);
      }

      onRefresh();
    }

    if (currentAction == 'buyFeature' && gameEvent?.type == 'Game') {
      if (
        !window.GetMessageFromUnity ||
        typeof window.GetMessageFromUnity === 'undefined' ||
        typeof window.GetMessageFromUnity !== 'function'
      ) {
        window.GetMessageFromUnity = handleMessageFromUnity;
      }

      console.log('buy feature event', gameEvent.grid);
      console.log('grid', JSON.stringify(gameEvent.grid).replace(/,/g, ', '));

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

      handleSendGrid(gameEvent.grid);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      setFreeSpins(gameEvent.freeSpinsLeft);
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

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SetBetValue|${_betAmount}`);

      sendMessage('WebGLHandler', 'ReceiveMessage', `M3_SpinClickAction`);

      console.log('free spin event', gameEvent);

      console.log('grid', JSON.stringify(gameEvent.grid).replace(/,/g, ', '));

      handleSendGrid(gameEvent.grid);

      setFreeSpins(gameEvent.freeSpinsLeft);

      if (gameEvent.payoutMultiplier > 0) {
        const payout = toDecimals(gameEvent.payoutMultiplier * gameEvent.betAmount, 2);

        setCurrentPayoutAmount(payout);

        setFreeSpinWinAmount(freeSpinWinAmount + payout);
      }
    }

    if (currentAction == 'autoPlay' && gameEvent?.type == 'Game') {
      console.log('AUTOPLAY SUCCESS');

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

      if (gameEvent.payoutMultiplier > 0) {
        let _wager = gameEvent.betAmount;

        console.log('betamount', gameEvent.betAmount);

        if (gameEvent.spinType === SpinType.DOUBLE_CHANCE) {
          _wager = (gameEvent.betAmount * 2) / 3;
        } else {
          _wager = gameEvent.betAmount;
        }

        console.log('WAGER', _wager);

        const payout = toDecimals(gameEvent.payoutMultiplier * _wager, 2);

        setCurrentPayoutAmount(payout);
      }

      onRefresh();
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

      console.log('INITIAL AUTOPLAY RESULT');

      handleSendGrid(gameEvent.grid);

      if (gameEvent.freeSpinsLeft > 0) {
        setWonFreeSpins(true);
      }

      setFreeSpins(gameEvent.freeSpinsLeft);

      if (gameEvent.payoutMultiplier > 0) {
        let _wager = gameEvent.betAmount;

        console.log('betamount', gameEvent.betAmount);

        if (gameEvent.spinType === SpinType.DOUBLE_CHANCE) {
          _wager = (gameEvent.betAmount * 2) / 3;
        } else {
          _wager = gameEvent.betAmount;
        }

        console.log('WAGER', _wager);

        const payout = toDecimals(gameEvent.payoutMultiplier * _wager, 2);

        setCurrentPayoutAmount(payout);
      }

      onRefresh();
    }
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
  }, [
    handleMessageFromUnity,
    isInFreeSpinMode,
    currentPayoutAmount,
    freeSpinWinAmount,
    freeSpins,
    wonFreeSpins,
  ]);

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

  const debouncedFormFields = useDebounce(formFields, 0);

  React.useEffect(() => {
    onFormChange(debouncedFormFields[0]);
  }, [debouncedFormFields[0]]);

  return (
    <UnityGameContainer className="wr-flex wr-overflow-hidden wr-rounded-xl wr-border wr-border-zinc-800 max-lg:wr-flex-col-reverse lg:wr-h-[672px]">
      <div className="wr-w-full max-lg:wr-border-b  max-lg:wr-border-zinc-800">
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={2}
          className="wr-h-full wr-w-full wr-rounded-t-md wr-bg-zinc-900 max-md:wr-h-[575px] lg:wr-rounded-md"
        />
      </div>
    </UnityGameContainer>
  );
};
