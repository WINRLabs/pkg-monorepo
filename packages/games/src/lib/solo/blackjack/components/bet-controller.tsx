import { ChipController } from "../../../common/chip-controller";
import { Chip } from "../../../common/chip-controller/types";
import { PreBetButton } from "../../../common/pre-bet-button";
import { TotalWager } from "../../../common/wager";
import { CDN_URL } from "../../../constants";
import { Button } from "../../../ui/button";
import { BlackjackGameStatus } from "..";

interface BetControllerProps {
  totalWager: number;
  selectedChip: Chip;
  isDisabled: boolean;
  isDistributionCompleted: boolean;
  isLastDistributionCompleted: boolean;
  status: BlackjackGameStatus;
  onSelectedChipChange: (c: Chip) => void;
  onClear: () => void;
  onRebet: () => void;
  onDeal: () => void;
}

export const BetController: React.FC<BetControllerProps> = ({
  totalWager,
  selectedChip,
  isDisabled,
  isDistributionCompleted,
  isLastDistributionCompleted,
  status,
  onSelectedChipChange,
  onClear,
  onRebet,
  onDeal,
}) => {
  return (
    <div className="max-md:wr-bg-rotated-bg-blur wr-absolute wr-bottom-0 wr-left-0 wr-z-[5] wr-flex wr-w-full wr-items-end wr-justify-between wr-p-4 max-lg:wr-fixed max-lg:wr-z-10 max-lg:wr-bg-rotated-footer max-lg:wr-p-3 max-lg:wr-pt-0">
      <div className="wr-flex wr-w-full wr-max-w-[230px] wr-items-center wr-justify-between wr-gap-2 max-md:wr-max-w-[140px]">
        <div className="wr-flex wr-w-full wr-flex-col wr-gap-2">
          <span className="wr-text-unity-white-50">Total Wager</span>
          <TotalWager
            containerClassName="wr-bg-unity-white-15"
            wager={totalWager}
            betCount={1}
          />
        </div>
      </div>

      {(status === BlackjackGameStatus.FINISHED ||
        status === BlackjackGameStatus.NONE) && (
        <ChipController
          isDisabled={isDisabled}
          selectedChip={selectedChip}
          onSelectedChipChange={onSelectedChipChange}
        />
      )}

      <div className="wr-flex wr-w-full wr-max-w-[220px] wr-flex-col wr-items-end wr-gap-2 max-lg:wr-max-w-[200px] max-lg:wr-flex-row-reverse max-md:wr-max-w-[165px]">
        <div className="wr-flex wr-w-full wr-items-center wr-gap-2">
          <PreBetButton>
            {status === BlackjackGameStatus.NONE && (
              <Button
                variant="success"
                size="xl"
                disabled={isDisabled}
                className="wr-w-full max-lg:wr-max-w-[75px]"
                onClick={() => onDeal()}
              >
                Deal
              </Button>
            )}

            {status !== BlackjackGameStatus.FINISHED &&
              status !== BlackjackGameStatus.NONE && (
                <Button
                  variant="third"
                  size="xl"
                  disabled={true}
                  className="wr-w-full max-lg:wr-text-sm"
                >
                  In game...
                </Button>
              )}

            {status === BlackjackGameStatus.FINISHED && (
              <Button
                variant="default"
                size="xl"
                className="wr-w-full max-lg:wr-max-w-[75px]"
                disabled={
                  isDisabled ||
                  !isLastDistributionCompleted ||
                  !isDistributionCompleted
                }
                onClick={() => onRebet()}
              >
                Rebet
              </Button>
            )}

            <Button
              type="button"
              variant="third"
              size="xl"
              className="wr-flex wr-w-full wr-items-center wr-gap-1"
              disabled={
                totalWager === 0 ||
                isDisabled ||
                (status !== BlackjackGameStatus.FINISHED &&
                  status !== BlackjackGameStatus.NONE)
              }
              onClick={() => onClear()}
            >
              <img
                src={`${CDN_URL}/icons/icon-trash.svg`}
                width={20}
                height={20}
                alt="Justbet Decentralized Casino"
              />
              <span className="max-lg:wr-hidden">Clear</span>
            </Button>
          </PreBetButton>
        </div>
      </div>
    </div>
  );
};
