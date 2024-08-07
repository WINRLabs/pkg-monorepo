import { useFormContext } from "react-hook-form";

import { useGameOptions } from "../game-provider";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "../utils/style";

export const PreBetButton = ({
  children,
  variant = "success",
  className,
  totalWager,
}: {
  totalWager?: number;
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  className?: string;
}) => {
  const form = useFormContext();

  const { account } = useGameOptions();

  let _betCount = 1;

  const betCount = form?.watch("betCount");

  const wager = form?.watch("wager");

  !betCount ? (_betCount = 1) : (_betCount = betCount);

  const _totalWager = totalWager ? totalWager : wager * _betCount;

  if (!account?.isLoggedIn)
    return (
      <Button
        variant={variant}
        className={cn("wr-w-full", className)}
        size={"xl"}
        type="button"
      >
        Login
      </Button>
    );

  if (
    account.isLoggedIn &&
    (account.balanceAsDollar <= 0 || account.balanceAsDollar < _totalWager)
  )
    return (
      <Button
        disabled
        variant={variant}
        type="button"
        className={cn("wr-w-full", className)}
        size={"xl"}
      >
        Not enough Balance
      </Button>
    );

  return <>{children}</>;
};
