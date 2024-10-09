import React from 'react';
import { useFormContext } from 'react-hook-form';

import { WagerFormField } from '../../../../common/controller';
import { PreBetButton } from '../../../../common/pre-bet-button';
import { SoundEffects, useAudioEffect } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import useTowerGameStore from '../../store';
import { TowerForm } from '../../types';
import { BetLoader } from './bet-loader';

type Props = {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
};

export const ManualController: React.FC<Props> = ({ minWager, maxWager, onLogin }) => {
  const form = useFormContext() as TowerForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const { updateTowerGameResults } = useTowerGameStore([
    'gameStatus',
    'updateTowerGameResults',
    'towerGameResults',
  ]);

  const clearBetHandler = () => {
    digitalClickEffect.play();
    form.setValue('selections', []);
    updateTowerGameResults([]);
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
    </>
  );
};
