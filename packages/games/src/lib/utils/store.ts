import type { StoreApi, UseBoundStore } from "zustand";
import { shallow } from "zustand/shallow";

/**
 * Select multiple keys from a store.
 *
 * example:
 *
 * store.ts
 *
 * export const useXStore = createSelectors<XStoreState>(xStore)
 *
 * const { x, y } = useXStore(["x", "y"])
 */
export const createSelectors = <T>(
  store: UseBoundStore<StoreApi<T>>,
) => {
  return <K extends keyof T>(keys: K[]) =>
    store((state: T) => {
      const x = keys.reduce((acc, cur) => {
        acc[cur] = state[cur];

        return acc;
      }, {} as T);

      return x as Pick<T, K>;
    }, shallow);
};
