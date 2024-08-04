import type { SVGProps } from "react";
import * as React from "react";

const SvgIconRps = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g clipPath="url(#icon-rps_svg__a)">
      <path
        fill="currentColor"
        d="M10 7.5 8.457 5.957a4.345 4.345 0 0 0 .293-1.582A4.373 4.373 0 0 0 4.375 0 4.373 4.373 0 0 0 0 4.375 4.373 4.373 0 0 0 4.375 8.75c.559 0 1.09-.105 1.582-.293L7.5 10l-1.543 1.543a4.345 4.345 0 0 0-1.582-.293A4.373 4.373 0 0 0 0 15.625 4.373 4.373 0 0 0 4.375 20a4.373 4.373 0 0 0 4.375-4.375c0-.559-.105-1.09-.293-1.582L19.5 3a.705.705 0 0 0 0-1 2.827 2.827 0 0 0-4 0L10 7.5Zm.883 5.883L15.5 18a2.827 2.827 0 0 0 4 0 .705.705 0 0 0 0-1l-6.117-6.117-2.5 2.5ZM2.5 4.375a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Zm1.875 9.375a1.875 1.875 0 1 1 0 3.75 1.875 1.875 0 0 1 0-3.75Z"
      />
    </g>
    <defs>
      <clipPath id="icon-rps_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgIconRps;
