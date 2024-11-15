'use client';

import React from 'react';

import { useCustomBetStrategistStore } from '../../../hooks/use-custom-bet-strategist/store';
import {
  BetConditionFormValues,
  ConditionType,
  CreatedStrategyItem,
  NORMALIZED_PRECISION,
  ProfitConditionFormValues,
  WAGER_PRECISION,
} from '../../../strategist';
import { Option } from '../../../strategist/items/action';
import { Term, Type } from '../../../strategist/items/bet';
import { ProfitTerm, ProfitType } from '../../../strategist/items/profit';
import { IconChevronLeft, IconEdit, IconStrategy, IconTrash } from '../../../svgs';
import { Button } from '../../../ui/button';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { parseToBigInt, parseToNumber } from '../../../utils/number';
import { useWeb3GamesModalsStore } from '../modals.store';
import { Web3GamesEditStrategyModalProps } from '../types';
import { ConditionSelector, FieldInput, FieldSelector } from './components';
import {
  getActionOptionString,
  getActionOptionType,
  getBetTermString,
  getBetTypeString,
  getOptionAmount,
  getProfitTermString,
  getProfitTypeString,
} from './utils';

export const EditStrategyModal = ({
  addDefaultCondition,
  removeCondition,
  updateBetCondition,
  updateProfitCondition,
  withoutExternalOption,
}: Web3GamesEditStrategyModalProps) => {
  const { selectedStrategy: strategy } = useCustomBetStrategistStore(['selectedStrategy']);
  const { modal } = useWeb3GamesModalsStore();
  const [isAddingCondition, setIsAddingCondition] = React.useState<boolean>(false);
  if (!strategy) return null;

  const handleAddDefaultCondition = async () => {
    if (typeof strategy.strategyId !== 'number') return;
    setIsAddingCondition(true);
    addDefaultCondition && (await addDefaultCondition(strategy.strategyId));
    setIsAddingCondition(false);
  };

  return (
    <Dialog open={modal === 'editStrategy'}>
      <DialogContent className="!wr-max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="wr-items-center">
            <IconStrategy className="wr-h-5 wr-w-5" />
            {strategy.name}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {strategy.originalItems?.map((i, idx) => (
            <StrategyItem
              {...i}
              removeCondition={removeCondition}
              updateBetCondition={updateBetCondition}
              updateProfitCondition={updateProfitCondition}
              strategyId={strategy.strategyId}
              withoutExternalOption={withoutExternalOption}
              idx={idx}
              key={idx}
            />
          ))}
          <Button
            variant="secondary"
            onClick={handleAddDefaultCondition}
            disabled={isAddingCondition}
            isLoading={isAddingCondition}
            className="wr-w-full wr-uppercase"
          >
            Add Condition
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

const StrategyItem: React.FC<
  CreatedStrategyItem & {
    removeCondition?: (strategyId: number, index: number) => Promise<void>;
    updateBetCondition?: (
      strategyId: number,
      itemId: number,
      condition: BetConditionFormValues
    ) => Promise<void>;
    updateProfitCondition?: (
      strategyId: number,
      itemId: number,
      condition: ProfitConditionFormValues
    ) => Promise<void>;
    strategyId?: number;
    withoutExternalOption?: boolean;
    idx: number;
  }
> = ({
  bet,
  profit,
  type_,
  action,
  itemId,
  idx,
  strategyId,
  withoutExternalOption,
  removeCondition,
  updateBetCondition,
  updateProfitCondition,
}) => {
  const [isRemoving, setIsRemoving] = React.useState<boolean>(false);
  const [isEditable, setIsEditable] = React.useState<boolean>(false);

  const handleRemoveCondition = async () => {
    if (typeof strategyId !== 'number') return;
    setIsRemoving(true);
    removeCondition && (await removeCondition(strategyId, idx));
    setIsRemoving(false);
  };

  return (
    <div>
      <p className="wr-text-zinc-500 wr-font-bold wr-mb-3">Condition {idx + 1} </p>
      {!isEditable ? (
        <div className="wr-bg-onyx-400 wr-rounded-lg wr-p-4 wr-mb-3 wr-flex wr-gap-3 wr-font-semibold">
          <div className="wr-flex wr-justify-start wr-items-start wr-gap-3 wr-flex-col wr-w-full">
            {type_ == ConditionType.BET && (
              <div className="wr-flex wr-gap-1 wr-items-center">
                <p className="wr-text-zinc-500">On</p>
                <p className="wr-text-white">{getBetTermString(bet.term)}</p>
                <p className="wr-text-yellow-500">
                  {bet.amount} {getBetTypeString(bet.type_)}
                </p>
              </div>
            )}

            {type_ == ConditionType.PROFIT && (
              <div className="wr-flex wr-gap-1 wr-items-center">
                <p className="wr-text-zinc-500">On</p>
                <p className="wr-text-white">{getProfitTermString(profit.term)}</p>
                <p className="wr-text-yellow-500">
                  ${parseToNumber(profit.amount, WAGER_PRECISION)}{' '}
                  {getProfitTypeString(profit.type_)}
                </p>
              </div>
            )}

            <div className="wr-flex wr-gap-3 wr-justify-start wr-items-center">
              <IconChevronLeft className="wr-rotate-180 wr-w-4 wr-h-4" />
              <div className="wr-flex wr-gap-1 wr-items-center">
                <p className="wr-text-white"> {getActionOptionString(action.option)} </p>
                <p className="wr-text-yellow-500">
                  {getOptionAmount(action.option, action.amount) || ''}
                </p>
              </div>
            </div>
          </div>
          <div className="wr-flex wr-items-center wr-gap-2">
            <Button
              onClick={() => setIsEditable(true)}
              variant="secondary"
              type="button"
              className="wr-max-w-[55px] wr-w-full wr-h-full max-md:wr-p-0 max-md:max-w-[30px] max-md:h-[30px] max-md:wr-bg-transparent"
            >
              <IconEdit className="wr-h-5 wr-w-5 wr-text-white" />
            </Button>

            <Button
              variant="secondary"
              onClick={handleRemoveCondition}
              type="button"
              isLoading={isRemoving}
              disabled={isRemoving}
              className="wr-max-w-[55px] wr-w-full wr-h-full max-md:wr-p-0 max-md:max-w-[30px] max-md:h-[30px] max-md:wr-bg-transparent"
            >
              <IconTrash className="wr-h-5 wr-w-5 wr-text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <ConditionEditor
          initialCondition={{
            bet: bet,
            profit: profit,
            type_: type_,
            action: action,
            itemId: itemId,
          }}
          strategyId={strategyId}
          withoutExternalOption={withoutExternalOption}
          onChangeIsEditable={setIsEditable}
          updateBetCondition={updateBetCondition}
          updateProfitCondition={updateProfitCondition}
        />
      )}
    </div>
  );
};

export const ConditionEditor: React.FC<{
  initialCondition: CreatedStrategyItem;
  strategyId?: number;
  onChangeIsEditable: (b: boolean) => void;
  updateBetCondition?: (
    strategyId: number,
    itemId: number,
    condition: BetConditionFormValues
  ) => Promise<void>;
  updateProfitCondition?: (
    strategyId: number,
    itemId: number,
    condition: ProfitConditionFormValues
  ) => Promise<void>;
  withoutExternalOption?: boolean;
}> = ({
  initialCondition,
  strategyId,
  withoutExternalOption,
  onChangeIsEditable,
  updateBetCondition,
  updateProfitCondition,
}) => {
  const [selectedCondition, setSelectedCondition] = React.useState<ConditionType>(
    ConditionType.BET
  );

  React.useEffect(() => {
    if (initialCondition.type_ == ConditionType.BET) {
      setSelectedCondition(ConditionType.BET);
    } else if (initialCondition.type_ == ConditionType.PROFIT) {
      setSelectedCondition(ConditionType.PROFIT);
    }
  }, [initialCondition.type_]);

  return (
    <div className="wr-bg-onyx-400 wr-rounded-lg wr-p-4 wr-mb-3 wr-flex wr-flex-col wr-gap-3 wr-font-semibold">
      <ConditionSelector selectedCondition={selectedCondition} onChange={setSelectedCondition} />
      {selectedCondition == ConditionType.BET && (
        <BetConditionEditor
          initialCondition={initialCondition}
          strategyId={strategyId}
          withoutExternalOption={withoutExternalOption}
          onChangeIsEditable={onChangeIsEditable}
          updateBetCondition={updateBetCondition}
        />
      )}
      {selectedCondition == ConditionType.PROFIT && (
        <ProfitConditionEditor
          initialCondition={initialCondition}
          strategyId={strategyId}
          withoutExternalOption={withoutExternalOption}
          onChangeIsEditable={onChangeIsEditable}
          updateProfitCondition={updateProfitCondition}
        />
      )}
    </div>
  );
};

const options = [
  Option.IncreaseByPercentage,
  Option.DecreaseByPercentage,
  Option.AddToAmount,
  Option.SubtractFromAmount,
  Option.SetAmount,
  Option.ResetAmount,
  Option.SwitchOverUnder,
  Option.Stop,
];

const optionsWithoutExternals = options.filter((o) => o != Option.SwitchOverUnder);

export const BetConditionEditor: React.FC<{
  initialCondition: CreatedStrategyItem;
  strategyId?: number;
  withoutExternalOption?: boolean;
  onChangeIsEditable: (b: boolean) => void;
  updateBetCondition?: (
    strategyId: number,
    itemId: number,
    condition: BetConditionFormValues
  ) => Promise<void>;
}> = ({
  initialCondition,
  strategyId,
  withoutExternalOption,
  onChangeIsEditable,
  updateBetCondition,
}) => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<BetConditionFormValues>({
    onTerm: initialCondition.bet.term,
    onType: initialCondition.bet.type_,
    onAmount: initialCondition.bet.amount,
    actionOption: initialCondition.action.option,
    actionAmount: initialCondition.action.amount,
  });

  const handleUpdate = async () => {
    if (typeof strategyId !== 'number') return;
    setIsUpdating(true);
    updateBetCondition &&
      (await updateBetCondition(strategyId, initialCondition.itemId, formValues));
    setIsUpdating(false);
    onChangeIsEditable(false);
  };

  return (
    <div className="wr-w-full">
      <label className="wr-font-semibold wr-text-zinc-500">On</label>
      <div className="wr-flex wr-gap-3 wr-items-center wr-my-1.5">
        <FieldSelector<Term>
          selectedValue={formValues.onTerm}
          values={Object.values(Term).filter((v) => typeof v == 'number')}
          onChange={(val) => setFormValues({ ...formValues, onTerm: val })}
          valueRenderer={getBetTermString}
        />

        <FieldInput
          minValue={0}
          maxValue={50}
          decimalScale={0}
          value={formValues.onAmount}
          onChange={(val) => setFormValues({ ...formValues, onAmount: val })}
        />

        <FieldSelector<Type>
          selectedValue={formValues.onType}
          values={Object.values(Type).filter((v) => typeof v == 'number')}
          onChange={(val) => setFormValues({ ...formValues, onType: val })}
          valueRenderer={getBetTypeString}
        />
      </div>
      <label className="wr-font-semibold wr-text-zinc-500">Do</label>
      <div className="wr-flex wr-gap-3 wr-items-center wr-mt-1.5">
        <FieldSelector<Option>
          selectedValue={formValues.actionOption}
          values={withoutExternalOption ? optionsWithoutExternals : options}
          onChange={(val) => setFormValues({ ...formValues, actionOption: val })}
          valueRenderer={getActionOptionString}
        />

        {getActionOptionType(formValues.actionOption) == 'WAGER' && (
          <FieldInput
            minValue={0}
            maxValue={1000}
            decimalScale={2}
            prefix="$"
            value={parseToNumber(formValues.actionAmount, WAGER_PRECISION)}
            onChange={(val) =>
              setFormValues({ ...formValues, actionAmount: parseToBigInt(val, WAGER_PRECISION) })
            }
          />
        )}

        {getActionOptionType(formValues.actionOption) == 'NUMBER' && (
          <FieldInput
            minValue={0}
            maxValue={100}
            decimalScale={2}
            value={parseToNumber(formValues.actionAmount, NORMALIZED_PRECISION)}
            onChange={(val) =>
              setFormValues({
                ...formValues,
                actionAmount: parseToBigInt(val, NORMALIZED_PRECISION),
              })
            }
          />
        )}
      </div>
      <div className="wr-flex wr-justify-end wr-w-full wr-gap-2 wr-mt-3">
        <Button
          className="wr-uppercase wr-font-semibold"
          onClick={() => onChangeIsEditable(false)}
          variant="secondary"
        >
          Close
        </Button>
        <Button
          onClick={handleUpdate}
          isLoading={isUpdating}
          className="wr-uppercase wr-font-semibold"
          variant="success"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export const ProfitConditionEditor: React.FC<{
  initialCondition: CreatedStrategyItem;
  strategyId?: number;
  withoutExternalOption?: boolean;
  onChangeIsEditable: (b: boolean) => void;
  updateProfitCondition?: (
    strategyId: number,
    itemId: number,
    condition: ProfitConditionFormValues
  ) => Promise<void>;
}> = ({
  initialCondition,
  strategyId,
  withoutExternalOption,
  onChangeIsEditable,
  updateProfitCondition,
}) => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<ProfitConditionFormValues>({
    onTerm: initialCondition.profit.term,
    onType: initialCondition.profit.type_,
    onAmount: initialCondition.profit.amount,
    actionOption: initialCondition.action.option,
    actionAmount: initialCondition.action.amount,
  });

  const handleUpdate = async () => {
    if (typeof strategyId !== 'number') return;
    setIsUpdating(true);
    updateProfitCondition &&
      (await updateProfitCondition(strategyId, initialCondition.itemId, formValues));
    setIsUpdating(false);
    onChangeIsEditable(false);
  };

  return (
    <div className="wr-w-full">
      <label className="wr-font-semibold wr-text-zinc-500">On</label>
      <div className="wr-flex wr-gap-3 wr-items-center wr-my-1.5">
        <FieldSelector<ProfitType>
          selectedValue={formValues.onType}
          values={[ProfitType.Balance, ProfitType.Lost, ProfitType.Profit]}
          onChange={(val) => setFormValues({ ...formValues, onType: val })}
          valueRenderer={getProfitTypeString}
        />

        <FieldSelector<ProfitTerm>
          selectedValue={formValues.onTerm}
          values={Object.values(ProfitTerm).filter((v) => typeof v == 'number')}
          onChange={(val) => setFormValues({ ...formValues, onTerm: val })}
          valueRenderer={getProfitTermString}
        />

        <FieldInput
          minValue={0}
          maxValue={1000}
          decimalScale={2}
          prefix="$"
          value={parseToNumber(formValues.onAmount, WAGER_PRECISION)}
          onChange={(val) =>
            setFormValues({ ...formValues, onAmount: parseToBigInt(val, WAGER_PRECISION) })
          }
        />
      </div>
      <label className="wr-font-semibold wr-text-zinc-500">Do</label>
      <div className="wr-flex wr-gap-3 wr-items-center wr-mt-1.5">
        <FieldSelector<Option>
          selectedValue={formValues.actionOption}
          values={withoutExternalOption ? optionsWithoutExternals : options}
          onChange={(val) => setFormValues({ ...formValues, actionOption: val })}
          valueRenderer={getActionOptionString}
        />

        {getActionOptionType(formValues.actionOption) == 'WAGER' && (
          <FieldInput
            minValue={0}
            maxValue={1000}
            decimalScale={2}
            prefix="$"
            value={parseToNumber(formValues.actionAmount, WAGER_PRECISION)}
            onChange={(val) =>
              setFormValues({ ...formValues, actionAmount: parseToBigInt(val, WAGER_PRECISION) })
            }
          />
        )}

        {getActionOptionType(formValues.actionOption) == 'NUMBER' && (
          <FieldInput
            minValue={0}
            maxValue={100}
            decimalScale={2}
            value={parseToNumber(formValues.actionAmount, NORMALIZED_PRECISION)}
            onChange={(val) =>
              setFormValues({
                ...formValues,
                actionAmount: parseToBigInt(val, NORMALIZED_PRECISION),
              })
            }
          />
        )}
      </div>
      <div className="wr-flex wr-justify-end wr-w-full wr-gap-2 wr-mt-3">
        <Button
          className="wr-uppercase wr-font-semibold"
          onClick={() => onChangeIsEditable(false)}
          variant="secondary"
        >
          Close
        </Button>
        <Button
          onClick={handleUpdate}
          isLoading={isUpdating}
          className="wr-uppercase wr-font-semibold"
          variant="success"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
