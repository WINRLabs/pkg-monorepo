import React from "react";
import { useFormContext } from "react-hook-form";

import { Chip } from "../../../../common/chip-controller/types";
import { renderChipIcon } from "../../../../common/chip-controller/utils";
import { CDN_URL } from "../../../../constants";
import { cn } from "../../../../utils/style";
import {
  BaccaratBetType,
  BaccaratGameResult,
  BaccaratGameSettledResult,
} from "../../types";
import { CardArea } from "../baccarat-card-area";
import styles from "./baccarat-scene.module.css";

// canvas width 900px
// canvas height 900px
// canvas moved top -200px

export interface BaccaratSceneProps {
  baccaratResults: BaccaratGameResult | null;
  baccaratSettled: BaccaratGameSettledResult | null;
  isDisabled: boolean;
  setIsDisabled: (b: boolean) => void;
  addWager: (wager: Chip, betType: BaccaratBetType) => void;
  selectedChip: Chip;
  onAnimationCompleted: (r: BaccaratGameSettledResult) => void;
}

export const BaccaratScene: React.FC<BaccaratSceneProps> = ({
  baccaratResults,
  baccaratSettled,
  addWager,
  isDisabled,
  setIsDisabled,
  selectedChip,
  onAnimationCompleted,
}) => {
  const form = useFormContext();

  const tieWager = form.watch("tieWager");

  const bankerWager = form.watch("bankerWager");

  const playerWager = form.watch("playerWager");

  const [isTieWon, setIsTieWon] = React.useState<boolean>(false);

  const [isBankerWon, setIsBankerWon] = React.useState<boolean>(false);

  const [isPlayerWon, setIsPlayerWon] = React.useState<boolean>(false);

  const setWinner = (bankerCount: number, playerCount: number) => {
    bankerCount === playerCount && setIsTieWon(true);

    bankerCount > playerCount && setIsBankerWon(true);

    playerCount > bankerCount && setIsPlayerWon(true);

    setTimeout(() => {
      setIsTieWon(false);

      setIsBankerWon(false);

      setIsPlayerWon(false);
    }, 2000);
  };

  return (
    <div
      className={cn(
        "wr-absolute wr-left-1/2 wr-top-[-375px] wr-mx-auto wr-h-[750px] wr-w-[750px] -wr-translate-x-1/2",
        styles.baccaratScene
      )}
    >
      <div className="wr-absolute wr-h-full wr-w-full wr-rounded-full wr-border-2 wr-border-[#396c4c] wr-bg-[#1c5032]">
        {/* tie background */}
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[3] wr-h-1/2 wr-w-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-overflow-hidden wr-rounded-full wr-bg-[#11331E]">
          <img
            width={1400}
            height={600}
            className="wr-absolute wr-bottom-0 wr-left-0 wr-max-h-[600px] wr-max-w-[1400px] wr-select-none wr-object-cover wr-object-center"
            src={`${CDN_URL}/baccarat/table-effect.png`}
            alt="JustBet Baccarat"
          />
        </div>
        {/* banker background */}
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[2] wr-h-3/4 wr-w-3/4 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-overflow-hidden wr-rounded-full wr-bg-[#174128]">
          <img
            width={1400}
            height={600}
            className="wr-absolute wr-bottom-0 wr-left-0 wr-max-h-[600px] wr-max-w-[1400px] wr-select-none wr-object-cover wr-object-center"
            src={`${CDN_URL}/baccarat/table-effect.png`}
            alt="JustBet Baccarat"
          />
        </div>
        {/* player background */}
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[1] wr-h-full wr-w-full -wr-translate-x-1/2 -wr-translate-y-1/2 wr-overflow-hidden wr-rounded-full wr-bg-[#11331E]">
          <img
            width={1400}
            height={600}
            className="wr-absolute wr-bottom-0 wr-left-0 wr-max-h-[600px] wr-max-w-[1400px] wr-select-none wr-object-cover wr-object-center"
            src={`${CDN_URL}/baccarat/table-effect.png`}
            alt="JustBet Baccarat"
          />
        </div>
        {/* center circle background */}
        <div className="wr-absolute wr-left-1/2 wr-top-1/2 wr-z-[4] wr-h-1/4 wr-w-1/4 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-overflow-hidden wr-rounded-full wr-bg-[#174128]">
          <img
            width={1400}
            height={600}
            className="wr-absolute wr-bottom-0 wr-left-0 wr-max-h-[600px] wr-max-w-[1400px] wr-select-none wr-object-cover wr-object-center"
            src={`${CDN_URL}/baccarat/table-effect.png`}
            alt="JustBet Baccarat"
          />
        </div>

        {/* bet area */}
        <div className={styles.betArea}>
          <div className={styles.pie}>
            <div
              onClick={() => addWager(selectedChip, BaccaratBetType.TIE)}
              className={cn(
                styles.zone,
                isTieWon && styles.tieWinner,
                isDisabled &&
                  "wr-pointer-events-none wr-cursor-default wr-overflow-hidden",
                "!wr-z-[3] wr-bg-[#11331E]"
              )}
            >
              <div className="wr-absolute wr-bottom-[8%] wr-left-1/2 wr-flex -wr-translate-x-1/2 wr-flex-col wr-text-center wr-text-xl wr-font-bold">
                <span className="wr-text-white">Tie</span>
                <span className="wr-text-sm wr-font-normal">Pays 8 to 1</span>
              </div>

              <div className="wr-absolute wr-bottom-[8%] wr-left-1/2 wr-z-[1] wr-flex -wr-translate-x-1/2">
                {renderChipIcon(tieWager)}
                <span className="wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-font-bold wr-text-white">
                  {tieWager ? tieWager : ""}
                </span>
              </div>

              <img
                width={1400}
                height={600}
                className="wr-absolute wr-left-0 wr-top-0 wr-z-0 wr-h-full wr-max-h-full wr-w-full wr-max-w-full wr-select-none wr-rounded-full"
                src={`${CDN_URL}/baccarat/table-effect.png`}
                alt="JustBet Baccarat"
              />
            </div>

            <div
              onClick={() => addWager(selectedChip, BaccaratBetType.BANKER)}
              className={cn(
                styles.zone,
                isBankerWon && styles.winner,
                isDisabled && "wr-pointer-events-none wr-cursor-default",
                "!wr-z-[2] !wr-h-3/4 !wr-w-3/4 wr-bg-[#174128]"
              )}
            >
              <div className="wr-absolute wr-bottom-[7%] wr-left-1/2 wr-flex -wr-translate-x-1/2 wr-flex-col wr-text-center wr-text-xl wr-font-bold">
                <span className="wr-text-white">Banker</span>
              </div>

              <div className="wr-absolute wr-bottom-[7%] wr-left-1/2 wr-z-[1] wr-flex -wr-translate-x-1/2">
                {renderChipIcon(bankerWager)}
                <span className="wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-font-bold wr-text-white">
                  {bankerWager ? bankerWager : ""}
                </span>
              </div>

              <img
                width={1400}
                height={600}
                className="wr-absolute wr-left-0 wr-top-0 wr-h-full wr-max-h-full wr-w-full wr-max-w-full wr-select-none wr-rounded-full"
                src={`${CDN_URL}/baccarat/table-effect.png`}
                alt="JustBet Baccarat"
              />
            </div>

            <div
              onClick={() => addWager(selectedChip, BaccaratBetType.PLAYER)}
              className={cn(
                styles.zone,
                isPlayerWon && styles.winner,
                isDisabled && "wr-pointer-events-none wr-cursor-default",
                "!wr-z-[1] !wr-h-full !wr-w-full wr-bg-[#11331E]"
              )}
            >
              <div className="wr-absolute wr-bottom-[5%] wr-left-1/2 wr-flex -wr-translate-x-1/2 wr-flex-col wr-text-center wr-text-xl wr-font-bold">
                <span className="wr-text-white">Player</span>
              </div>

              <div className="wr-absolute wr-bottom-[5%] wr-left-1/2 wr-z-[1] wr-flex -wr-translate-x-1/2">
                {renderChipIcon(playerWager)}
                <span className="wr-absolute wr-left-1/2 wr-top-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-font-bold wr-text-white">
                  {playerWager ? playerWager : ""}
                </span>
              </div>

              <img
                width={1400}
                height={600}
                className="wr-absolute wr-left-0 wr-top-0 wr-h-full wr-max-h-full wr-w-full wr-max-w-full wr-select-none wr-rounded-full"
                src={`${CDN_URL}/baccarat/table-effect.png`}
                alt="JustBet Baccarat"
              />
            </div>

            <div className="wr-absolute wr-left-1/2 wr-top-3/4 wr-z-[3] wr-h-1/2 wr-w-[5px] -wr-translate-x-1/2 -wr-translate-y-1/2 wr-bg-[#396C4C]" />
            <div className="wr-absolute wr-left-[24%] wr-top-[65%] wr-z-[3] wr-h-[9.5px] wr-w-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-rotate-[-30deg] wr-bg-[#396C4C]" />
          </div>
        </div>
        {/* bet area end */}
        <CardArea
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
          hands={baccaratResults}
          baccaratSettled={baccaratSettled}
          setWinner={setWinner}
          onAnimationCompleted={onAnimationCompleted}
        />
      </div>
    </div>
  );
};
