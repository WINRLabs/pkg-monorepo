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

  const isFormInProgress = form.formState.isSubmitting || form.formState.isLoading;

  return (
    <>
      <WagerFormField minWager={minWager} maxWager={maxWager} isDisabled={isFormInProgress} />
    </>
  );
};
