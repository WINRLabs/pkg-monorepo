import { AnimatePresence, motion } from "framer-motion";

import { useOutsideClick } from "../../hooks/use-outside-click";
import { toFormatted } from "../../utils/web3";
import { useWinAnimationStore } from "./store";

export const WinAnimation = () => {
  const { show, multiplier, payout, updateWinAnimationState } =
    useWinAnimationStore();

  const handleOutsideClick = () =>
    updateWinAnimationState({
      payout: 0,
      show: false,
      multiplier: 0,
    });

  const ref = useOutsideClick(handleOutsideClick);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={ref}
          className="wr-absolute wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-z-10"
          initial={{
            opacity: 0.6,
            translateY: "-50%",
            translateX: "-50%",
            scaleX: 0.8,
            scaleY: 0.6,
          }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
          exit={{ opacity: 0.6, scaleX: 0.8, scaleY: 0.0 }}
        >
          <div className="wr-relative wr-border-[5px] wr-border-green-400 wr-rounded-lg wr-bg-[#204838] wr-w-[200px] wr-h-[140px] wr-scale-75 md:wr-scale-100">
            <div className="wr-absolute wr-top-1/2 wr-left-1/2 -wr-translate-x-1/2 -wr-translate-y-1/2 wr-flex wr-justify-center wr-items-center wr-gap-3 wr-flex-col">
              <h1 className="wr-text-4xl wr-font-bold">
                {toFormatted(multiplier, 2)}x
              </h1>
              <div className="wr-w-[60px] wr-h-[5px] wr-bg-[#366b55] wr-rounded-lg" />
              <p className="wr-font-semibold wr-text-3xl">
                ${toFormatted(payout, 2)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
