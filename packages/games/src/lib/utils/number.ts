export const genNumberArray = (length: number): number[] => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push(i);
  }

  return arr;
};

export const numberShorter = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

export function parseToBigInt(floatValue: number, precision: number) {
  const scaledValue = floatValue * Math.pow(10, precision);
  const integerValue = Math.round(scaledValue);

  return BigInt(integerValue);
}
