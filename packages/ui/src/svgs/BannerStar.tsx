import type { SVGProps } from "react";
import * as React from "react";

const SvgBannerStar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 15"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.147 13.15a23 23 0 0 0-4.42-4.99l-.613-.517.612-.517a23 23 0 0 0 4.42-4.99l.87-1.327.869 1.326a23 23 0 0 0 4.42 4.991l.612.517-.612.517a23 23 0 0 0-4.42 4.99l-.87 1.328z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgBannerStar;
