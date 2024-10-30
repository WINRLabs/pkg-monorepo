import { Hex } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  part?: Hex;
  permit?: Hex;
  setPart: (part?: Hex) => void;
  setPermit: (permit?: Hex) => void;
  pin: string;
  setPin: (pin: string) => void;
  publicKey: string;
  setPublicKey: (publicKey: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      part: undefined,
      permit: undefined,
      setPart: (part?: Hex) => set({ part }),
      setPermit: (permit?: Hex) => set({ permit }),
      pin: '',
      setPin: (pin: string) => set({ pin }),
      publicKey: '',
      setPublicKey: (publicKey: string) => set({ publicKey }),
    }),
    {
      name: 'session-store',
    }
  )
);
