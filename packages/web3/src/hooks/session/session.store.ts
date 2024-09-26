import { Hex } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  part?: Hex;
  permit?: Hex;
  setPart: (part?: Hex) => void;
  setPermit: (permit?: Hex) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      part: undefined,
      permit: undefined,
      setPart: (part?: Hex) => set({ part }),
      setPermit: (permit?: Hex) => set({ permit }),
    }),
    {
      name: 'session-store',
    }
  )
);
