import { createContext, useContext } from 'react';

export interface ApiContextType {
  baseUrl?: string;
  disablePriceFeed?: boolean;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: ApiContextType;
}) => {
  return (
    <ApiContext.Provider
      value={{
        baseUrl: config?.baseUrl,
        disablePriceFeed: config?.disablePriceFeed,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApiOptions = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiOptions must be used within a ApiProvider');
  }
  return context;
};
