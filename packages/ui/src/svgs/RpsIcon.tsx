import type { SVGProps } from "react";
import * as React from "react";

const SvgRpsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 21"
    fill="none"
    {...props}
  >
    <g clipPath="url(#RPS-icon_svg__a)">
      <path
        fill="currentColor"
        d="M10 8.089 8.457 6.546a4.345 4.345 0 0 0 .293-1.582A4.373 4.373 0 0 0 4.375.589 4.373 4.373 0 0 0 0 4.964a4.373 4.373 0 0 0 4.375 4.375c.559 0 1.09-.106 1.582-.293L7.5 10.589l-1.543 1.543a4.345 4.345 0 0 0-1.582-.293A4.373 4.373 0 0 0 0 16.214a4.373 4.373 0 0 0 4.375 4.375 4.373 4.373 0 0 0 4.375-4.375c0-.559-.105-1.09-.293-1.582L19.5 3.589a.705.705 0 0 0 0-1 2.827 2.827 0 0 0-4 0l-5.5 5.5Zm.883 5.883 4.617 4.617a2.827 2.827 0 0 0 4 0 .705.705 0 0 0 0-1l-6.117-6.117-2.5 2.5ZM2.5 4.964a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Zm1.875 9.375a1.875 1.875 0 1 1 0 3.75 1.875 1.875 0 0 1 0-3.75Z"
      />
    </g>
    <defs>
      <clipPath id="RPS-icon_svg__a">
        <path fill="#fff" d="M0 .589h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgRpsIcon;
