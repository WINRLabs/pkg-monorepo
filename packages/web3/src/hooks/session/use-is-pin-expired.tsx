import { useShallow } from 'zustand/react/shallow';

import { useSessionStore } from './session.store';

export const useIsPinExpired = () => {
  const sessionCreatedAt = useSessionStore(useShallow((state) => state.sessionCreatedAt));

  return sessionCreatedAt + 1000 * 60 * 60 * 24 * 30 < Date.now();
};
