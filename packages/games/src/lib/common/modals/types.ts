import { BetConditionFormValues, ProfitConditionFormValues } from '../../strategist';

export type TWeb3GamesModals = 'refund' | 'createStrategy' | 'editStrategy';

export type Web3GamesModalPropsStore = {
  refund: Web3GamesRefundModalProps;
  createStrategy: Web3GamesCreateStrategyModalProps;
  editStrategy: Web3GamesEditStrategyModalProps;
};

export interface Web3GamesModalsStoreState {
  modal?: TWeb3GamesModals;
  props?: Partial<Web3GamesModalPropsStore>;
}

export interface Web3GamesModalsStoreActions {
  openModal: (modal: TWeb3GamesModals, props?: Partial<Web3GamesModalPropsStore>) => void;
  closeModal: () => void;
}

export interface Web3GamesRefundModalProps {
  isRefunding?: boolean;
  isRefundable?: boolean;
  playerRefund?: () => Promise<void>;
}

export interface Web3GamesCreateStrategyModalProps {
  createStrategy?: (strategyName: string) => Promise<void>;
}

export interface Web3GamesEditStrategyModalProps {
  addDefaultCondition?: (strategyId: number) => Promise<void>;
  removeCondition?: (strategyId: number, index: number) => Promise<void>;
  updateBetCondition?: (
    strategyId: number,
    itemId: number,
    condition: BetConditionFormValues
  ) => Promise<void>;
  updateProfitCondition?: (
    strategyId: number,
    itemId: number,
    condition: ProfitConditionFormValues
  ) => Promise<void>;
}

export type Web3GamesModalsStore = Web3GamesModalsStoreState & Web3GamesModalsStoreActions;
