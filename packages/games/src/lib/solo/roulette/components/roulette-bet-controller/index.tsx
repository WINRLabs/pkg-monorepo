// import React from "react";
// import { useFormContext } from "react-hook-form";

// import { ChipController } from "../../../../common/chip-controller";
// import { Chip } from "../../../../common/chip-controller/types";
// import {
//   UnityBetCountFormField,
//   UnityWagerFormField,
// } from "../../../../common/controller";
// import { PreBetButton } from "../../../../common/pre-bet-button";
// import { SkipButton } from "../../../../common/skip-button";
// import { CDN_URL } from "../../../../constants";
// import { Button } from "../../../../ui/button";
// import { NUMBER_INDEX_COUNT } from "../../constants";
// import useRouletteGameStore from "../../store";
// import { RouletteForm } from "../../types";

// export const RouletteBetController: React.FC<{
//   isPrepared: boolean;
//   selectedChip: Chip;
//   minWager: number;
//   maxWager: number;
//   onSelectedChipChange: (c: Chip) => void;
//   undoBet: () => void;
// }> = ({
//   isPrepared,
//   selectedChip,
//   minWager,
//   maxWager,
//   onSelectedChipChange,
//   undoBet,
// }) => {
//   const form = useFormContext() as RouletteForm;

//   const { rouletteGameResults, gameStatus } = useRouletteGameStore([
//     "rouletteGameResults",
//     "gameStatus",
//   ]);

//   return (
//     <div className="max-md:wr-bg-rotated-bg-blur wr-absolute wr-bottom-0 wr-left-0 wr-z-[5] wr-flex wr-w-full wr-items-end wr-justify-between wr-p-4 max-lg:wr-fixed max-lg:wr-z-10 max-lg:wr-bg-rotated-footer max-lg:wr-p-3 max-lg:wr-pt-0">
//       <div className="wr-w-full wr-max-w-[230px] max-md:wr-max-w-[140px]">
//         <UnityWagerFormField
//           className="wr-mb-3"
//           minWager={minWager}
//           maxWager={maxWager}
//         />
//         <UnityBetCountFormField className="wr-mb-0 wr-p-0" />
//       </div>

//       <ChipController
//         isDisabled={isPrepared}
//         selectedChip={selectedChip}
//         onSelectedChipChange={onSelectedChipChange}
//       />

//       <div className="wr-flex wr-w-full wr-max-w-[220px] wr-flex-col wr-items-end wr-gap-2 max-lg:wr-max-w-[200px] max-lg:wr-flex-row-reverse">
//         {!(rouletteGameResults.length > 3) && (
//           <PreBetButton>
//             <Button
//               type="submit"
//               variant="success"
//               size="xl"
//               disabled={
//                 form.getValues().totalWager === 0 ||
//                 form.formState.isSubmitting ||
//                 form.formState.isLoading ||
//                 isPrepared
//               }
//               isLoading={
//                 form.formState.isSubmitting || form.formState.isLoading
//               }
//               className="wr-w-full max-lg:wr-max-w-[75px]"
//             >
//               Bet
//             </Button>
//           </PreBetButton>
//         )}
//         {rouletteGameResults.length > 3 && gameStatus == "PLAYING" && (
//           <SkipButton />
//         )}
//         <div className="wr-flex wr-w-full wr-items-center wr-gap-2">
//           <Button
//             type="button"
//             disabled={isPrepared || form.getValues().totalWager === 0}
//             onClick={() => undoBet()}
//             variant="third"
//             size="xl"
//             className="wr-flex wr-w-full wr-items-center wr-gap-1"
//           >
//             <img
//               src={`${CDN_URL}/icons/icon-undo.svg`}
//               width={20}
//               height={20}
//               alt="Justbet Decentralized Casino"
//             />
//             <span className="max-lg:wr-hidden">Undo</span>
//           </Button>

//           <Button
//             type="button"
//             variant="third"
//             size="xl"
//             className="wr-flex wr-w-full wr-items-center wr-gap-1"
//             disabled={isPrepared}
//             onClick={() =>
//               form.setValue(
//                 "selectedNumbers",
//                 new Array(NUMBER_INDEX_COUNT).fill(0)
//               )
//             }
//           >
//             <img
//               src={`${CDN_URL}/icons/icon-trash.svg`}
//               width={20}
//               height={20}
//               alt="Justbet Decentralized Casino"
//             />
//             <span className="max-lg:wr-hidden">Clear</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };
