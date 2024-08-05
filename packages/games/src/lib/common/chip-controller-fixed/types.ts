export enum ChipFixed {
  ONE = 1,
  TWO = 5,
  THREE = 10,
  FOUR = 20,
  FIVE = 100,
}

export interface ChipControllerFixedProps {
  selectedChip: ChipFixed;
  onSelectedChipChange: (c: ChipFixed) => void;
  isDisabled?: boolean;
  className?: string;
}

export interface ChipFixedProps {
  icon: string;
  value: ChipFixed;
  selectedChip: ChipFixed;
  isDisabled?: boolean;
  onSelectedChipChange: (i: ChipFixed) => void;
}
