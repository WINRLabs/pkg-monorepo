import React from 'react';

import { CDN_URL } from '../../../../constants';

export const BetLoader = () => {
  const images = ['icon-rock.svg', 'icon-paper.svg', 'icon-scissors.svg'];

  const [currentIdx, setCurrentIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentIdx((prevIdx) => (prevIdx === images.length - 1 ? 0 : prevIdx + 1));
    }, 200);

    return () => clearTimeout(interval);
  }, [currentIdx, images.length]);

  return (
    <img
      width={25}
      height={25}
      src={`${CDN_URL}/rps/${images[currentIdx]}`}
      alt="Justbet Decentralized Casino"
    />
  );
};
