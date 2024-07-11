export const toDecimals = (amount: number | string, decimals = 2): number => {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  return Math.floor(amount * 10 ** decimals) / 10 ** decimals;
};
