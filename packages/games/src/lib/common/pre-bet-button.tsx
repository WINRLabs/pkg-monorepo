import { useFormContext } from 'react-hook-form';

import { useGameOptions } from '../game-provider';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '../utils/style';

export const PreBetButton = ({
  children,
  variant = 'success',
  className,
  totalWager,
  onLogin,
}: {
  totalWager?: number;
  children: React.ReactNode;
  variant?: ButtonProps['variant'];
  className?: string;
  onLogin?: () => void;
}) => {
  const form = useFormContext();

  const { account } = useGameOptions();

  const wager = form?.watch('wager');

  const _totalWager = totalWager ? totalWager : wager;

  if (!account?.isLoggedIn)
    return (
      <Button
        variant={variant}
        className={cn('wr-w-full wr-uppercase', className)}
        size={'xl'}
        type="button"
        onClick={onLogin}
      >
        BET
      </Button>
    );

  if (account.isLoggedIn && (account.balanceAsDollar <= 0 || account.balanceAsDollar < _totalWager))
    return (
      <Button
        disabled
        variant={variant}
        type="button"
        className={cn('wr-w-full wr-uppercase', className)}
        size={'xl'}
      >
        Not enough Balance
      </Button>
    );

  return <>{children}</>;
};
