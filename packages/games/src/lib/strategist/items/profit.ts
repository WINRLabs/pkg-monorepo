export enum ProfitType {
  Balance,
  Lost,
  Profit,
  CumulativeProfit,
  CumulativeLost,
}

export enum ProfitTerm {
  GreaterThan,
  GreaterThanOrEqualTo,
  LowerThan,
  LowerThanOrEqualTo,
}

export type ProfitCondition = ReturnType<typeof toCondition>;

export type Input = {
  term: ProfitTerm;
  type: ProfitType;
  amount: bigint;
};

export const toCondition = (input: Input) => {
  const balance = (amount: bigint, profit: bigint, loss: bigint) => {
    const current = amount + profit - loss;
    if (input.term == ProfitTerm.GreaterThan) {
      return current > input.amount;
    }

    if (input.term == ProfitTerm.GreaterThanOrEqualTo) {
      return current >= input.amount;
    }

    if (input.term == ProfitTerm.LowerThan) {
      return current < input.amount;
    }

    if (input.term == ProfitTerm.LowerThanOrEqualTo) {
      return current <= input.amount;
    }

    return false;
  };

  const lost = (loss: bigint) => {
    if (input.term == ProfitTerm.GreaterThan) {
      return loss > input.amount;
    }

    if (input.term == ProfitTerm.GreaterThanOrEqualTo) {
      return loss >= input.amount;
    }

    if (input.term == ProfitTerm.LowerThan) {
      return loss < input.amount;
    }

    if (input.term == ProfitTerm.LowerThanOrEqualTo) {
      return loss <= input.amount;
    }

    return false;
  };

  const profit = (amount: bigint) => {
    if (input.term == ProfitTerm.GreaterThan) {
      return amount > input.amount;
    }

    if (input.term == ProfitTerm.GreaterThanOrEqualTo) {
      return amount >= input.amount;
    }

    if (input.term == ProfitTerm.LowerThan) {
      return amount < input.amount;
    }

    if (input.term == ProfitTerm.LowerThanOrEqualTo) {
      return amount <= input.amount;
    }

    return false;
  };

  const satisfy = (
    amount: bigint,
    profitAmount: bigint,
    loss: bigint,
    cumulativeProfit: bigint,
    cumulativeLoss: bigint
  ) => {
    if (input.type == ProfitType.Balance) {
      return balance(amount, profitAmount, loss);
    }

    if (input.type == ProfitType.Lost) {
      return lost(loss);
    }

    if (input.type == ProfitType.Profit) {
      return profit(profitAmount);
    }

    if (input.type == ProfitType.CumulativeProfit) {
      const totalProfit = Number(cumulativeProfit) - Number(cumulativeLoss);
      const totalGain = totalProfit < 0 ? BigInt(0) : BigInt(totalProfit);
      return profit(totalGain);
    }

    if (input.type == ProfitType.CumulativeLost) {
      const totalProfit = Number(cumulativeProfit) - Number(cumulativeLoss);
      const totalLoss = totalProfit < 0 ? BigInt(totalProfit * -1) : BigInt(0);
      return lost(totalLoss);
    }

    return false;
  };

  return {
    t: 'profit' as const,
    satisfy,
  };
};
