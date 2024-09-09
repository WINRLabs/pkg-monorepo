import { useBadgeControllerAwardBadge } from '@winrlabs/api';
import { useCurrentAccount } from '@winrlabs/web3';
import debug from 'debug';

const log = debug('worker:UseGetBadges');

export enum Badge {
  LuckyWinner = 'LuckyWinner',
  BettingBuddy = 'BettingBuddy',
  BankrollBooster = 'BankrollBooster',
  StakingStar = 'StakingStar',
  VolumeUp = 'VolumeUp',
  StakingTycoon = 'StakingTycoon',
  ReferralBadge = 'ReferralBadge',
  BetVeteran = 'BetVeteran',
  BankrollHyperBooster = 'BankrollHyperBooster',
  BettingTitan = 'BettingTitan',
  LuckyStriker = 'LuckyStriker',
  WeeklyClaimer = 'WeeklyClaimer',
  LossLegend = 'LossLegend',
  WinrChainKingpin = 'WinrChainKingpin',
  BankrollCashCow = 'BankrollCashCow',
  StakingSage = 'StakingSage',
  JackpotJamboree = 'JackpotJamboree',
  VolumeWinner = 'VolumeWinner',
  LuckyStreak = 'LuckyStreak',
  GamblingGuru = 'GamblingGuru',
  DailyStreak = 'DailyStreak',
  WinrChainer = 'WinrChainer',
  HighRoller = 'HighRoller',
  LuckyRoller = 'LuckyRoller',
}

interface IUseGetBadgesParams {
  onPlayerStatusUpdate?: (d: {
    type: 'levelUp' | 'badgeUp';
    awardBadges: Badge[] | undefined;
    level: number | undefined;
  }) => void;
}

export const useGetBadges = ({ onPlayerStatusUpdate }: IUseGetBadgesParams) => {
  const { mutateAsync: getBadgeMutation } = useBadgeControllerAwardBadge({});
  const currentAccount = useCurrentAccount();

  const handleGetBadges = async ({
    totalWager,
    totalPayout,
  }: {
    totalWager: number;
    totalPayout: number;
  }) => {
    const multiplier = totalPayout / totalWager;
    const totalProfit = totalPayout - totalWager;
    log(multiplier, totalProfit, totalWager, totalPayout);
    const awardBadges = [];

    if (totalWager >= 1000) {
      const mutation = await getBadgeMutation({
        body: {
          type: Badge.HighRoller,
          player: currentAccount.address || '0x',
        },
      });

      if (mutation.awarded) awardBadges.push(Badge.HighRoller);
    }

    if (totalProfit <= -1000) {
      const mutation = await getBadgeMutation({
        body: {
          type: Badge.LossLegend,
          player: currentAccount.address || '0x',
        },
      });

      if (mutation.awarded) awardBadges.push(Badge.LossLegend);
    }

    if (multiplier >= 10) {
      const mutation = await getBadgeMutation({
        body: {
          type: Badge.LuckyRoller,
          player: currentAccount.address || '0x',
        },
      });

      if (mutation.awarded) awardBadges.push(Badge.LuckyRoller);
    }

    if (multiplier >= 1000) {
      const mutation = await getBadgeMutation({
        body: {
          type: Badge.BettingTitan,
          player: currentAccount.address || '0x',
        },
      });

      if (mutation.awarded) awardBadges.push(Badge.BettingTitan);
    }

    if (awardBadges.length && onPlayerStatusUpdate)
      onPlayerStatusUpdate({
        type: 'badgeUp',
        awardBadges,
        level: undefined,
      });
  };

  return {
    handleGetBadges,
  };
};
