import { useFormContext } from "react-hook-form";

import { CDN_URL } from "../../../../constants";
import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import { Button } from "../../../../ui/button";
import { NUMBER_INDEX_COUNT } from "../../constants";
import { RouletteForm } from "../../types";
import { cn } from "../../../../utils/style";

export const MobileController: React.FC<{
  undoBet: () => void;
  isPrepared: boolean;
}> = ({ undoBet, isPrepared }) => {
  const digitalClickEffect = useAudioEffect(SoundEffects.BUTTON_CLICK_DIGITAL);
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const form = useFormContext() as RouletteForm;

  return (
    <div
      className={cn(
        "wr-flex wr-flex-col md:wr-hidden wr-absolute wr-right-2 wr-gap-2 wr-top-1/2 -wr-translate-y-1/2 wr-transition-all wr-duration-200",
        {
          "wr-blur-[4px] wr-select-none wr-pointer-events-none wr-z-0":
            isPrepared,
        }
      )}
    >
      <Button
        type="button"
        variant="third"
        className="wr-w-[44px] wr-h-[44px] wr-rounded-full"
        disabled={isPrepared || form.getValues().totalWager === 0}
        onClick={() => {
          undoBet();
          digitalClickEffect.play();
        }}
        size="xl"
      >
        <img
          src={`${CDN_URL}/icons/icon-undo.svg`}
          width={20}
          height={20}
          alt="Justbet Decentralized Casino"
        />
      </Button>
      <Button
        variant="success"
        className="wr-rounded-full wr-w-[44px] wr-h-[44px] wr-p-0"
        onClick={() => clickEffect.play()}
        type="submit"
        disabled={
          form.getValues().totalWager === 0 ||
          form.formState.isSubmitting ||
          form.formState.isLoading ||
          isPrepared
        }
        isLoading={form.formState.isSubmitting || form.formState.isLoading}
      >
        Spin
      </Button>
      <Button
        type="button"
        variant="third"
        className="wr-w-[44px] wr-h-[44px] wr-rounded-full"
        size="xl"
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
      </Button>
    </div>
  );
};
