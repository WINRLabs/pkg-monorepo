import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '../../../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../../ui/select';
import { TowerForm } from '../../types';

const NumberOfCBetController = () => {
  const form = useFormContext() as TowerForm;

  return (
    <FormField
      control={form.control}
      name="numberOfBet"
      render={({ field }) => (
        <FormItem className="wr-mb-3 ">
          <FormLabel>Number of Bet</FormLabel>
          <FormControl>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <SelectTrigger className="wr-bg-zinc-950 wr-border-zinc-800">
                {field.value || 'Number of Bet'}
              </SelectTrigger>
              <SelectContent className="wr-z-[400] wr-bg-zinc-800 wr-border-zinc-800">
                {Array.from({ length: 10 }).map((_, index) => (
                  <SelectItem
                    key={index}
                    className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                    value={String(index + 1)}
                  >
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default NumberOfCBetController;
