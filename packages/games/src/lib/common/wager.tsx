import { useGameOptions } from "../game-provider";
import { Button } from "../ui/button";
import { INumberInputContext, NumberInput } from "../ui/number-input";
import { cn } from "../utils/style";
import { toFormatted } from "../utils/web3";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export const WagerBalance = ({ className }: Props) => {
  const { account } = useGameOptions();

  return (
    <span
      className={cn("wr-mr-2 wr-cursor-pointer", className)}
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
}

export const WagerInput = ({
  className,
  containerClassName,
  hasError,
  ...rest
}: WagerInputProps) => {
  return (
    <NumberInput.Root {...rest}>
      <NumberInput.Container
        className={cn(
          "wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px] wr-text-base wr-font-semibold wr-leading-4",
          {
            ["wr-border wr-border-solid wr-border-red-600"]: !!hasError,
          },
          containerClassName
        )}
      >
        <span className="wr-mt-[1px] wr-text-lg">$</span>
        <NumberInput.Input
          className={cn(
            "wr-z-10 wr-border-none wr-bg-transparent wr-pl-1 wr-text-base wr-leading-4 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0",
            className
          )}
        />
        <WagerCurrencyIcon />
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
  return (
    <div className="wr-flex wr-items-center wr-gap-1 wr-">
      <Button
        className={cn("wr-w-full wr-font-[500]", className)}
        type="button"
        disabled={isDisabled}
        variant={"secondary"}
        onClick={() => {
          form.setValue("wager", minWager);
        }}
      >
        MIN
      </Button>
      <Button
        className={cn("wr-w-full wr-font-[500]", className)}
        type="button"
        disabled={isDisabled}
        variant={"secondary"}
        onClick={() => {
          const newValue = currentWager / 3;

          if (newValue < minWager) form.setValue("wager", minWager);
          else form.setValue("wager", newValue);
        }}
      >
        1/3
      </Button>
      <Button
        className={cn("wr-w-full wr-font-[500]", className)}
        type="button"
        disabled={isDisabled}
        variant={"secondary"}
        onClick={() => {
          const newValue = currentWager * 2;

          if (newValue > maxWager) form.setValue("wager", maxWager);
          else form.setValue("wager", newValue);
        }}
      >
        2x
      </Button>
      <Button
        className={cn("wr-w-full wr-font-[500]", className)}
        type="button"
        disabled={isDisabled}
        variant={"secondary"}
        onClick={() => {
          form.setValue("wager", maxWager);
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

export const TotalWager = ({
  className,
  wager,
  betCount,
  containerClassName,
}: TotalWagerProps) => {
  const totalWager = toFormatted(wager * betCount, 2);

  return (
    <div
      className={cn(
        "wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]",
        containerClassName
      )}
    >
      <WagerCurrencyIcon />
      <span className={cn("wr-font-semibold wr-text-zinc-100", className)}>
        ${totalWager}
      </span>
    </div>
  );
};

interface MaxPayoutProps extends Props {
  maxPayout: number;
  containerClassName?: string;
}

export const MaxPayout = ({
  className,
  maxPayout,
  containerClassName,
}: MaxPayoutProps) => {
  const _maxPayout = toFormatted(maxPayout, 2);

  return (
    <div
      className={cn(
        "wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px]",
        containerClassName
      )}
    >
      <WagerCurrencyIcon />
      <span className={cn("wr-font-semibold wr-text-zinc-100", className)}>
        ${_maxPayout}
      </span>
    </div>
  );
};

export const WagerCurrencyIcon = ({ className }: Props) => {
  const { currency } = useGameOptions();

  const tokenIcon = currency?.icon;

  return (
    <img
      className={cn("wr-mr-1 wr-h-5 wr-w-5", className)}
      width={20}
      height={20}
      alt={`${currency.name}-icon`}
      src={tokenIcon}
    />
  );
};
