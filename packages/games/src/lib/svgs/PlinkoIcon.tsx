import type { SVGProps } from "react";
import * as React from "react";

const SvgPlinkoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.727 3.315a2.727 2.727 0 1 1-5.454 0 2.727 2.727 0 0 1 5.454 0Zm-1.363 0a1.364 1.364 0 1 1-2.728 0 1.364 1.364 0 0 1 2.728 0Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M6.364 13.315a2.727 2.727 0 1 0 0-5.454 2.727 2.727 0 0 0 0 5.454ZM16.364 10.588a2.727 2.727 0 1 1-5.455 0 2.727 2.727 0 0 1 5.455 0ZM2.727 20.588a2.727 2.727 0 1 0 0-5.455 2.727 2.727 0 0 0 0 5.455ZM12.727 17.86a2.727 2.727 0 1 1-5.454 0 2.727 2.727 0 0 1 5.454 0ZM17.273 20.588a2.727 2.727 0 1 0 0-5.455 2.727 2.727 0 0 0 0 5.455Z"
    />
  </svg>
);

export default SvgPlinkoIcon;
