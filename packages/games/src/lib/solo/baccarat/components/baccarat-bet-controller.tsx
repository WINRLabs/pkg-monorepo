import React from "react";
import { useFormContext } from "react-hook-form";

import { ChipController } from "../../../common/chip-controller";
import { Chip } from "../../../common/chip-controller/types";
import {
  UnityWagerFormField,
} from "../../../common/controller";
import { PreBetButton } from "../../../common/pre-bet-button";
import { MaxPayout,TotalWager } from "../../../common/wager";
import { CDN_URL } from "../../../constants";
import { Button } from "../../../ui/button";

export interface BaccaratBetControllerProps {
  totalWager: number;
  maxPayout: number;
  selectedChip: Chip;
  isDisabled: boolean;
  minWager: number;
  maxWager: number;
  onSelectedChipChange: (chip: Chip) => void;
  undoBet: () => void;
}

export const BaccaratBetController: React.FC<BaccaratBetControllerProps> = ({
  totalWager,
  maxPayout,
  selectedChip,
  isDisabled,
  minWager,
  maxWager,
  onSelectedChipChange,
  undoBet,
}) => {
  const form = useFormContext();

  return (
    <>
      <div className="max-md:wr-bg-rotated-bg-blur wr-absolute wr-bottom-0 wr-left-0 wr-z-[5] wr-flex wr-w-full wr-items-end wr-justify-between wr-p-4 max-lg:wr-fixed max-lg:wr-z-10 max-lg:wr-bg-rotated-footer max-lg:wr-p-3 max-lg:wr-pt-0">
        <UnityWagerFormField
          className="wr-p-0 wr-m-0"
          minWager={minWager}
          maxWager={maxWager}
        />

        <ChipController
          isDisabled={isDisabled}
          selectedChip={selectedChip}
          onSelectedChipChange={onSelectedChipChange}
        />
        <div className="wr-flex wr-w-full wr-max-w-[220px] wr-flex-col wr-items-end wr-gap-2 max-lg:wr-max-w-[200px] max-lg:wr-flex-row-reverse">
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
              className="wr-w-full max-lg:wr-max-w-[75px]"
            >
              Deal
            </Button>
            <div className="wr-flex wr-w-full wr-items-center wr-gap-2">
              <Button
                type="button"
                disabled={totalWager === 0 || isDisabled}
                variant="third"
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
                variant="third"
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
          </PreBetButton>
        </div>
      </div>

      <div className="wr-flex wr-w-full wr-max-w-[230px] wr-items-center wr-justify-between wr-gap-2 max-md:wr-max-w-[140px] wr-absolute wr-top-4 wr-left-4">
        <div className="wr-flex wr-w-full wr-flex-col wr-gap-2">
          <span className="wr-text-unity-white-50">Total Wager</span>
          <TotalWager
            containerClassName="wr-bg-unity-white-15"
            wager={totalWager}
            betCount={1}
          />
        </div>
        <div className="wr-flex wr-w-full wr-flex-col wr-gap-2 max-lg:wr-hidden">
          <span className="wr-text-unity-white-50">Max Payout</span>
          <MaxPayout
            containerClassName="wr-bg-unity-white-15"
            maxPayout={maxPayout}
          />
        </div>
      </div>
    </>
  );
};
