import { createContext, useContext } from 'react';

export interface LevelUpContextType {
  onLevelUp?: () => Promise<void>;
}

const LevelUpContext = createContext<LevelUpContextType | null>(null);

export const LevelUpProvider = ({
  children,
  onLevelUp,
}: {
  children: React.ReactNode;
  onLevelUp?: () => Promise<void>;
}) => {
  return (
    <LevelUpContext.Provider
      value={{
        onLevelUp,
      }}
    >
      {children}
    </LevelUpContext.Provider>
  );
};

export const useLevelUp = () => {
  const context = useContext(LevelUpContext);
  if (!context) {
    throw new Error('useLevelUp must be used within a LevelUpProvider');
  }
  return context;
};
