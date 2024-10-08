import { INumberInputContext, NumberInput } from '../ui/number-input';
import { cn } from '../utils/style';
import { WagerCurrencyIcon } from './wager';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

interface StopGainLossInputProps extends Props, INumberInputContext {
  containerClassName?: string;
  hasError?: boolean;
}

export const StopGainLossInput = ({
  className,
  containerClassName,
  hasError,
  ...rest
}: StopGainLossInputProps) => {
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
          decimalScale={2}
          className={cn(
            'wr-z-10 wr-border-none wr-bg-transparent wr-pl-1 wr-text-base wr-leading-4 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0',
            className
          )}
        />
        <WagerCurrencyIcon className="wr-hidden lg:!wr-block" />
      </NumberInput.Container>
    </NumberInput.Root>
  );
};
