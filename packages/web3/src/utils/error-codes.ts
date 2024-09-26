export enum ErrorCode {
  // Chain errors
  ExecutionReverted,
  FeeCapTooHigh,
  FeeCapTooLow,
  InsufficientFunds,
  IntrinsicGasTooHigh,
  IntrinsicGasTooLow,
  NonceMaxValue,
  NonceTooHigh,
  NonceTooLow,
  TipAboveFeeCap,
  TransactionTypeNotSupported,
  InvalidInputRpcError,
  UnknownNode,
  Unknown,
  Timeout,
  HttpRequest,
  RpcRequest,
  WebSocketRequest,
  DailyLimitExceeded,

  // Generic errors
  CannotBeZero = 100,
  MustBeGreater,
  MustBeLower,
  IncorrectAmount,

  // Controller errors
  InsufficientEscrow = 200,
  InsufficientBalance,
  SessionWaitingIteration,
  CallRevert,
  SendRevert,
  SessionNotIterable,
  SessionNotRefundable,
  ProgramDidNotRefund,
  RequestCouldNotFind,

  // RoleModule errors
  Unauthorized = 300,

  // RoleStore errors
  ThereMustBeAtLeastOneRoleAdmin = 400,
  ThereMustBeAtLeastOneTimelockMultiSig,

  // Budget errors
  ProgramHalted = 500,
  NoBudget,
  LossOverBudget,
  BudgetExceeded,

  // Operator errors
  NotOnSale = 600,
  OperatorBlocked,
  OperatorNotRegistered,
  AlreadyOperator,

  // Randomizer router errors
  AlreadyFilled = 700,
  NotScheduled,
  NotOnTargetTime,
  InvalidRandomNumber,

  // Game errors
  GameOver = 800,
  GameHalted,
  HasUncompletedGame,
  AlreadyCompleted,
  GameCountExceeded,
  ChoiceNotAllowed,
  MaxWagerExceeded,
  MinWagerNotMet,
  AlreadyClaimed,
  NotPlayersTurn,
  NoGame,
  InvalidState,
  GameCountZero,

  // Reward errors
  NoReward = 900,

  // Wheel errors
  NoClaim = 1000,
  NeedClaim,

  // Roulette errors
  MinChip = 1100,

  // Mines errors
  InvalidNumberCellsToReveal = 1200,
  GameEndsAfterReveal,
  OnlyRevealAfterFill,
  AlreadyRevealed,

  //Video Poker errors
  PayoutShouldGreaterThanOne = 1300,

  // Keno errors
  RandomIncorrect = 1400,

  // Winr Bonanza errors
  InFreeSpin = 1500,
  NoFreeSpin,
  FirstIndexMustBeZero,
  WeightSumIncorrect,
  IndexOutOfBound,
  PayoutShouldGreaterThanZero,

  // Blackjack Utils errors
  HandNotAwaitingHit = 1600,
  HandCannotSplit,
  HandCannotSplitMore,
  AllCardsDrawn,

  // Blackjack errors
  NotAwaitingRandom = 1700,
  BJGameInvalidState,
  InvalidAmountHands,
  AlreadyInsured,
  CannotInsure,
  DealerUnlucky,
  HandCannotDoubled,
  HandCannotBeDoubledAlreadyInsured,
  HandCannotBeSplitAlreadyInsured,
  HandAlreadyDoubled,
  MaxHandsExceeded,
  HandNotPlaying,
  HandNotYours,
  NotYourTurn,
  WaitYourTurn,

  // Poker errors
  HandResultError = 1800,

  // Dragon Castle
  InvalidDifficultyMode = 1900,
  NoWinStreak,
  InvalidSlotChoice,

  // Referral errors
  AlreadyRegistered = 2000,
  NotRegistered,
  CantRegisterYourOwn,

  // Strategy errors
  NotOwner = 2100,
  OutOfBound,

  // Badge errors
  NotFound = 2200,
  HasBadge,

  // Environment errors
  EnvExist = 2300,

  // Vault Guard errors
  VaultHalted = 2400,

  // Conditional Reward
  NoLoss = 2500,
  NoSpaceLeft,
  NotTime,

  // Bridger errors
  InvalidToken = 2600,
  InvalidAmount,
  TransferFailed,
  InvalidAddress,

  // Simple account errors
  AddressEmptyCode = 2700,
  ECDSAInvalidSignature,
  ECDSAInvalidSignatureLength,
  ECDSAInvalidSignatureS,
  ERC1967InvalidImplementation,
  ERC1967NonPayable,
  Expired,
  FailedInnerCall,
  InvalidInitialization,
  InvalidNonce,
  InvalidShortString,
  InvalidSigner,
  NotInitializing,
  StringTooLong,
  UUPSUnauthorizedCallContext,
  UUPSUnsupportedProxiableUUID,
  EIP712DomainChanged,

  // Entry point errors

  DelegateAndRevert = 2800,
  FailedOp,
  FailedOpWithRevert,
  PostOpReverted,
  ReentrancyGuardReentrantCall,
  SenderAddressResult,
  SignatureValidationFailed,

  // Vrf coordintator errors

  BlockhashNotInStore = 2900,
  IncorrectCommitment,
  InvalidConsumer,
  InvalidRequestConfirmations,
  InvalidSubscription,
  MustBeRequestedOwner,
  MustBeSubOwner,
  NoCorrespondingRequest,
  NoSuchProvingKey,
  NumWordsTooBig,
  PendingRequestExists,
  ProvingKeyAlreadyRegistered,
  Reentrant,
  TooManyConsumers,

  // Erc20 errors

  ERC20InsufficientAllowance = 3000,
  ERC20InsufficientBalance,
  ERC20InvalidApprover,
  ERC20InvalidReceiver,
  ERC20InvalidSender,
  ERC20InvalidSpender,

  UserRejectedRequest = 4001,
}

// FIXME: TEMPORARY FIX
export const mmAuthSessionErr = 'Session could not find for owner';

export const mmAuthSignErrors = [
  'Permit could not verify',
  'Keys are not matched',
  'Account has been destroyed',
  'Session is destroyed. Please create new',
  'Session could not find for owner',
  'Signature could not verify',
];
