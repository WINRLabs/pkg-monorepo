import React from "react";

import useMediaQuery from "../hooks/use-media-query";
import { useOrientation } from "../hooks/use-orientation";
import { Rotate } from "../svgs";

export const RotationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const orientation = useOrientation();

  const isMobile = useMediaQuery("(max-width: 1024px)");

  React.useEffect(() => {
    if (!document.body) return;

    if (isMobile && orientation.type !== "portrait-primary") {
      document.body.classList.remove("overflow-scroll-touch");

      document.body.classList.add("overflow-scroll-unset");
    } else {
      document.body.classList.add("overflow-scroll-touch");
    }

    return () => {
      document.body.classList.add("overflow-scroll-touch");
    };
  }, [isMobile, orientation.type]);

  if (isMobile && orientation.type === "portrait-primary")
    return (
      <section className="text-light fixed left-0 top-0 z-[999] flex h-[100dvh] w-[100dvw] flex-col items-center justify-center gap-2 overflow-hidden text-center font-bold backdrop-blur-lg">
        <Rotate />
        Please rotate your <br /> device to start playing
      </section>
    );
  else return children;
};
