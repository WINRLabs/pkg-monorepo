import { Address } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type BalanceMap = Record<Address, number>;

interface BalanceProviderProps {
  balances: BalanceMap;
}

interface BalanceProviderActions {
  updateBalances: (balances: BalanceMap) => void;
}

export type BalanceProvider = BalanceProviderProps & BalanceProviderActions;

export const useBalanceStore = create(
  persist<BalanceProvider>(
    (set) => ({
      balances: {},
      updateBalances: (balances: BalanceMap) => {
        set((prevState) => ({ ...prevState, balances }));
      },
    }),
    {
      name: "balance-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
