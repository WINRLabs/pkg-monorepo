import { BetControllerContainer } from '../../../../common/containers';
import { WagerFormField } from '../../../../common/controller';
import { useGame } from '../../../../game-provider';
import { useAudioEffect } from '../../../../hooks/use-audio-effect';
import { SoundEffects } from '../../../../hooks/use-audio-effect';
import { Button } from '../../../../ui/button';
import { cn } from '../../../../utils/style';
import { MultiplayerGameStatus } from '../../../core/type';
import { useCrashGameStore } from '../../crash.store';
import Participants from './participants';

interface CrashBetControllerProps {
  minWager: number;
  maxWager: number;

  onLogin?: () => void;
  isPinNotFound?: boolean;
}
export default function CrashBetController({ minWager, maxWager }: CrashBetControllerProps) {
  const { updateState } = useCrashGameStore((state) => ({
    updateState: state.updateState,
  }));
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);

  const { readyToPlay } = useGame();

  return (
    <BetControllerContainer>
      <WagerFormField minWager={minWager} maxWager={maxWager} />
      <div>
        {/* <PreBetButton onLogin={() => null} isPinNotFound={false}> */}
        <Button
          type="submit"
          variant={'success'}
          className={cn(
            'wr-w-full wr-uppercase wr-transition-all wr-duration-300 active:wr-scale-[85%] wr-select-none'
          )}
          // disabled={!readyToPlay}
          size={'xl'}
          onClick={() => {
            updateState({ status: MultiplayerGameStatus.Start, finalMultiplier: 10 });
            clickEffect.play();
          }}
        >
          Start Game
        </Button>
        {/* </PreBetButton> */}
        <Participants />
      </div>
    </BetControllerContainer>
  );
}
