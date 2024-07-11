import React from "react";
import { useFormContext } from "react-hook-form";

import { AudioController } from "../../../common/audio-controller";
import { BetControllerContainer } from "../../../common/containers";
import { BetControllerTitle, WagerFormField } from "../../../common/controller";
import { PreBetButton } from "../../../common/pre-bet-button";
import { useGameOptions } from "../../../game-provider";
import { Button } from "../../../ui/button";
import { BlackjackGameStatus } from "../../blackjack";
import { SingleBJActiveGameHands } from "..";

interface Props {
  minWager: number;
  maxWager: number;

  activeHandByIndex: SingleBJActiveGameHands["firstHand" | "splittedFirstHand"];
  activeHandChipAmount: number;
  canInsure: boolean;
  status: BlackjackGameStatus;
  isDistributionCompleted: boolean;
  isControllerDisabled: boolean;

  onHit: (handIndex: number) => void;
  onStand: (handIndex: number) => void;
  onSplit: (handIndex: number) => void;
  onDoubleDown: (handIndex: number) => void;
  onInsure: (handIndex: number) => void;
}

export const BetController: React.FC<Props> = ({
  minWager,
  maxWager,
  canInsure,
  activeHandChipAmount,
  activeHandByIndex,
  status,
  isDistributionCompleted,
  isControllerDisabled,

  onHit,
  onStand,
  onDoubleDown,
  onSplit,
  onInsure,
}) => {
  const [showInsuranceBox, setShowInsuranceBox] = React.useState<
    "show" | "hide"
  >("hide");

  React.useEffect(() => {
    if (canInsure && !activeHandByIndex.hand?.isInsured)
      setShowInsuranceBox("show");
  }, [canInsure, activeHandByIndex.handId, activeHandByIndex.hand?.isInsured]);

  React.useEffect(() => {
    if (canInsure && activeHandByIndex.hand?.isInsured)
      setShowInsuranceBox("hide");
  }, [canInsure, activeHandByIndex.hand?.isInsured]);

  React.useEffect(() => {
    if (status == BlackjackGameStatus.FINISHED) setShowInsuranceBox("hide");
  }, [status]);

  const { account } = useGameOptions();

  const hasBalanceForMove = (chipAmount: number): boolean => {
    const _b = account?.balance || 0;
    return _b >= chipAmount;
  };

  const form = useFormContext();

  return (
    <BetControllerContainer>
      <div className="wr-max-lg:flex wr-max-lg:flex-col">
        <div className="wr-mb-3">
          <BetControllerTitle>1-Hand Blackjack</BetControllerTitle>
        </div>

        <WagerFormField
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={false}
        />

        <PreBetButton>
          {showInsuranceBox == "show" &&
          status !== BlackjackGameStatus.FINISHED ? (
            <InsuranceBox
              activeGameIndex={activeHandByIndex.handId || 0}
              onInsure={onInsure}
              setShow={setShowInsuranceBox}
              disabled={!isDistributionCompleted || isControllerDisabled}
            />
          ) : (
            <div className="wr-grid wr-grid-cols-2 wr-grid-rows-2 wr-gap-x-4 wr-gap-y-5">
              <Button
                onClick={() => onHit(activeHandByIndex.handId || 0)}
                disabled={
                  status == BlackjackGameStatus.FINISHED ||
                  status == BlackjackGameStatus.NONE ||
                  !isDistributionCompleted ||
                  isControllerDisabled
                }
                type="button"
                variant="secondary"
                size="xl"
              >
                Hit
              </Button>
              <Button
                onClick={() => onStand(activeHandByIndex.handId || 0)}
                disabled={
                  status == BlackjackGameStatus.FINISHED ||
                  status == BlackjackGameStatus.NONE ||
                  !isDistributionCompleted ||
                  isControllerDisabled
                }
                type="button"
                variant="secondary"
                size="xl"
              >
                Stand
              </Button>
              <Button
                onClick={() => onSplit(activeHandByIndex.handId || 0)}
                disabled={
                  !activeHandByIndex?.cards?.canSplit ||
                  !isDistributionCompleted ||
                  isControllerDisabled ||
                  activeHandByIndex.hand?.isSplitted ||
                  status == BlackjackGameStatus.FINISHED ||
                  status == BlackjackGameStatus.NONE
                }
                type="button"
                variant="secondary"
                size="xl"
              >
                Split
              </Button>
              <Button
                onClick={() => onDoubleDown(activeHandByIndex.handId || 0)}
                disabled={
                  !isDistributionCompleted ||
                  isControllerDisabled ||
                  !!((activeHandByIndex.cards?.amountCards || 0) !== 2) ||
                  !hasBalanceForMove(activeHandChipAmount || 0) ||
                  status == BlackjackGameStatus.FINISHED ||
                  status == BlackjackGameStatus.NONE
                }
                type="button"
                variant="secondary"
                size="xl"
              >
                Double
              </Button>
            </div>
          )}
          <Button
            className="wr-w-full wr-mt-6"
            variant="success"
            isLoading={form.formState.isSubmitting || form.formState.isLoading}
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              form.formState.isLoading ||
              status == BlackjackGameStatus.PLAYER_TURN ||
              status == BlackjackGameStatus.DEALER_TURN ||
              status == BlackjackGameStatus.TABLE_DEAL
            }
            size="xl"
            type="submit"
          >
            Deal
          </Button>
        </PreBetButton>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};

const InsuranceBox: React.FC<{
  activeGameIndex: number;
  disabled: boolean;
  onInsure: (handIndex: number) => void;
  setShow: (show: "show" | "hide") => void;
}> = ({ activeGameIndex, disabled, onInsure, setShow }) => {
  return (
    <div className="wr-flex wr-flex-col wr-justify-center wr-items-center wr-gap-3 wr-font-bold">
      <h2>Insurance?</h2>
      <div className="wr-grid wr-grid-cols-2 wr-gap-x-2 wr-w-full">
        <Button
          onClick={() => onInsure(activeGameIndex)}
          variant="secondary"
          size="xl"
          className="wr-text-sm wr-font-semibold"
          type="button"
          disabled={disabled}
        >
          Accept Insurance
        </Button>
        <Button
          onClick={() => setShow("hide")}
          variant="secondary"
          size="xl"
          className="wr-text-sm wr-font-semibold"
          type="button"
        >
          No Insurance
        </Button>
      </div>
    </div>
  );
};
