'use client';

import {
  COIN_SIDE,
  CoinFlip3dFormFields,
  CoinFlip3dGameResult,
  CoinFlip3DTemplate,
  GameType,
} from '@winrlabs/games';
import {
  controllerAbi,
  generateCommitmentHash,
  useCurrentAccount,
  usePriceFeed,
  useSendTx,
  useTokenAllowance,
  useTokenStore,
} from '@winrlabs/web3';
import debug from 'debug';
import React, { useMemo, useState } from 'react';
import { Address, encodeAbiParameters, encodeFunctionData } from 'viem';

import { BaseGameProps } from '../../type';
import { usePlayerGameStatus } from '../hooks';
import { useContractConfigContext } from '../hooks/use-contract-config';
import { useListenGameEvent } from '../hooks/use-listen-game-event';
import {
  DecodedEvent,
  GAME_HUB_EVENT_TYPES,
  prepareGameTransaction,
  SingleStepSettledEvent,
} from '../utils';

const log = debug('worker:CoinFlip3DWeb3');

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
    loader?: string;
    logo?: string;
  };
};

interface TemplateWithWeb3Props extends BaseGameProps {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;
  devicePixelRatio?: number;
  buildedGameUrl: string;

  onAnimationStep?: (step: number) => void;
  onAnimationCompleted?: (result: CoinFlip3dGameResult[]) => void;
}

export default function CoinFlip3DGame(props: TemplateWithWeb3Props) {
  const { gameAddresses, controllerAddress, cashierAddress, uiOperatorAddress, wagmiConfig } =
    useContractConfigContext();

  const { isPlayerHalted, isReIterable, playerLevelUp, playerReIterate, refetchPlayerGameStatus } =
    usePlayerGameStatus({
      gameAddress: gameAddresses.coinFlip,
      gameType: GameType.COINFLIP,
      wagmiConfig,
    });

  const [formValues, setFormValues] = useState<CoinFlip3dFormFields>({
    betCount: 1,
    coinSide: COIN_SIDE.ETH,
    stopGain: 0,
    stopLoss: 0,
    wager: props.minWager || 1,
  });

  const gameEvent = useListenGameEvent(gameAddresses.coinFlip);

  const { selectedToken } = useTokenStore((s) => ({
    selectedToken: s.selectedToken,
  }));
  const { getTokenPrice } = usePriceFeed();

  const [coinFlipResult, setCoinFlipResult] = useState<DecodedEvent<any, SingleStepSettledEvent>>();
  const currentAccount = useCurrentAccount();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || '0x0000000',
    spender: cashierAddress,
    tokenAddress: selectedToken.address,
    showDefaultToasts: false,
  });

  const coinFlipSteps = useMemo(() => {
    if (!coinFlipResult) return [];

    return coinFlipResult?.program?.[0]?.data.converted.steps.map((s) => ({
      coinSide: s.outcome.toString() as COIN_SIDE,
      payout: s.payout,
      payoutInUsd: s.payout,
    }));
  }, [coinFlipResult]);

  const getEncodedTxData = () => {
    const { wagerInWei, stopGainInWei, stopLossInWei } = prepareGameTransaction({
      wager: formValues.wager,
      stopGain: formValues.stopGain,
      stopLoss: formValues.stopLoss,
      selectedCurrency: selectedToken,
      lastPrice: getTokenPrice(selectedToken.priceKey),
    });

    const encodedChoice = encodeAbiParameters(
      [
        {
          name: 'data',
          type: 'uint8',
        },
      ],
      [Number(formValues.coinSide)]
    );

    const encodedGameData = encodeAbiParameters(
      [
        { name: 'wager', type: 'uint128' },
        { name: 'stopGain', type: 'uint128' },
        { name: 'stopLoss', type: 'uint128' },
        { name: 'count', type: 'uint8' },
        { name: 'data', type: 'bytes' },
      ],
      [
        wagerInWei,
        stopGainInWei as bigint,
        stopLossInWei as bigint,
        formValues.betCount,
        encodedChoice,
      ]
    );

    return encodeFunctionData({
      abi: controllerAbi,
      functionName: 'perform',
      args: [
        gameAddresses.coinFlip as Address,
        generateCommitmentHash(),
        selectedToken.bankrollIndex,
        uiOperatorAddress as Address,
        'bet',
        encodedGameData,
      ],
    });
  };

  const sendTx = useSendTx();
  const isPlayerHaltedRef = React.useRef<boolean>(false);
  const isReIterableRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isPlayerHaltedRef.current = isPlayerHalted;
    isReIterableRef.current = isReIterable;
  }, [isPlayerHalted, isReIterable]);

  const onGameSubmit = async () => {
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          log('error', e);
        },
      });

      if (!handledAllowance) return;
    }

    try {
      if (isPlayerHaltedRef.current) await playerLevelUp();
      if (isReIterable) await playerReIterate();

      await sendTx.mutateAsync({
        encodedTxData: getEncodedTxData(),
        method: 'sendGameOperation',
        target: controllerAddress,
      });
    } catch (e: any) {
      log('error', e);
      refetchPlayerGameStatus();
      // props.onError && props.onError(e);
    }
  };

  React.useEffect(() => {
    const finalResult = gameEvent;

    if (finalResult?.program[0]?.type === GAME_HUB_EVENT_TYPES.Settled)
      setCoinFlipResult(finalResult);
  }, [gameEvent]);

  return (
    <CoinFlip3DTemplate
      {...props}
      onSubmitGameForm={onGameSubmit}
      gameResults={coinFlipSteps || []}
      onFormChange={(val) => {
        setFormValues(val);
      }}
    />
  );
}
