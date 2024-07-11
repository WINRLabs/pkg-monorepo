import type { SVGProps } from "react";
import * as React from "react";

const SvgInstagramLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M1.999 5.327a3.334 3.334 0 0 1 3.333-3.333h5.334a3.334 3.334 0 0 1 3.333 3.333v5.333a3.334 3.334 0 0 1-3.333 3.334H5.332A3.334 3.334 0 0 1 2 10.66V5.327Zm7.667.333a.667.667 0 1 1 1.334 0 .667.667 0 0 1-1.334 0ZM4.999 8.327a2.667 2.667 0 1 1 5.334 0 2.667 2.667 0 0 1-5.334 0Zm4 0a1.333 1.333 0 1 0-2.666 0 1.333 1.333 0 0 0 2.666 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgInstagramLogo;
