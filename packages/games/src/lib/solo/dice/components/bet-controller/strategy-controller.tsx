import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AutoBetCountFormField,
  StrategyConditions,
  StrategySelector,
  WagerFormField,
} from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { useGame } from '../../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { DiceForm } from '../../types';
import { BetLoader } from './bet-loader';

interface StrategyControllerProps {
  winMultiplier: number;
  isGettingResults?: boolean;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

const mockStrategies = ['Martingale', 'Delayed Martingale'];

export const StrategyController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  onAutoBetModeChange,
  onLogin,
}: StrategyControllerProps) => {
  const { readyToPlay } = useGame();
  const form = useFormContext() as DiceForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const [selectedStrategy, setSelectedStrategy] = React.useState<string>('Martingale');

  return (
    <div className="wr-flex wr-flex-col">
      <WagerFormField
        minWager={minWager}
        maxWager={maxWager}
        className="wr-order-0 lg:!wr-mb-3"
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />
      <div className="wr-order-2 lg:wr-order-none wr-flex wr-gap-2 lg:wr-flex-col lg:wr-gap-0">
        <AutoBetCountFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
        <StrategySelector
          selectedStrategy={selectedStrategy}
          onChange={setSelectedStrategy}
          strategies={mockStrategies}
        />
        <StrategyConditions conditions={['1', '2', '3']} />
      </div>

      <PreBetButton onLogin={onLogin} className="wr-mb-3 lg:wr-mb-0">
        <Button
          type={!isAutoBetMode ? 'button' : 'submit'}
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none wr-mb-3 lg:wr-mb-0 wr-order-1 lg:wr-order-none',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid || form.formState.isSubmitting || form.formState.isLoading,
            }
          )}
          size={'xl'}
          onClick={() => {
            clickEffect.play();
            onAutoBetModeChange(!isAutoBetMode);
          }}
          disabled={!readyToPlay}
        >
          {isAutoBetMode ? (
            <div className="wr-flex wr-gap-1.5 wr-items-center">
              Stop Autobet <BetLoader />
            </div>
          ) : (
            'Start Autobet'
          )}
        </Button>
      </PreBetButton>
    </div>
  );
};
