import React, { useMemo } from "react";

import { genNumberArray } from "../../../../utils/number";

interface PlinkoDotRowsProps {
  size: number;
}

const Dots: React.FC<PlinkoDotRowsProps> = ({ size }) => {
  const count = useMemo(() => genNumberArray(size), [size]);

  return (
    <>
      {count.map((i) => (
        <div
          key={i}
          className="wr-flex wr-w-[50px] wr-h-[30px] wr-justify-center wr-items-center max-md:wr-w-[20px] max-md:wr-h-[20px]"
        >
          <div className="wr-rounded-full wr-bg-[#3A4D69] wr-bg-opacity-[0.25] wr-p-[4px] before:wr-content-[''] before:wr-block before:wr-w-[7px] before:wr-h-[7px] before:wr-rounded-sm before:wr-bg-[#696969] max-md:wr-p-[3px] max-md:before:wr-w-[4px] max-md:before:wr-h-[4px]" />
        </div>
      ))}
    </>
  );
};

export const DotRows: React.FC<PlinkoDotRowsProps> = ({ size }) => {
  const count = useMemo(() => genNumberArray(size + 3), [size]);

  return (
    <>
      {count.map(
        (k) =>
          k > 2 === true && (
            <div key={k} className="wr-flex wr-justify-center">
              <Dots size={k} />
            </div>
          )
      )}
    </>
  );
};
