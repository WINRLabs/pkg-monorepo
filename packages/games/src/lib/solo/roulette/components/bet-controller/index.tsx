import React from "react";
import { useFormContext } from "react-hook-form";
import { Chip } from "../../../../common/chip-controller/types";
import { BetControllerContainer } from "../../../../common/containers";
import {
  BetControllerTitle,
  BetCountFormField,
  WagerFormField,
} from "../../../../common/controller";
import { RouletteForm } from "../../types";
import useRouletteGameStore from "../../store";
import { ChipController } from "../../../../common/chip-controller";
import { Button } from "../../../../ui/button";
import { CDN_URL } from "../../../../constants";
import { NUMBER_INDEX_COUNT } from "../../constants";
import { PreBetButton } from "../../../../common/pre-bet-button";
import { SkipButton } from "../../../../common/skip-button";
import { AudioController } from "../../../../common/audio-controller";
import { useGameOptions } from "../../../../game-provider";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";

export interface Props {
  isPrepared: boolean;
  selectedChip: Chip;
  minWager: number;
  maxWager: number;
  onSelectedChipChange: (c: Chip) => void;
  undoBet: () => void;
}

export const BetController: React.FC<Props> = ({
  isPrepared,
  selectedChip,
  minWager,
  maxWager,
  onSelectedChipChange,
  undoBet,
}) => {
  const { account } = useGameOptions();
  const form = useFormContext() as RouletteForm;
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);

  const wager = form.watch("wager");
  const selectedNumbers = form.watch("selectedNumbers");
  const totalWager = React.useMemo(() => {
    const totalChipCount = selectedNumbers.reduce((acc, cur) => acc + cur, 0);
    return totalChipCount * wager;
  }, [selectedNumbers, wager]);

  const { rouletteGameResults, gameStatus } = useRouletteGameStore([
    "rouletteGameResults",
    "gameStatus",
  ]);

  return (
    <BetControllerContainer>
      <div className="wr-flex-col wr-flex lg:wr-block lg:wr-flex-row">
        <div className="wr-mb-3">
          <BetControllerTitle>Roulette</BetControllerTitle>
        </div>

        <WagerFormField
          customLabel="Chip Value"
          minWager={minWager}
          maxWager={maxWager}
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING"
          }
        />

        <ChipController
          chipAmount={wager}
          totalWager={totalWager}
          balance={account?.balanceAsDollar || 0}
          isDisabled={isPrepared}
          selectedChip={selectedChip}
          onSelectedChipChange={onSelectedChipChange}
          className="wr-mb-6"
        />

        <div className="wr-flex wr-w-full wr-items-center wr-gap-2 wr-mb-6">
          <Button
            type="button"
            disabled={isPrepared || form.getValues().totalWager === 0}
            onClick={() => {
              undoBet();
              digitalClickEffect.play();
            }}
            variant="secondary"
            size="xl"
            className="wr-flex wr-w-full wr-items-center wr-gap-1"
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
            disabled={isPrepared}
            onClick={() => {
              digitalClickEffect.play();
              form.setValue(
                "selectedNumbers",
                new Array(NUMBER_INDEX_COUNT).fill(0)
              );
            }}
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

        <BetCountFormField
          isDisabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            gameStatus == "PLAYING"
          }
        />

        <div className="wr-w-full -wr-order-1 lg:wr-order-none wr-mb-6">
          {!(rouletteGameResults.length > 3) && (
            <PreBetButton totalWager={totalWager}>
              <Button
                type="submit"
                variant="success"
                size="xl"
                onClick={() => clickEffect.play()}
                disabled={
                  form.getValues().totalWager === 0 ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  isPrepared
                }
                isLoading={
                  form.formState.isSubmitting || form.formState.isLoading
                }
                className="wr-w-full"
              >
                Bet
              </Button>
            </PreBetButton>
          )}
          {rouletteGameResults.length > 3 && gameStatus == "PLAYING" && (
            <SkipButton />
          )}
        </div>
      </div>

      <footer className="wr-flex wr-items-center wr-justify-between wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
