import { ChipController } from '../../../common/chip-controller';
import { Chip } from '../../../common/chip-controller/types';
import { PreBetButton } from '../../../common/pre-bet-button';
import { WagerCurrencyIcon } from '../../../common/wager';
import { CDN_URL } from '../../../constants';
import { useGame, useGameOptions } from '../../../game-provider';
import { SoundEffects, useAudioEffect } from '../../../hooks/use-audio-effect';
import { Button } from '../../../ui/button';
import { NumberInput } from '../../../ui/number-input';
import { cn } from '../../../utils/style';
import { BlackjackGameStatus } from '..';

interface BetControllerProps {
  wager: number;
  chipAmount: number;
  onWagerChange: (w: number) => void;
  totalWager: number;
  minWager?: number;
  maxWager?: number;
  selectedChip: Chip;
  isDisabled: boolean;
  isDistributionCompleted: boolean;
  isLastDistributionCompleted: boolean;
  status: BlackjackGameStatus;
  onSelectedChipChange: (c: Chip) => void;
  onClear: () => void;
  onRebet: () => void;
  onDeal: () => void;

  onLogin?: () => void;
}

export const BetController: React.FC<BetControllerProps> = ({
  wager,
  chipAmount,
  totalWager,
  selectedChip,
  isDisabled,
  isDistributionCompleted,
  isLastDistributionCompleted,
  status,
  maxWager,
  minWager,
  onWagerChange,
  onSelectedChipChange,
  onClear,
  onRebet,
  onDeal,
  onLogin,
}) => {
  const clickEffect = useAudioEffect(SoundEffects.BET_BUTTON_CLICK);
  const { account } = useGameOptions();
  const { readyToPlay } = useGame();

  return (
    <div className="max-md:wr-bg-rotated-bg-blur wr-absolute wr-bottom-0 wr-left-0 wr-z-[5] wr-flex wr-w-full wr-items-end wr-justify-between wr-p-4 max-lg:wr-fixed max-lg:wr-z-10 max-lg:wr-bg-rotated-footer max-lg:wr-p-3 max-lg:wr-pt-0">
      <div className="wr-flex wr-w-full wr-max-w-[230px] wr-items-center wr-justify-between wr-gap-2 max-md:wr-max-w-[140px]">
        <div className="wr-flex wr-w-full wr-flex-col wr-gap-2">
          <span className="wr-text-unity-white-50">Chip Value</span>

          <NumberInput.Root
            value={wager}
            onChange={onWagerChange}
            isDisabled={
              isDisabled ||
              (status !== BlackjackGameStatus.NONE && status !== BlackjackGameStatus.FINISHED)
            }
          >
            <NumberInput.Container
              className={cn(
                'wr-border wr-px-2 wr-border-solid wr-border-unity-white-15 wr-bg-unity-white-15 wr-backdrop-blur-md wr-text-base wr-font-semibold wr-leading-4 wr-m-0',
                {
                  ['wr-border wr-border-solid wr-border-red-600']: !!(
                    wager > (maxWager || 2000) || wager < (minWager || 1)
                  ),
                }
              )}
            >
              <span className="wr-mt-[1px] wr-text-md">$</span>
              <NumberInput.Input
                className={cn(
                  'wr-z-10 wr-border-none wr-bg-transparent wr-pl-1 wr-text-base wr-leading-4 wr-outline-none focus-visible:wr-ring-0 focus-visible:wr-ring-transparent focus-visible:wr-ring-offset-0'
                )}
              />
              <WagerCurrencyIcon />
            </NumberInput.Container>
          </NumberInput.Root>
        </div>
      </div>

      {(status === BlackjackGameStatus.FINISHED || status === BlackjackGameStatus.NONE) && (
        <ChipController
          balance={account?.balanceAsDollar || 0}
          totalWager={totalWager}
          chipAmount={chipAmount}
          isDisabled={isDisabled}
          selectedChip={selectedChip}
          onSelectedChipChange={onSelectedChipChange}
          className="wr-mb-0 lg:wr-mb-0"
        />
      )}

      <div className="wr-flex wr-w-full wr-max-w-[220px] wr-flex-col wr-items-end wr-gap-2 max-lg:wr-max-w-[200px] max-lg:wr-flex-row-reverse max-md:wr-max-w-[165px]">
        <div className="wr-flex wr-w-full wr-items-center wr-gap-2">
          <PreBetButton onLogin={onLogin}>
            {(status === BlackjackGameStatus.NONE || status === BlackjackGameStatus.FINISHED) && (
              <Button
                variant="success"
                size="xl"
                disabled={isDisabled || !readyToPlay}
                className="wr-w-full max-lg:wr-max-w-[75px] wr-uppercase"
                onClick={() => {
                  clickEffect.play();
                  onClear();
                  onDeal();
                }}
              >
                Deal
              </Button>
            )}

            {status !== BlackjackGameStatus.FINISHED && status !== BlackjackGameStatus.NONE && (
              <Button
                variant="third"
                size="xl"
                disabled={true}
                className="wr-w-full max-lg:wr-text-sm wr-uppercase"
              >
                In game...
              </Button>
            )}

            {/* {status === BlackjackGameStatus.FINISHED && (
              <Button
                variant="default"
                size="xl"
                className="wr-w-full max-lg:wr-max-w-[75px] wr-uppercase"
                disabled={isDisabled || !isLastDistributionCompleted || !isDistributionCompleted}
                onClick={() => {
                  clickEffect.play();
                  onRebet();
                }}
              >
                Rebet
              </Button>
            )} */}

            <Button
              type="button"
              variant="third"
              size="xl"
              className="wr-flex wr-w-full wr-items-center wr-gap-1 wr-uppercase"
              disabled={
                totalWager === 0 ||
                isDisabled ||
                (status !== BlackjackGameStatus.FINISHED && status !== BlackjackGameStatus.NONE)
              }
              onClick={() => {
                clickEffect.play();
                onClear();
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
          </PreBetButton>
        </div>
      </div>
    </div>
  );
};
