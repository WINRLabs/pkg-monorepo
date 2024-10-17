import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '../../../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../../ui/select';
import { TowerForm } from '../../types';

const RiskController = () => {
  const form = useFormContext() as TowerForm;

  return (
    <FormField
      control={form.control}
      name="riskLevel"
      render={({ field }) => (
        <FormItem className="wr-mb-3 ">
          <FormLabel>Risk</FormLabel>
          <Select {...field} value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="wr-bg-zinc-950 wr-border-zinc-800">
                {field.value.charAt(0).toUpperCase() + field.value.slice(1) || 'Risk'}
              </SelectTrigger>
            </FormControl>

            <SelectContent className="wr-z-[400] wr-bg-zinc-800 wr-border-zinc-800">
              <SelectItem
                className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                value="easy"
              >
                Easy
              </SelectItem>
              <SelectItem
                className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                value="medium"
              >
                Medium
              </SelectItem>
              <SelectItem
                className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                value="hard"
              >
                Hard
              </SelectItem>
              <SelectItem
                className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                value="expert"
              >
                Expert
              </SelectItem>
              <SelectItem
                className="wr-flex wr-justify-between hover:wr-bg-zinc-900 wr-transition-all wr-duration-300"
                value="master"
              >
                Master
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default RiskController;
