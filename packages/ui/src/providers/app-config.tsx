import { createContext, useContext } from "react";

const AppConfigContext = createContext({});

export const useAppConfig = () => {
  const appConfig = useContext(AppConfigContext);
  return appConfig;
};

export const AppConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AppConfigContext.Provider value={{}}>{children}</AppConfigContext.Provider>
  );
};
