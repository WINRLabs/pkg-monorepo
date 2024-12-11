import { create } from 'zustand';

interface CrashStore {
  isRunning: boolean;

  setIsRunning: (isRunning: boolean) => void;
}

export const useCrashStore = create<CrashStore>((set) => ({
  isRunning: false,
  setIsRunning: (isRunning: boolean) => set({ isRunning }),
}));
