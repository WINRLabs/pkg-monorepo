import { useFormContext } from "react-hook-form";
import { BetControllerContainer } from "../../../../common/containers";
import {
  BetControllerTitle,
  WagerFormField,
} from "../../../../common/controller";
import { BaccaratForm } from "../../types";
import { useGameOptions } from "../../../../game-provider";
import { Chip } from "../../../../common/chip-controller/types";
import { ChipController } from "../../../../common/chip-controller";
import { Button } from "../../../../ui/button";
import { CDN_URL } from "../../../../constants";
import { cn } from "../../../../utils/style";
import { FormLabel } from "../../../../ui/form";
import { TotalWager, WagerCurrencyIcon } from "../../../../common/wager";
import { toFormatted } from "../../../../utils/web3";
import { PreBetButton } from "../../../../common/pre-bet-button";

export interface Props {
  totalWager: number;
  maxPayout: number;
  selectedChip: Chip;
  isDisabled: boolean;
  minWager: number;
  maxWager: number;
  onSelectedChipChange: (chip: Chip) => void;
  undoBet: () => void;
}

export const BetController: React.FC<Props> = ({
  minWager,
  maxWager,
  isDisabled,
  totalWager,
  selectedChip,
  maxPayout,
  onSelectedChipChange,
  undoBet,
}) => {
  const { account } = useGameOptions();
  const form = useFormContext() as BaccaratForm;

  const wager = form.watch("wager");

  return (
    <BetControllerContainer>
      <div className="wr-flex-col wr-flex lg:wr-block lg:wr-flex-row">
        <div className="wr-mb-3">
          <BetControllerTitle>Baccarat</BetControllerTitle>
        </div>

        <WagerFormField
          customLabel="Chip Value"
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            isDisabled
          }
        />

        <ChipController
          chipAmount={wager}
          totalWager={totalWager}
          balance={account?.balanceAsDollar || 0}
          isDisabled={isDisabled}
          selectedChip={selectedChip}
          onSelectedChipChange={onSelectedChipChange}
          className="wr-mb-6"
        />

        <div className="wr-flex wr-w-full wr-items-center wr-gap-2 wr-mb-6">
          <Button
            type="button"
            disabled={totalWager === 0 || isDisabled}
            variant="secondary"
            size="xl"
            className="wr-flex wr-w-full wr-items-center wr-gap-1"
            onClick={() => undoBet()}
          >
            <img
              src={`${CDN_URL}/icons/icon-undo.svg`}
              width={20}
              height={20}
              alt="Justbet Decentralized Casino"
            />
            <span className="max-lg:wr-hidden">Undo</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="xl"
            className="wr-flex wr-w-full wr-items-center wr-gap-1"
            disabled={totalWager === 0 || isDisabled}
            onClick={() => form.reset()}
          >
            <img
              src={`${CDN_URL}/icons/icon-trash.svg`}
              width={20}
              height={20}
              alt="Justbet Decentralized Casino"
            />
            <span className="max-lg:wr-hidden">Clear</span>
          </Button>
        </div>

        <div className="wr-mb-6 wr-grid wr-grid-cols-2 wr-gap-2">
          <div>
            <FormLabel>Max Payout</FormLabel>
            <div
              className={cn(
                "wr-flex wr-w-full wr-items-center wr-gap-1 wr-rounded-lg wr-bg-zinc-800 wr-px-2 wr-py-[10px] wr-overflow-hidden"
              )}
            >
              <WagerCurrencyIcon />
              <span className={cn("wr-font-semibold wr-text-zinc-100")}>
                ${toFormatted(maxPayout, 2)}
              </span>
            </div>
          </div>
          <div>
            <FormLabel>Total Wager</FormLabel>
            <TotalWager betCount={1} wager={totalWager} />
          </div>
        </div>

        <div className="wr-w-full -wr-order-1 lg:wr-order-none wr-mb-6">
          <PreBetButton>
            <Button
              type="submit"
              variant="success"
              size="xl"
              disabled={
                totalWager === 0 ||
                form.formState.isSubmitting ||
                form.formState.isLoading ||
                isDisabled
              }
              isLoading={
                form.formState.isSubmitting || form.formState.isLoading
              }
              className="wr-w-full"
            >
              Deal
            </Button>
          </PreBetButton>
        </div>
      </div>
    </BetControllerContainer>
  );
};
