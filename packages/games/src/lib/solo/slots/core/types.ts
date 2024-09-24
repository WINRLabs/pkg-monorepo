export enum Slots_Unity_Events {
  BET = 'M3_SpinClick',
  CHANGE_BET = 'M3_ChangeBet',
  DOUBLE_CHANCE_CLICK = 'M3_DoubleChanceClick',
  BUY_FEATURE_CLICK = 'M3_BuyFeatureApproved',
  GRID_ANIMATION_FINISHED = 'M3_GridEnd',
  CLOSED_CONGRATULATIONS_PANEL = 'M3_OnCongInactive',
  GRID_ANIMATION_STARTED = 'M3_GridStart',
  SCATTER_TUMBLE_AMOUNT = 'M3_ScatterTumbleAmount',
  TUMBLE_AMOUNT = 'M3_TumbleAmount',
}

export enum Slots_Unity_Methods {
  LOGIN = 'M3_Login',
  SET_CREDIT_VALUE = 'M3_SetCreditValue',
  UPDATE_WIN_TEXT = 'M3_UpdateWin',
  UNLOCK_UI = 'M3_UnlockUI',
  SEND_GRID = 'M3_SendGrid',
  ENTER_FREE_SPIN = 'M3_EnterFreeSpin',
  EXIT_FREE_SPIN = 'M3_ExitFreeSpin',
  SET_SPIN_STATUS = 'M3_SetSpinStatus',
  SET_FREESPIN_AMOUNT = 'M3_SetFreeSpinCount',
  UPDATE_FREE_SPIN_COUNT = 'M3_SetFreeSpinCount',
  HIDE_FREE_SPIN_COUNT = 'M3_DeActiveFreeSpinCountText',
  DEACTIVE_AUTOBET_MODE = 'M3_DeactiveAutoplay',
  ACTIVE_AUTOBET_MODE = 'M3_ActiveAutoplay',
}

export enum WinrOfOlympus_Unity_Methods {
  ZEUS_ANIMATION_PLAY = 'G_ZeusAnimationPlay',
  SET_MULTIPLIER = 'M3_SetMultiplier',
}

export interface ReelSpinSettled {
  betAmount: number;
  scatterCount: number;
  tumbleCount: number;
  freeSpinsLeft: number;
  payoutMultiplier: number;
  grid: number[][];
  type: 'Game';
  spinType: SpinType;
}

export enum SpinType {
  NONE,
  NORMAL_SPIN,
  FREE_SPIN,
  DOUBLE_CHANCE,
}
