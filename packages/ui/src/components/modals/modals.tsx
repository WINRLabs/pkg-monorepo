"use client";

import React, { useMemo } from "react";

import { LoginModal } from "./login";
import useModalsStore from "./modals.store";

export const WinrWeb3Modals: React.FC = () => {
  const { modal, props } = useModalsStore();

  const currentModal = useMemo(() => {
    switch (modal) {
      case "login":
        return <LoginModal />;

      default:
        return <></>;
    }
  }, [modal, props]);

  return <>{currentModal}</>;
};
