import { NORMALIZED_PRECISION, WAGER_PRECISION } from '../../../strategist';
import { Option } from '../../../strategist/items/action';
import { Term as BetTerm, Type as BetType } from '../../../strategist/items/bet';
import { ProfitTerm, ProfitType } from '../../../strategist/items/profit';
import { parseToNumber } from '../../../utils/number';

export const getBetTypeString = (type: BetType) => {
  switch (type) {
    case BetType.Bet:
      return 'Bets';
    case BetType.Win:
      return 'Wins';
    case BetType.Lose:
      return 'Losses';
    default:
      return '';
  }
};

export const getBetTermString = (term: BetTerm) => {
  switch (term) {
    case BetTerm.Every:
      return 'Every';
    case BetTerm.EveryStreakOf:
      return 'Every Streak of';
    case BetTerm.FirstStreakOf:
      return 'First Streak of';
    case BetTerm.StreakGreaterThan:
      return 'Streak Greater Than';
    case BetTerm.StreakLowerThan:
      return 'Streak Lower Than';
    default:
      return '';
  }
};

export const getProfitTypeString = (type: ProfitType) => {
  switch (type) {
    case ProfitType.Balance:
      return 'Balance';
    case ProfitType.Lost:
      return 'Loss';
    case ProfitType.Profit:
      return 'Profit';
    default:
      return '';
  }
};

export const getProfitTermString = (term: ProfitTerm) => {
  switch (term) {
    case ProfitTerm.GreaterThan:
      return 'Greater Than';
    case ProfitTerm.GreaterThanOrEqualTo:
      return 'Greater Than or Equal To';
    case ProfitTerm.LowerThan:
      return 'Lower Than';
    case ProfitTerm.LowerThanOrEqualTo:
      return 'Lower Than or Equal To';
    default:
      return '';
  }
};

export const getActionOptionString = (option: Option) => {
  switch (option) {
    case Option.IncreaseByPercentage:
      return 'Increase By Percentage';
    case Option.DecreaseByPercentage:
      return 'Decrease By Percentage';
    case Option.IncreaseWinChanceBy:
      return 'Increase Win Chance By';
    case Option.DecreaseWinChanceBy:
      return 'Decrease Win Chance By';
    case Option.AddToAmount:
      return 'Add To Bet Amount';
    case Option.SubtractFromAmount:
      return 'Subtract From Bet Amount';
    case Option.AddToWinChance:
      return 'Add To Win Chance';
    case Option.SubtractFromWinChance:
      return 'Subtract From Win Chance';
    case Option.SetAmount:
      return 'Set Bet Amount';
    case Option.SetWinChance:
      return 'Set Win Chance';
    case Option.SwitchOverUnder:
      return 'Switch Over Under';
    case Option.ResetAmount:
      return 'Reset Bet Amount';
    case Option.ResetWinChance:
      return 'Reset Win Chance';
    case Option.Stop:
      return 'Stop Autobet';
    default:
      return '';
  }
};

export const getOptionAmount = (option: Option, amount: bigint) => {
  if (
    option == Option.IncreaseByPercentage ||
    option == Option.DecreaseByPercentage ||
    option == Option.IncreaseWinChanceBy ||
    option == Option.DecreaseWinChanceBy ||
    option == Option.AddToWinChance ||
    option == Option.SubtractFromWinChance ||
    option == Option.SetWinChance
  )
    return parseToNumber(amount, NORMALIZED_PRECISION) + '%';
  else if (
    option == Option.AddToAmount ||
    option == Option.SubtractFromAmount ||
    option == Option.SetAmount
  )
    return '$' + parseToNumber(amount, WAGER_PRECISION);
  else return 0;
};

export const getActionOptionType = (option: Option): 'WAGER' | 'NUMBER' | 'NONE' => {
  if (
    option == Option.IncreaseByPercentage ||
    option == Option.DecreaseByPercentage ||
    option == Option.IncreaseWinChanceBy ||
    option == Option.DecreaseWinChanceBy ||
    option == Option.AddToWinChance ||
    option == Option.SubtractFromWinChance ||
    option == Option.SetWinChance
  )
    return 'NUMBER';
  else if (
    option == Option.AddToAmount ||
    option == Option.SubtractFromAmount ||
    option == Option.SetAmount
  )
    return 'WAGER';
  else return 'NONE';
};
// switch overunder, reset bet amount, reset win chance, stop autobet
