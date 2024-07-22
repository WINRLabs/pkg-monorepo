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
      <section className="wr-text-light wr-fixed wr-left-0 wr-top-0 wr-z-[999] wr-flex wr-h-[100dvh] wr-w-[100dvw] wr-flex-col wr-items-center wr-justify-center wr-gap-2 wr-overflow-hidden wr-text-center wr-font-bold wr-backdrop-blur-lg">
        <Rotate />
        Please rotate your <br /> device to start playing
      </section>
    );
  else return children;
};
