import { create, SetState } from "zustand";

import { ModalsStore, ModalsStoreActions } from "./types";

const actions = (set: SetState<ModalsStore>): ModalsStoreActions => ({
  openModal: (modal, props) =>
    set((state) => ({ ...state, modal: modal, props })),
  closeModal: () =>
    set((state) => ({
      ...state,
      modal: undefined,
    })),
});

const state = {
  modal: undefined,
};

const modalsStore = (set: SetState<ModalsStore>) => ({
  ...state,
  ...actions(set),
});

const useModalsStore = create<ModalsStore>(modalsStore);

export default useModalsStore;
