import { CountdownProvider, Minutes, Seconds } from "../../../../ui/countdown";
import { cn } from "../../../../utils/style";
import { MultiplayerGameStatus } from "../../../core/type";
import { colorMultipliers, WheelUnits } from "../../constants";
import { useWheelGameStore } from "../../store";
import { Wheel } from "./wheel";
import styles from "./wheel-scene.module.css";

export const WheelScene = ({ onComplete }: { onComplete?: () => void }) => {
  const {
    winnerAngle,
    winnerColor,
    joiningFinish,
    status,
    showResult,
    setShowResult,
  } = useWheelGameStore([
    "winnerAngle",
    "winnerColor",
    "joiningFinish",
    "status",
    "showResult",
    "setShowResult",
  ]);
  const multiplier = colorMultipliers[winnerColor];

  return (
    <div className={styles.container}>
      <div className={styles.wheelContent}>
        <div className={styles.status}>
          {status === MultiplayerGameStatus.None && (
            <div className="wr-text-xl wr-leading-5 wr-text-zinc-100">
              Bet to Start <br />
              <span className="wr-text-base wr-leading-5 wr-text-zinc-500">
                The game will start after someone places a bet
              </span>
            </div>
          )}

          {status == MultiplayerGameStatus.Wait && (
            <section className="wr-text-center">
              <div className="wr-mb-3 wr-text-xl wr-leading-5 wr-text-zinc-100">
                Remaining time:
              </div>
              <CountdownProvider
                targetDate={new Date(joiningFinish * 1000)?.toISOString()}
              >
                <section className="wr-mt-2 wr-flex wr-items-center wr-justify-center wr-gap-2">
                  <div className="wr-text-[32px] wr-font-bold wr-leading-[32px] wr-text-white">
                    <Minutes />
                  </div>
                  <div className="wr-text-[32px] wr-font-bold wr-leading-[32px] wr-text-white">
                    :
                  </div>
                  <div className="wr-text-[32px] wr-font-bold wr-leading-[32px] wr-text-white">
                    <Seconds />
                  </div>
                </section>
              </CountdownProvider>
            </section>
          )}

          {status === MultiplayerGameStatus.Finish && showResult && (
            <div className={cn(styles.multiplier, styles[`m${multiplier}x`])}>
              <div className="wr-text-[32px]">{multiplier}x</div>
            </div>
          )}
        </div>
        <Wheel
          units={WheelUnits}
          spin={status === MultiplayerGameStatus.Finish}
          degree={
            status === MultiplayerGameStatus.Finish ? winnerAngle : undefined
          }
          onComplete={() => {
            setShowResult(true);
            onComplete && onComplete();
          }}
        />
      </div>
    </div>
  );
};
