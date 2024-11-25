import React from 'react';

interface PriceFeedProps {
  priceFeed: Record<string, number>;
}

type PriceFeedProviderProps = React.PropsWithChildren<PriceFeedProps>;

interface IPriceFeedProvider {
  priceFeed: Record<string, number>;
  getTokenPrice: (priceKey: string) => number;
}

export const PriceFeedContext = React.createContext<IPriceFeedProvider | null>(null);

export const PriceFeedProvider = ({ children, priceFeed }: PriceFeedProviderProps) => {
  const getTokenPrice = (priceKey: string): number => {
    const price = priceFeed?.[priceKey];

    if (price) return price;
    else return 1;
  };

  return (
    <PriceFeedContext.Provider value={{ priceFeed, getTokenPrice }}>
      {children}
    </PriceFeedContext.Provider>
  );
};

export const usePriceFeed = () => {
  const priceFeed = React.useContext(PriceFeedContext);
  if (!priceFeed) {
    throw new Error('Missing PriceFeedContext.Provider in the tree');
  }
  return priceFeed;
};
