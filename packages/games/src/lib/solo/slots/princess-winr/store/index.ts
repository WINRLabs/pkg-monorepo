import { create } from 'zustand';

interface State {
  freeSpins: number;
  isDoubleChance: boolean;
  betAmount: number;
  currentPayoutAmount: number;
  isLoggedIn: boolean;
  isInFreeSpinMode: boolean;
  gameUrl: string;
  prevWidth: number;
}

interface Actions {
  setFreeSpins: (freeSpins: number) => void;
  setIsDoubleChance: (isDoubleChance: boolean) => void;
  setBetAmount: (betAmount: number) => void;
  setCurrentPayoutAmount: (currentPayoutAmount: number) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsInFreeSpinMode: (isInFreeSpinMode: boolean) => void;
  setGameUrl: (gameUrl: string) => void;
  setPrevWidth: (prevWidth: number) => void;
}

export type PrincessWinrGameStore = State & Actions;

export const usePrincessWinrGameStore = create<PrincessWinrGameStore>((set) => ({
  freeSpins: 0,
  isDoubleChance: false,
  betAmount: 1,
  currentPayoutAmount: 0,
  isLoggedIn: false,
  isInFreeSpinMode: false,
  gameUrl: '',

  prevWidth: typeof window !== 'undefined' ? window.innerWidth : 0,

  setGameUrl: (gameUrl) => set({ gameUrl }),
  setPrevWidth: (prevWidth) => set({ prevWidth }),
  setFreeSpins: (freeSpins) => set({ freeSpins }),
  setIsDoubleChance: (isDoubleChance) => set({ isDoubleChance }),
  setBetAmount: (betAmount) => set({ betAmount }),
  setCurrentPayoutAmount: (currentPayoutAmount) => set({ currentPayoutAmount }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setIsInFreeSpinMode: (isInFreeSpinMode) => set({ isInFreeSpinMode }),
}));
