import type { SVGProps } from "react";
import * as React from "react";

const SvgIconChevronLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M13.09 2.744a.833.833 0 0 1 0 1.179L7.011 10l6.077 6.077a.833.833 0 0 1-1.178 1.179l-6.667-6.667a.833.833 0 0 1 0-1.178l6.667-6.667a.833.833 0 0 1 1.178 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgIconChevronLeft;
