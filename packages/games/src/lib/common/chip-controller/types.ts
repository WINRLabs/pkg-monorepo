export enum Chip {
  ONE = 1,
  TWO = 10,
  THREE = 100,
  FOUR = 1000,
  FIVE = 10000,
}

export interface ChipControllerProps {
  chipAmount: number;
  totalWager: number;
  selectedChip: Chip;
  balance: number;
  onSelectedChipChange: (c: Chip) => void;
  isDisabled?: boolean;
  className?: string;
}

export interface ChipProps {
  icon: string;
  value: Chip;
  selectedChip: Chip;
  isDisabled?: boolean;
  onSelectedChipChange: (i: Chip) => void;
}
