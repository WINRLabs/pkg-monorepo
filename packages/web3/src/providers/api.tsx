import { createContext, useContext } from 'react';

export interface ApiContextType {
  baseUrl?: string;
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
