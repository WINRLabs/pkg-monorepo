'use client';

import React from 'react';

import { CreateStrategyModal } from './create-strategy';
import { useWeb3GamesModalsStore } from './modals.store';
import { RefundModal } from './refund';

const Web3GamesModalsTemplate = () => {
  const { modal, props } = useWeb3GamesModalsStore();

  const currentModal = React.useMemo(() => {
    switch (modal) {
      case 'refund':
        return <RefundModal {...props?.refund} />;

      case 'createStrategy':
        return <CreateStrategyModal {...props?.createStrategy} />;
      default:
        return <></>;
    }
  }, [modal]);

  return <>{currentModal}</>;
};

export default Web3GamesModalsTemplate;
