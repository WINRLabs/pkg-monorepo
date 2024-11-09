'use client';

import React from 'react';

import { useCustomBetStrategistStore } from '../../../hooks/use-custom-bet-strategist/store';
import { NormalizedStrategyStruct } from '../../../strategist';
import { IconStrategy } from '../../../svgs';
import { Button } from '../../../ui/button';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Input } from '../../../ui/input';
import { useWeb3GamesModalsStore } from '../modals.store';
import { Web3GamesCreateStrategyModalProps } from '../types';

export const CreateStrategyModal = ({ createStrategy }: Web3GamesCreateStrategyModalProps) => {
  const { modal, closeModal } = useWeb3GamesModalsStore();
  const [strategyName, setStrategyName] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isStrategyAdded, setIsStrategyAdded] = React.useState(false);

  const { allStrategies, setSelectedStrategy } = useCustomBetStrategistStore([
    'allStrategies',
    'setSelectedStrategy',
  ]);

  const handleClick = async () => {
    if (strategyName.length <= 0) return;
    setIsLoading(true);
    createStrategy && (await createStrategy(strategyName));
    setIsLoading(false);
    setIsStrategyAdded(true);
  };

  React.useEffect(() => {
    if (isStrategyAdded && allStrategies.length > 0) {
      setSelectedStrategy(allStrategies[allStrategies.length - 1] as NormalizedStrategyStruct);
      setIsStrategyAdded(false);
      closeModal();
    }
  }, [isStrategyAdded, allStrategies, setSelectedStrategy]);

  return (
    <Dialog open={modal === 'createStrategy'}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="wr-flex wr-items-center wr-gap-2">
            <IconStrategy className="wr-h-5 wr-w-5" />
            Create Strategy
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            placeholder="Strategy Name"
            className="wr-w-full wr-h-[48px] wr-bg-black wr-rounded-lg wr-font-semibold wr-px-4"
          />
          <Button
            className="wr-w-full wr-mt-3 wr-uppercase"
            variant="success"
            size="xl"
            onClick={handleClick}
            isLoading={isLoading}
          >
            Get Started
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
