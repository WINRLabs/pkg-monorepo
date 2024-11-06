export interface StrategyStruct {
  itemIds: number[];
  name: string;
  owner: string;
}

export interface StrategyItem {
  bet: {
    term: number;
    type_: number;
    amount: number;
  };
  profit: {
    term: number;
    type: number;
    amount: bigint;
  };
  action: {
    amount: bigint;
    option: number;
  };
}
