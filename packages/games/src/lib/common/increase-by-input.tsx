import { INumberInputContext, NumberInput } from '../ui/number-input';
import { cn } from '../utils/style';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

interface IncreaseByInputProps extends Props, INumberInputContext {
  containerClassName?: string;
  hasError?: boolean;
}

export const IncreaseByInput = ({
  className,
  containerClassName,
  hasError,
  ...rest
}: IncreaseByInputProps) => {
  return (
    <NumberInput.Root {...rest}>
      <NumberInput.Container
        className={cn(
          'wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px]',
          {
            ['wr-border wr-border-solid wr-border-red-600']: !!hasError,
          },
          containerClassName
        )}
      >
        <NumberInput.Input
          allowNegative={true}
          className={cn(
            'wr-rounded-none wr-border-none wr-bg-transparent wr-py-0 wr-px-0 md:wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0',
            className
          )}
        />
        <span className=" wr-absolute wr-right-2 wr-text-md wr-font-bold wr-text-zinc-500">%</span>
      </NumberInput.Container>
    </NumberInput.Root>
  );
};
