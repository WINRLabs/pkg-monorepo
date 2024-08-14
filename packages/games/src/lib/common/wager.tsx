import { useGameOptions } from '../game-provider';
import { SoundEffects, useAudioEffect } from '../hooks/use-audio-effect';
import { Button } from '../ui/button';
import { INumberInputContext, NumberInput } from '../ui/number-input';
import { cn } from '../utils/style';
import { toFormatted } from '../utils/web3';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export const WagerBalance = ({ className }: Props) => {
  const { account } = useGameOptions();

  return (
    <span
      className={cn('wr-mr-2 wr-cursor-pointer', className)}
      // onClick={() => form.setValue("wager", data?.maxWager || 10)}
    >
      ${toFormatted(account?.balanceAsDollar || 0, 2)}
    </span>
  );
};

export const WagerCurrency = ({ className }: Props) => {
  const { currency } = useGameOptions();

  return <span className={cn(className)}>{currency.symbol}</span>;
};

interface WagerInputProps extends Props, INumberInputContext {
  containerClassName?: string;
  hasError?: boolean;
  minWager: number;
  maxWager: number;
  form: any;
}

export const WagerInput = ({
  className,
  containerClassName,
  hasError,
  minWager,
  maxWager,
  form,
  ...rest
}: WagerInputProps) => {
  const clickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  return (
    <NumberInput.Root {...rest}>
      <NumberInput.Container
        className={cn(
          'wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px] wr-text-md wr-font-semibold wr-leading-4',
          {
            ['wr-border wr-border-solid wr-border-red-600']: !!hasError,
          },
          containerClassName
        )}
      >
        <span className="wr-mt-[1px] wr-text-md">$</span>
        <NumberInput.Input
          className={cn(
            'wr-z-10 wr-border-none wr-bg-transparent wr-pl-1 wr-text-base wr-leading-4 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0',
            className
          )}
        />
        <WagerCurrencyIcon className="wr-hidden lg:!wr-block" />

        <div className="wr-z-10 wr-flex -wr-m-[6px] wr-gap-[2px] lg:!wr-hidden">
          <Button
            className={cn('wr-w-14 wr-font-[600] wr-text-base', className)}
            type="button"
            disabled={rest.isDisabled}
            variant={'secondary'}
            onClick={() => {
              clickEffect.play();
              const newValue = rest.value / 2;

              if (newValue < minWager) form.setValue('wager', minWager);
              else form.setValue('wager', newValue);
            }}
          >
            1/2
          </Button>
          <Button
            className={cn('wr-w-14 wr-font-[600] wr-text-base', className)}
            type="button"
            disabled={rest.isDisabled}
            variant={'secondary'}
            onClick={() => {
              clickEffect.play();
              const newValue = rest.value * 2;

              if (newValue > maxWager) form.setValue('wager', maxWager);
              else form.setValue('wager', newValue);
            }}
          >
            2x
          </Button>
          <Button
            className={cn('wr-w-14 wr-font-[600] wr-text-base', className)}
            type="button"
            disabled={rest.isDisabled}
            variant={'secondary'}
            onClick={() => {
              clickEffect.play();
              form.setValue('wager', maxWager);
            }}
          >
            MAX
          </Button>
        </div>
      </NumberInput.Container>
    </NumberInput.Root>
  );
};

interface WagerSetterButtonsProps extends Props {
  maxWager: number;
  minWager: number;
  currentWager: number;
  form: any;
  isDisabled?: boolean;
}

export const WagerSetterButtons = ({
  className,
  minWager,
  maxWager,
  currentWager,
  form,
  isDisabled,
}: WagerSetterButtonsProps) => {
  const clickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  return (
    <div className="wr-flex wr-items-center wr-gap-1 wr-mt-1.5">
      <Button
        className={cn('wr-w-full wr-font-[600] wr-text-base', className)}
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          clickEffect.play();
          form.setValue('wager', minWager);
        }}
      >
        MIN
      </Button>
      <Button
        className={cn('wr-w-full wr-font-[600] wr-text-base', className)}
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          clickEffect.play();
          const newValue = currentWager / 2;

          if (newValue < minWager) form.setValue('wager', minWager);
          else form.setValue('wager', newValue);
        }}
      >
        1/2
      </Button>
      <Button
        className={cn('wr-w-full wr-font-[600] wr-text-base', className)}
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          clickEffect.play();
          const newValue = currentWager * 2;
          const maxAmount = maxWager > balanceAsDollar ? balanceAsDollar : maxWager;

          if (newValue > maxAmount) form.setValue('wager', maxAmount);
          else form.setValue('wager', newValue);
        }}
      >
        2x
      </Button>
      <Button
        className={cn('wr-w-full wr-font-[600] wr-text-base', className)}
        type="button"
        disabled={isDisabled}
        variant={'secondary'}
        onClick={() => {
          clickEffect.play();
          const maxAmount = maxWager > balanceAsDollar ? balanceAsDollar : maxWager;
          form.setValue('wager', maxAmount);
        }}
      >
        MAX
      </Button>
    </div>
  );
};

interface TotalWagerProps extends Props {
  betCount: number;
  wager: number;
  containerClassName?: string;
}

export const TotalWager = ({ className, wager, betCount, containerClassName }: TotalWagerProps) => {
  const totalWager = toFormatted(wager * betCount, 2);

  return (
    <div
      className={cn(
        'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]',
        containerClassName
      )}
    >
      <WagerCurrencyIcon />
      <span className={cn('wr-font-semibold wr-text-zinc-100', className)}>${totalWager}</span>
    </div>
  );
};

interface MaxPayoutProps extends Props {
  maxPayout: number;
  containerClassName?: string;
}

export const MaxPayout = ({ className, maxPayout, containerClassName }: MaxPayoutProps) => {
  const _maxPayout = toFormatted(maxPayout, 2);

  return (
    <div
      className={cn(
        'wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]',
        containerClassName
      )}
    >
      <WagerCurrencyIcon />
      <span className={cn('wr-font-semibold wr-text-zinc-100', className)}>${_maxPayout}</span>
    </div>
  );
};

export const WagerCurrencyIcon = ({ className }: Props) => {
  const { currency } = useGameOptions();

  const tokenIcon = currency?.icon;

  return (
    <img
      className={cn('wr-mr-1 wr-h-5 wr-w-5', className)}
      width={20}
      height={20}
      alt={`${currency.name}-icon`}
      src={tokenIcon}
    />
  );
};
