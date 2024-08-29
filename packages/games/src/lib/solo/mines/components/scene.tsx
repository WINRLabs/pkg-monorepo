import { useFormContext } from 'react-hook-form';

import { FormField, FormItem } from '../../../ui/form';
import { useMinesGameStateStore } from '../store';
import { MinesForm } from '../types';
import MineCell from './cell';

export const MinesScene = ({
  currentMultiplier,
  isLoading,
}: {
  currentMultiplier: number;
  isLoading?: boolean;
}) => {
  const form = useFormContext() as MinesForm;

  const { board } = useMinesGameStateStore(['board']);

  return (
    <section className="wr-h-full wr-w-full wr-text-center lg:wr-h-[unset] lg:wr-w-[unset]">
      <FormField
        name="selectedCells"
        control={form.control}
        render={() => (
          <FormItem className="wr-mb-0 lg:wr-mb-1 wr-grid wr-aspect-square wr-grid-cols-5 wr-grid-rows-5 wr-items-center wr-justify-center lg:wr-gap-2 wr-gap-1 lg:wr-aspect-auto">
            {board.map((mine, idx) => {
              return <MineCell isLoading={isLoading} idx={idx} mineCell={mine} key={idx} />;
            })}
          </FormItem>
        )}
      />
      {/* <div className="wr-mx-auto wr-max-w-fit wr-rounded-lg wr-border wr-order-zinc-800 wr-bg-zinc-900 wr-px-8 wr-py-2 wr-text-4xl wr-font-bold">
        <p className="wr-mb-1 wr-text-sm wr-text-zinc-500">
          Current Multiplier
        </p>
        X <span>{currentMultiplier}</span>
      </div> */}
    </section>
  );
};
