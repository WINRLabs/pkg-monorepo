'use client';
import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { AnimatedTabContent } from '../../../../common/animated-tab-content';
import { AudioController } from '../../../../common/audio-controller';
import { Chip } from '../../../../common/chip-controller/types';
import { BetControllerContainer } from '../../../../common/containers';
import { BetMode, StrategyProps } from '../../../../types';
import { cn } from '../../../../utils/style';
import { AutoController } from './auto-controller';
import { ManualController } from './manual-controller';
import { IconStrategy } from '../../../../svgs';
import { StrategyController } from './strategy-controller';

export interface Props {
  isPrepared: boolean;
  selectedChip: Chip;
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  strategy: StrategyProps;
  isPinNotFound?: boolean;

  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onBetModeChange: React.Dispatch<React.SetStateAction<BetMode>>;
  onSelectedChipChange: (c: Chip) => void;
  undoBet: () => void;
  onLogin?: () => void;
}

export const BetController: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<string>('manual');

  React.useEffect(() => {
    if (tab == 'manual') props.onBetModeChange('MANUAL');
    else if (tab == 'auto') props.onBetModeChange('AUTO');
    else if (tab == 'strategy') props.onBetModeChange('AUTO_CUSTOM_STRATEGY');
  }, [tab]);

  return (
    <BetControllerContainer className="wr-z-30">
      <div className="wr-max-lg:flex wr-max-lg:flex-col">
        <Tabs.Root
          defaultValue="manual"
          value={tab}
          onValueChange={(v) => {
            if (!v) return;
            setTab(v);
          }}
        >
          <Tabs.List className="wr-flex wr-w-full wr-justify-between wr-items-center wr-gap-2 wr-font-semibold wr-mb-3 tabs-list">
            <Tabs.Trigger
              className={cn('wr-w-full wr-px-4 wr-py-2 wr-bg-zinc-700 wr-rounded-md', {
                'wr-bg-zinc-800 wr-text-grey-500': tab !== 'manual',
                'wr-pointer-events-none wr-bg-zinc-800 wr-text-grey-500': props.isAutoBetMode,
              })}
              value="manual"
            >
              Manual
            </Tabs.Trigger>
            <Tabs.Trigger
              className={cn('wr-w-full wr-px-4 wr-py-2 wr-bg-zinc-700 wr-rounded-md', {
                'wr-bg-zinc-800 wr-text-grey-500': tab !== 'auto',
                'wr-pointer-events-none wr-bg-zinc-800 wr-text-grey-500': props.isAutoBetMode,
              })}
              value="auto"
            >
              Auto
            </Tabs.Trigger>
            <Tabs.Trigger
              className={cn(
                'wr-w-full wr-p-2 wr-max-w-[40px] wr-flex wr-justify-center wr-bg-zinc-700 wr-rounded-md',
                {
                  'wr-bg-zinc-800 wr-text-grey-500': tab !== 'strategy',
                  'wr-pointer-events-none wr-bg-zinc-800 wr-text-grey-500': props.isAutoBetMode,
                }
              )}
              value="strategy"
            >
              <IconStrategy className="wr-h-5 wr-w-5" />
            </Tabs.Trigger>
          </Tabs.List>

          <AnimatedTabContent value="manual">
            <ManualController {...props} />
          </AnimatedTabContent>
          <AnimatedTabContent value="auto">
            <AutoController {...props} />
          </AnimatedTabContent>
          <AnimatedTabContent value="strategy">
            <StrategyController {...props} />
          </AnimatedTabContent>
        </Tabs.Root>
      </div>
      <footer className="wr-flex wr-items-center wr-justify-between lg:wr-mt-4">
        <AudioController />
      </footer>
    </BetControllerContainer>
  );
};
