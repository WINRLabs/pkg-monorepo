import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AutoBetCountFormField,
  AutoBetIncreaseOnLoss,
  AutoBetIncreaseOnWin,
  AutoBetStopGainFormField,
  AutoBetStopLossFormField,
  WagerFormField,
} from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { PlinkoForm } from '../../types';
import { PlinkoRowFormField } from './manual-controller';
import { BetLoader } from './bet-loader';

interface AutoControllerProps {
  isGettingResults?: boolean;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
  hideWager?: boolean;
  disableStrategy?: boolean;
}

export const AutoController = ({
  minWager,
  maxWager,
  isAutoBetMode,
  onAutoBetModeChange,
  onLogin,
  hideWager,
  disableStrategy,
}: AutoControllerProps) => {
  const form = useFormContext() as PlinkoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  useEffect(() => {
    form.setValue('betCount', 0);
  }, []);

  return (
    <div className="wr-flex wr-flex-col">
      {!hideWager && (
        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          className="wr-order-0 lg:!wr-mb-3"
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
      )}

      <PlinkoRowFormField
        minValue={6}
        maxValue={12}
        className="wr-mb-3 lg:wr-mb-3"
        isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
      />

      <div className="wr-order-2 lg:wr-order-none wr-flex wr-gap-2 lg:wr-flex-col lg:wr-gap-0">
        <AutoBetCountFormField
          isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
        />
        {!disableStrategy && (
          <div className="wr-flex wr-gap-2 md:wr-gap-3">
            <AutoBetIncreaseOnWin
              isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
              showSm
            />
            <AutoBetIncreaseOnLoss
              isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
              showSm
            />
          </div>
        )}
      </div>

      {!disableStrategy && (
        <div className="wr-order-3 lg:wr-order-none wr-flex wr-gap-2">
          <AutoBetStopGainFormField
            isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          />
          <AutoBetStopLossFormField
            isDisabled={form.formState.isSubmitting || form.formState.isLoading || isAutoBetMode}
          />
        </div>
      )}

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
        >
          {isAutoBetMode ? (
            <div className="wr-flex wr-gap-1.5 wr-items-center">
              Stop Autobet
              <BetLoader />
            </div>
          ) : (
            'Start Autobet'
          )}
        </Button>
      </PreBetButton>
    </div>
  );
};
