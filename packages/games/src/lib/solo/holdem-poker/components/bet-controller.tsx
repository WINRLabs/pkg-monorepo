import React from 'react';

import { WagerBalance, WagerCurrency, WagerInput } from '../../../common/wager';
import { useGameOptions } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { Button } from '../../../ui/button';
import { cn } from '../../../utils/style';
import { HOLDEM_POKER_GAME_STATUS } from '../types';

export const WagerBetController: React.FC<{
  status: HOLDEM_POKER_GAME_STATUS;
  wager: number;
  setWager: React.Dispatch<React.SetStateAction<number>>;
  minWager: number;
  maxWager: number;
  className?: string;
}> = ({ status, wager, setWager, minWager, maxWager, className }) => {
  return (
    <fieldset className={cn(className)}>
      <label className="wr-text-unity-white-50 wr-flex wr-justify-between wr-mb-1">
        Wager
        <div>
          <WagerBalance
            maxWager={maxWager}
            onClick={(maxAmount) => setWager(maxAmount)}
            className="wr-text-zinc-100"
          />
          <WagerCurrency />
        </div>
      </label>
      <WagerInput
        value={wager}
        form={{} as any}
        onChange={setWager}
        isDisabled={status == HOLDEM_POKER_GAME_STATUS.OnPlay}
        hasError={wager < minWager || wager > maxWager}
        minWager={minWager}
        maxWager={maxWager}
        containerClassName={cn(
          'wr-border wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md'
        )}
      />
      <WagerSetterButtons
        wager={wager}
        setWager={setWager}
        minWager={minWager}
        maxWager={maxWager}
        isDisabled={status == HOLDEM_POKER_GAME_STATUS.OnPlay}
      />
    </fieldset>
  );
};

const WagerSetterButtons: React.FC<{
  wager: number;
  setWager: React.Dispatch<React.SetStateAction<number>>;
  minWager: number;
  maxWager: number;
  isDisabled: boolean;
}> = ({ wager, setWager, minWager, maxWager, isDisabled }) => {
  const clickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  return (
    <div className="wr-flex wr-items-center wr-gap-1 wr-mt-1.5">
      <Button
        className="wr-w-full wr-font-[500] wr-bg-unity-white-15 wr-backdrop-blur-md"
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          setWager(minWager);
        }}
      >
        MIN
      </Button>
      <Button
        className="wr-w-full wr-font-[500] wr-bg-unity-white-15 wr-backdrop-blur-md"
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          const newValue = wager / 2;

          if (newValue < minWager) setWager(minWager);
          else setWager(newValue);
        }}
      >
        1/2
      </Button>
      <Button
        className="wr-w-full wr-font-[500] wr-bg-unity-white-15 wr-backdrop-blur-md"
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          clickEffect.play();
          const newValue = wager * 2;
          const maxAmount = maxWager > balanceAsDollar ? balanceAsDollar : maxWager;

          if (newValue > maxAmount) setWager(maxAmount);
          else setWager(newValue);
        }}
      >
        2x
      </Button>
      <Button
        className="wr-w-full wr-font-[500] wr-bg-unity-white-15 wr-backdrop-blur-md"
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          clickEffect.play();
          const maxAmount = maxWager > balanceAsDollar ? balanceAsDollar : maxWager;
          setWager(maxAmount);
        }}
      >
        MAX
      </Button>
    </div>
  );
};
