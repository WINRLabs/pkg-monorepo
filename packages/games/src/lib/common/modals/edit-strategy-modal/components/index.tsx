'use client';

import React from 'react';

import { ConditionType } from '../../../../strategist';
import { Label } from '../../../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../ui/radio';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../../ui/select';
import { cn } from '../../../../utils/style';
import { INumberInputContext, NumberInput } from '../../../../ui/number-input';

export const ConditionSelector: React.FC<{
  selectedCondition: ConditionType;
  onChange: (condition: ConditionType) => void;
}> = ({ selectedCondition, onChange }) => {
  console.log(selectedCondition, 'selectedCondition');
  return (
    <RadioGroup
      defaultValue={`${selectedCondition}`}
      value={`${selectedCondition}`}
      onValueChange={(val) => onChange(Number(val) as ConditionType)}
      className="wr-flex wr-gap-3 wr-items-center"
    >
      <div className="wr-flex wr-items-center wr-space-x-2">
        <RadioGroupItem value={`${ConditionType.BET}`} id="option-one" />
        <Label className="wr-cursor-pointer" htmlFor="option-one">
          Bet Condition
        </Label>
      </div>
      <div className="wr-flex wr-items-center wr-space-x-2">
        <RadioGroupItem value={`${ConditionType.PROFIT}`} id="option-two" />
        <Label className="wr-cursor-pointer" htmlFor="option-two">
          Profit Condition
        </Label>
      </div>
    </RadioGroup>
  );
};

export const FieldSelector = <T extends string | number>({
  isDisabled,
  selectedValue,
  values,
  onChange,
  valueRenderer,
}: {
  isDisabled?: boolean;
  values: T[];
  selectedValue: T;
  onChange: (value: T) => void;
  valueRenderer?(value: T): string;
}) => {
  return (
    <Select
      value={selectedValue as string}
      onValueChange={(e) => onChange(e as T)}
      disabled={isDisabled}
    >
      <SelectTrigger className="wr-bg-zinc-950 wr-border-none">
        {valueRenderer ? valueRenderer(selectedValue) : selectedValue}
      </SelectTrigger>
      <SelectContent className="wr-bg-zinc-950 wr-border-none">
        {values.map((v, i) => (
          <SelectItem value={v as string} key={i}>
            <span className="wr-font-semibold">{valueRenderer ? valueRenderer(v) : v}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface FieldInputProps extends INumberInputContext {
  containerClassName?: string;
  prefix?: string;
  decimalScale?: number;
}

export const FieldInput = ({
  containerClassName,
  prefix,
  decimalScale,
  ...rest
}: FieldInputProps) => {
  return (
    <NumberInput.Root className="wr-w-full" hideError {...rest}>
      <NumberInput.Container
        className={cn(
          'wr-border-none wr-bg-zinc-950 wr-px-2 wr-py-[10px] wr-w-full',
          containerClassName
        )}
      >
        <NumberInput.Input
          prefix={prefix}
          decimalScale={decimalScale}
          className={cn(
            'wr-rounded-none wr-border-none wr-bg-transparent wr-py-0 wr-px-0 md:wr-py-2 wr-text-base wr-font-semibold wr-leading-5 wr-text-white wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0 wr-w-full'
          )}
        />
      </NumberInput.Container>
    </NumberInput.Root>
  );
};
