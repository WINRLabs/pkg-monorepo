import React, { useEffect, useState } from "react";

import {
  SoundEffects,
  useAudioEffect,
} from "../../../../hooks/use-audio-effect";
import { genNumberArray } from "../../../../utils/number";
import { cn } from "../../../../utils/style";

const getBucketClassName = (multiplier: number): string | undefined => {
  if (multiplier > 0 && multiplier <= 0.25) {
    return "wr-bg-[#423b21] wr-border-[#423b21] wr-border-t-[#ffd000]";
  } else if (multiplier > 0.25 && multiplier <= 0.5) {
    return "wr-bg-[#423121] wr-border-[#423121] wr-border-t-[#ffa800]";
  } else if (multiplier > 0.5 && multiplier <= 1) {
    return "wr-bg-[#422d21] wr-border-[#422d21] wr-border-t-[#ff7a00]";
  } else if (multiplier > 1 && multiplier <= 2) {
    return "wr-bg-[#422129] wr-border-[#422129] wr-border-t-[#ff3d00]";
  }
};

interface PlinkoBucketProps {
  multiplier: number;
  value: number;
}

const Bucket: React.FC<PlinkoBucketProps> = ({ multiplier, value }) => {
  const [flash, setFlash] = useState(false);
  const effect = useAudioEffect(SoundEffects.FALLING);

  useEffect(() => {
    effect.play();

    if (value) {
      setFlash(true);
      setTimeout(() => setFlash(false), 250);
    }
  }, [value]);

  return (
    <div
      className={cn(
        "wr-flex wr-w-12 wr-h-[35px] wr-border wr-rounded wr-transition-all wr-duration-500 wr-justify-center wr-items-center wr-not-italic wr-font-bold wr-text-xs wr-leading-5 wr-border-t-4 wr-border-solid wr-border-[#422137] wr-border-t-[#d9113a] wr-bg-[#422137] max-md:wr-text-[9px] max-md:wr-w-[19px] max-md:[writing-mode:tb]",
        getBucketClassName(multiplier),
        {
          "wr-bg-[#283346] wr-transition-[0ms] wr-border-t-[#ff3d00] !wr-border-[#283346]":
            flash && multiplier < 1,
          "wr-bg-[#204838] wr-transition-[0ms] wr-border-t-[#38dd4a] wr-border-[#38dd4a]":
            flash && multiplier >= 1,
        }
      )}
    >
      {multiplier}x
    </div>
  );
};

interface PlinkoBucketsProps {
  size: number;
  values: number[];
  multipliers: number[];
}

export const Buckets: React.FC<PlinkoBucketsProps> = ({
  size,
  multipliers,
  values,
}) => {
  const count = genNumberArray(size + 1);

  return (
    <div
      className={cn(
        "wr-relative wr-z-[2] wr-flex wr-justify-center wr-gap-[2px] max-md:wr-gap-[1px]"
      )}
    >
      {count.map((i) => (
        <Bucket
          key={i}
          multiplier={multipliers[i] as number}
          value={values?.[i] ? values[i] || 0 : 0}
        />
      ))}
    </div>
  );
};
