import { CDN_URL } from '../../../constants';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { Button } from '../../../ui/button';
import { cn } from '../../../utils/style';

interface ControlProps {
  totalWager: number;
  isDisabled: boolean;
  undoBet: () => void;
  reset: () => void;
  className?: string;
  variant?: 'overlay' | 'inline';
}

export default function Control({
  totalWager,
  isDisabled,
  undoBet,
  reset,
  className,
  variant = 'inline',
}: ControlProps) {
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  return (
    <div
      className={cn('wr-w-full wr-items-center wr-gap-2 wr-mb-6', className, {
        'lg:wr-flex wr-hidden': variant === 'inline',
        'wr-absolute wr-left-0 wr-bottom-0 wr-w-full wr-flex wr-mb-0 lg:wr-hidden':
          variant === 'overlay',
      })}
    >
      <Button
        type="button"
        disabled={totalWager === 0 || isDisabled}
        variant={variant === 'overlay' ? 'ghost' : 'secondary'}
        size="xl"
        className={cn('wr-flex wr-w-full wr-items-center wr-gap-1 button', {
          'wr-justify-start': variant === 'overlay',
        })}
        onClick={() => {
          digitalClickEffect.play();
          undoBet();
        }}
      >
        <img
          src={`${CDN_URL}/icons/icon-undo.svg`}
          width={20}
          height={20}
          alt="Justbet Decentralized Casino"
        />
        <span>Undo</span>
      </Button>

      <Button
        type="button"
        variant={variant === 'overlay' ? 'ghost' : 'secondary'}
        size="xl"
        className={cn('wr-flex wr-w-full wr-items-center wr-gap-1 button', {
          'wr-justify-end': variant === 'overlay',
        })}
        disabled={totalWager === 0 || isDisabled}
        onClick={() => {
          digitalClickEffect.play();
          reset();
        }}
      >
        <img
          src={`${CDN_URL}/icons/icon-trash.svg`}
          width={20}
          height={20}
          alt="Justbet Decentralized Casino"
        />
        <span>Clear</span>
      </Button>
    </div>
  );
}
