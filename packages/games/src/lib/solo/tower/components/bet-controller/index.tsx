'use client';
import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { AnimatedTabContent } from '../../../../common/animated-tab-content';
import { AudioController } from '../../../../common/audio-controller';
import { BetControllerContainer } from '../../../../common/containers';
import { BetControllerTitle } from '../../../../common/controller';
import { cn } from '../../../../utils/style';
import { AutoController } from './auto-controller';
import { ManualController } from './manual-controller';

export interface Props {
  minWager: number;
  maxWager: number;
  isAutoBetMode: boolean;
  onAutoBetModeChange: React.Dispatch<React.SetStateAction<boolean>>;
  onLogin?: () => void;
}

export const BetController: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<string>('manual');

  return (
    <BetControllerContainer>
      <div className="max-lg:wr-flex max-lg:wr-flex-col">
        <div className="lg:wr-mb-3">
          <BetControllerTitle>Tower</BetControllerTitle>
          <div className="wr-text-zinc-500">Find gems on field and avoid mines</div>
        </div>

        <div className="wr-max-lg:flex wr-max-lg:flex-col">
          <Tabs.Root
            defaultValue="manual"
            value={tab}
            onValueChange={(v) => {
              if (!v) return;
              setTab(v);
            }}
          >
            <Tabs.List className="wr-flex wr-w-full wr-justify-between wr-items-center wr-gap-2 wr-font-semibold wr-mb-3">
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
            </Tabs.List>

            <AnimatedTabContent value="manual">
              <ManualController {...props} />
            </AnimatedTabContent>
            <AnimatedTabContent value="auto">
              <AutoController {...props} />
            </AnimatedTabContent>
          </Tabs.Root>
        </div>
        <footer className="wr-flex wr-items-center wr-justify-between lg:wr-mt-4">
          <AudioController />
        </footer>
      </div>
    </BetControllerContainer>
  );
};
