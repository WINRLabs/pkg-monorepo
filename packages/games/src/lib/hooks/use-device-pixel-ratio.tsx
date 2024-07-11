"use client";

import React from "react";

export const useDevicePixelRatio = () => {
  const [devicePixelRatio, setDevicePixelRatio] = React.useState<number>(() =>
    window ? window?.devicePixelRatio : 1
  );

  React.useEffect(
    function () {
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      const mediaMatcher = window.matchMedia(
        `screen and (resolution: ${devicePixelRatio}dppx)`
      );
      mediaMatcher.addEventListener("change", updateDevicePixelRatio);
      return function () {
        mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      };
    },
    [devicePixelRatio]
  );

  return devicePixelRatio;
};
