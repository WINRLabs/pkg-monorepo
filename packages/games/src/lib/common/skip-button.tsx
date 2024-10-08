import { CDN_URL } from '../constants';
import { useGameSkip } from '../game-provider';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '../utils/style';

export const SkipButton: React.FC = ({
  variant,
  className,
}: {
  variant?: ButtonProps['variant'];
  className?: string;
}) => {
  const { updateSkipAnimation } = useGameSkip();

  return (
    <Button
      onClick={() => updateSkipAnimation(true)}
      type="button"
      size="xl"
      variant={variant ? variant : 'success'}
      className={cn('wr-w-full wr-gap-2', className && className)}
    >
      Skip <img width={20} height={20} src={`${CDN_URL}/icons/icon-skip.svg`} alt="" />
    </Button>
  );
};
