import { Hex } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getHashedPassword } from './lib';

interface SessionState {
  part?: Hex;
  permit?: Hex;
  setPart: (part?: Hex) => void;
  setPermit: (permit?: Hex) => void;
  pin: string;
  setPin: (pin: string) => void;
  publicKey: string;
  setPublicKey: (publicKey: string) => void;
  cachedNonce: number;
  setCachedNonce: (cachedNonce: number) => void;
  sessionCreatedAt: number;
  setSessionCreatedAt: (sessionCreatedAt: number) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      part: undefined,
      permit: undefined,
      setPart: (part?: Hex) => set({ part }),
      setPermit: (permit?: Hex) => set({ permit }),
      pin: '',
      setPin: (pin: string) => set({ pin: getHashedPassword(pin) }),
      publicKey: '',
      setPublicKey: (publicKey: string) => set({ publicKey }),
      cachedNonce: 0,
      setCachedNonce: (cachedNonce: number) => set({ cachedNonce }),
      sessionCreatedAt: 0,
      setSessionCreatedAt: (sessionCreatedAt: number) => set({ sessionCreatedAt }),
    }),
    {
      name: 'session-store',
    }
  )
);
