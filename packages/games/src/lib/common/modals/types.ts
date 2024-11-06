export type TWeb3GamesModals = 'refund' | 'createStrategy';

export type Web3GamesModalPropsStore = {
  refund: Web3GamesRefundModalProps;
  createStrategy: Web3GamesCreateStrategyModalProps;
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
  isCreatingStrategy?: boolean;
}

export type Web3GamesModalsStore = Web3GamesModalsStoreState & Web3GamesModalsStoreActions;
