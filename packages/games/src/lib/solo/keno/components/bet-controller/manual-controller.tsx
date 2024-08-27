import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { TotalWager, WagerCurrencyIcon } from '../../../../common/wager';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { IconMagicStick, IconTrash } from '../../../../svgs';
import { Button } from '../../../../ui/button';
import { FormLabel } from '../../../../ui/form';
import { cn } from '../../../../utils/style';
import { toFormatted } from '../../../../utils/web3';
import { kenoMultipliers } from '../../constants';
import useKenoGameStore from '../../store';
import { KenoForm } from '../../types';

type Props = {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ManualController: React.FC<Props> = ({ minWager, maxWager }) => {
  const form = useFormContext() as KenoForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const wager = form.watch('wager');
  const selections = form.watch('selections');

  const { updateKenoGameResults } = useKenoGameStore([
    'gameStatus',
    'updateKenoGameResults',
    'kenoGameResults',
  ]);

  const currentMultipliers = kenoMultipliers[selections.length] || [];
  const maxMultiplier = Math.max(...currentMultipliers);
  const maxPayout = wager * maxMultiplier;

  const clearBetHandler = () => {
    digitalClickEffect.play();
    form.setValue('selections', []);
    updateKenoGameResults([]);
  };

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const autoPickHandler = () => {
    digitalClickEffect.play();
    clearBetHandler();

    var randomNumbers: number[] = [];

    for (var i = 0; i < 10; i++) {
      var randomNumber;

      do {
        randomNumber = getRandomNumber(1, 40);
      } while (randomNumbers.includes(randomNumber));

      randomNumbers.push(randomNumber);
    }

    form.setValue('selections', randomNumbers);
  };

  const isFormInProgress = form.formState.isSubmitting || form.formState.isLoading;

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} isDisabled={isFormInProgress} />
      <div className="wr-mb-6 wr-grid-cols-2 wr-gap-2 lg:!wr-grid wr-hidden">
        <div>
          <FormLabel>Max Payout</FormLabel>
          <div
            className={cn(
              'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]'
            )}
          >
            <WagerCurrencyIcon />
            <span className={cn('wr-font-semibold wr-text-zinc-100')}>
              ${toFormatted(maxPayout, 2)}
            </span>
          </div>
        </div>
        <div>
          <FormLabel>Total Wager</FormLabel>
          <TotalWager betCount={1} wager={form.getValues().wager} />
        </div>
      </div>
      <div className="wr-mb-3 lg:wr-mb-6 wr-grid wr-grid-cols-2 wr-gap-2">
        <Button
          size={'xl'}
          variant={'secondary'}
          type="button"
          disabled={isFormInProgress}
          onClick={autoPickHandler}
        >
          <IconMagicStick className="wr-mr-1 wr-h-5 wr-w-5" />
          Auto Pick
        </Button>
        <Button
          size={'xl'}
          variant={'secondary'}
          type="button"
          onClick={clearBetHandler}
          disabled={isFormInProgress}
        >
          <IconTrash className="wr-mr-1 wr-h-5 wr-w-5" />
          Clear
        </Button>
      </div>
      <PreBetButton>
        <Button
          type="submit"
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none max-lg:wr-mb-1',
            {
              'wr-cursor-default wr-pointer-events-none':
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                maxPayout == 0,
            }
          )}
          size={'xl'}
          onClick={() => clickEffect.play()}
        >
          Bet
        </Button>
      </PreBetButton>
    </>
  );
};
